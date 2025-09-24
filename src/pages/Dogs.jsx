import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BuyNowModal from "../components/BuyNowModal";

const dogs = [
  {
    name: "Labrador Retriever",
    description: "Friendly, outgoing, and great with families.",
    image: "/images/labrodor.jpg",
  },
  {
    name: "German Shepherd",
    description: "Confident, courageous, and highly intelligent.",
    image: "/images/germanshepherd.jpg",
  },
  {
    name: "Golden Retriever",
    description: "Loyal, gentle, and always eager to please.",
    image: "/images/goldenret.jpg",
  },
  {
    name: "Bulldog",
    description: "Calm, courageous, and loving companion.",
    image: "/images/bulldog.jpg",
  },
  {
    name: "Poodle",
    description: "Active, elegant, and exceptionally smart.",
    image: "/images/poodle.jpg",
  },
  {
    name: "Beagle",
    description: "Curious, merry, and friendly pack dog.",
    image: "/images/beagle.jpg",
  },
];

export default function Dogs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [modal, setModal] = useState({ open: false, breed: undefined });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((p) => (
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
        defaultCategory="dog"
        defaultBreed={modal.breed}
      />
    </div>
  );
}
