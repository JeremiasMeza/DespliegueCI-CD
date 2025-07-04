from sqlalchemy import Column, Integer, String
from app.database import Base


class ImageMetadata(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    url = Column(String)
