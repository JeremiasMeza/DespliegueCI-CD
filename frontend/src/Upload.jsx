import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMensaje(data.message);
    setFile(null);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white/5 p-8 rounded-xl shadow-lg backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">Subir Imagen</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Selecciona una imagen</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-100 bg-gray-800 border border-gray-700 rounded-md px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-md transition"
          >
            Subir Imagen
          </button>
        </form>

        {mensaje && (
          <p className="mt-6 text-center text-green-400 text-sm">{mensaje}</p>
        )}
      </div>
    </section>
  );
}
