from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app import database, models
from app.models import ImageMetadata
from app.database import SessionLocal, engine
from sqlalchemy.orm import Session
import shutil
import uuid
import os
import boto3
import uuid
from twilio.rest import Client

twilio_client = Client(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)

TWILIO_PHONE_FROM = os.getenv("TWILIO_PHONE_FROM")
TO_PHONE_NUMBER = os.getenv("TO_PHONE_NUMBER")

app = FastAPI(title="Image Upload API")

origins = [
    "http://localhost:5173",  # Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-east-1"),
)

BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")



@app.post("/upload")
def upload_image(file: UploadFile = File(...)):
    # Nombre único para el archivo
    file_extension = file.filename.split(".")[-1]
    file_key = f"{uuid.uuid4()}.{file_extension}"

    # Subir directamente a S3
    s3.upload_fileobj(file.file, BUCKET_NAME, file_key)

    # Generar URL público
    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}"

    # Guardar metadatos en PostgreSQL
    db: Session = SessionLocal()
    new_image = ImageMetadata(title=file.filename, url=image_url)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    db.close()

    # Enviar SMS con Twilio
    twilio_client.messages.create(
        body=f"📸 Imagen subida: {file.filename}\nURL: {image_url}",
        from_=TWILIO_PHONE_FROM,
        to=TO_PHONE_NUMBER
    )

    return {"message": "Imagen subida exitosamente", "url": image_url}

@app.get("/images")
def get_images():
    db: Session = SessionLocal()
    images = db.query(ImageMetadata).all()
    db.close()
    return images
