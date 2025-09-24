import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BuyNowModal from "../components/BuyNowModal";

const cats = [
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
  {
    name: "Bengal",
    description: "Active with a wild spotted coat.",
    image: "/images/bengal.jpg",
  },
  {
    name: "Sphynx",
    description: "Curious, affectionate, and hairless.",
    image: "/images/Sphynx.jpg",
  },
  {
    name: "Ragdoll",
    description: "Gentle, calm, and loving.",
    image: "/images/Ragdoll.jpg",
  },
];

export default function Cats() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [modal, setModal] = useState({ open: false, breed: undefined });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cats</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cats.map((p) => (
          <ProductCard
            key={p.name}
            {...p}
            onBuy={() => setModal({ open: true, breed: p.name })}
          />
        ))}
      </div>
      <BuyNowModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        defaultCategory="cat"
        defaultBreed={modal.breed}
      />
    </div>
  );
}
