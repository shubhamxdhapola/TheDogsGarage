import { useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import Carousel from "../components/Carousel";
import FAQ from "../components/FAQ";
import ContactForm from "../components/ContactForm";
import BuyNowModal from "../components/BuyNowModal";
import {
  Building,
  Facebook,
  Headset,
  Hourglass,
  Instagram,
  Mail,
  Map,
  MapPin,
  PawPrint,
  Truck,
  Users,
  Youtube,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Hero from "../components/Hero";
import About from "../components/About";
import Featured from "../components/Featured";
import Contact from "../components/Contact";

const dogData = [
  { 
    name: 'Labrador Retriever', 
    description: 'Friendly, outgoing, and great with families.', 
    image: '/images/labrodor.jpg'
  },
  { 
    name: 'German Shepherd', 
    description: 'Confident, courageous, and highly intelligent.', 
    image: '/images/germanshepherd.jpg' 
  },
  { 
    name: 'Golden Retriever', 
    description: 'Loyal, gentle, and always eager to please.', 
    image: '/images/goldenret.jpg' 
  },
];

const catData = [
  {
    name: "Persian",
    description: "Calm and affectionate with long fur.",
    image: "/images/persian.jpg",
  },
  {
    name: "Siamese",
    description: "Vocal, social, and elegant.",
    image: "/images/Siamese.jpg",
  },
  {
    name: "Maine Coon",
    description: "Large, playful, and friendly.",
    image: "/images/MaineCoon.jpg",
  },
];

export default function Home() {
  const [modal, setModal] = useState({
    open: false,
    category: undefined,
    breed: undefined,
  });
  return (
    <div id="top">
      <Hero />
      <About />
      <Featured
        data={dogData}
        heading="Featured Dogs"
        description="Playful, loyal, and ready for a new home."
        setModal={setModal}
      />
      <Featured
        data={catData}
        heading="Featured Cats"
        description="Elegant, curious, and full of affection."
        setModal={setModal}
      />

      <Contact />

      {/* <section id="faq" className="mt-10 mb-10 sm:mb-16" name="faq">
        <FAQ />
      </section> */}

      <BuyNowModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        defaultCategory={modal.category || "dog"}
        defaultBreed={modal.breed}
      />
    </div>
  );
}
