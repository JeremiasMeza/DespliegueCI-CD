import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/images")
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Error al cargar imágenes:", err));
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Galería de Imágenes</h1>

      {images.length === 0 ? (
        <p className="text-center text-gray-400">No hay imágenes subidas todavía.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white/5 p-3 rounded-xl shadow hover:shadow-lg transition duration-200"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-52 object-cover rounded-md"
              />
              <p className="text-sm text-center mt-2 truncate">{img.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
