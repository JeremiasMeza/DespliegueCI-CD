import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Upload from "./Upload";
import Gallery from "./Gallery";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-black/70 backdrop-blur sticky top-0 z-50 shadow border-b border-white/10">
          <nav className="container mx-auto px-6 py-4 flex justify-center space-x-12">
            <Link to="/" className="text-white hover:text-teal-400 transition">Subir Imagen</Link>
            <Link to="/galeria" className="text-white hover:text-teal-400 transition">Galería</Link>
          </nav>
        </header>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/galeria" element={<Gallery />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
