import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import Dogs from "./pages/Dogs";
import Cats from "./pages/Cats";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="px-4 md:px-10 lg:px-18 py-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dogs" element={<Dogs />} />
            <Route path="/cats" element={<Cats />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
