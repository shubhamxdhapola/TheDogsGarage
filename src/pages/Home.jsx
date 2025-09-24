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

const data = [
  {
    heading: "Dogs Collection",
    image: "/images/dog3.jpg",
  },
  {
    heading: "Cats Collection",
    image: "/images/cat3.jpg",
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
      <section>
        <Carousel />
      </section>

      {/* Services section removed */}

      <section id="shop" className="mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {data.map(({ heading, image }, index) => (
            <div className="relative  overflow-hidden" key={index}>
              <img src={image} alt="" className="h-100 object-cover w-full" />
              <div className="absolute bottom-8 left-8 bg-white p-4 z-12">
                <h1 className="text-xl font-bold">{heading}</h1>
                <p className="mt-2 underline">Explore Now</p>
              </div>
              <div className="absolute inset-0 bg-black/20 z-10"></div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="mt-30 mb-10 sm:mb-16">
        <h2 className="text-4xl font-bold text-center mb-10">About Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center">
          <div className="rounded-2xl grid grid-cols-2 gap-6">
            <div className="border border-gray-500 bg-white  px-6 py-4 flex flex-col gap-2 justify-center">
              <Users />
              <h1 className="text-lg  text-gray-900">2000+ Happy Customers</h1>
            </div>
            <div className="border border-gray-500 bg-white  px-6 py-4 flex flex-col gap-2 justify-center">
              <Truck />
              <h1 className="text-lg  text-gray-900">PAN India Delivery</h1>
            </div>
            <div className="border border-gray-500 bg-white  px-6 py-4 flex flex-col gap-2 justify-center">
              <Hourglass />
              <h1 className="text-lg  text-gray-900">8+ Years of Experience</h1>
            </div>
            <div className="border border-gray-500 bg-white  px-6 py-4 flex flex-col gap-2 justify-center">
              <PawPrint className="-rotate-45" />
              <h1 className="text-lg  text-gray-900">200+ Dogs Breeds</h1>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-gray-800 text-justify">
              We help families find the perfect dog or cat, with guidance from
              our caring team. From first visit to first cuddle, we make the
              journey simple, transparent, and joyful.
            </p>

            <ul className="space-y-2 text-gray-700 list-disc list-inside mt-2 text-justify">
              <li>Curated breeds with well-being first</li>
              <li>Personalized matching and support</li>
              <li>Trusted aftercare and tips</li>
            </ul>

            <div className="flex justify-between items-center gap-20 mt-6">
              <div className="flex-1">
                <button
                  href="#contact"
                  className="bg-black px-4 py-3 text-white w-full"
                >
                  Get in touch
                </button>
              </div>
              <div className="space-x-3">
                <button
                  href="#contact"
                  className="border text-black border-black px-4 py-3"
                >
                  <FaFacebookF className="size-6" />
                </button>
                <button
                  href="#contact"
                  className="border text-black border-black px-4 py-3"
                >
                  <FaInstagram className="size-6" />
                </button>
                <button
                  href="#contact"
                  className="border text-black border-black px-4 py-3"
                >
                  <FaYoutube className="size-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dogs" className="mt-30 mb-10 sm:mb-16">
        <h2 className="text-4xl font-bold text-center mb-8">Featured Dogs</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Golden Retriever",
              description: "Friendly and outgoing family dog.",
              image:
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "German Shepherd",
              description: "Confident, courageous, and smart.",
              image:
                "https://images.unsplash.com/photo-1517821099601-1aeb1bfee683?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Labrador Retriever",
              description: "Active, proud, and very smart.",
              image:
                "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1200&auto=format&fit=crop",
            },
          ].map((p) => (
            <ProductCard
              key={p.name}
              {...p}
              onBuy={() =>
                setModal({ open: true, category: "dog", breed: p.name })
              }
            />
          ))}
        </div>
      </section>

      <section id="cats" className="mt-30 mb-10 sm:mb-16">
        <h2 className="text-4xl font-bold text-center mb-8">Featured Cats</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Persian",
              description: "Sweet and gentle companion.",
              image:
                "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Siamese",
              description: "Elegant and intelligent talker.",
              image:
                "https://images.unsplash.com/photo-1553322395-0f502ce22270?q=80&w=1200&auto=format&fit=crop",
            },
            {
              name: "Maine Coon",
              description: "Gentle giant with a friendly nature.",
              image:
                "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1200&auto=format&fit=crop",
            },
          ].map((p) => (
            <ProductCard
              key={p.name}
              {...p}
              onBuy={() =>
                setModal({ open: true, category: "cat", breed: p.name })
              }
            />
          ))}
        </div>
      </section>

      <section id="faq" className="mt-10 mb-10 sm:mb-16">
        <FAQ />
      </section>

      {/* Newsletter section removed */}

      {/* Brands section removed */}

      <section id="contact" className="mt-20 mb-10 sm:mb-16">
        <h2 className="text-4xl font-bold text-center mb-8">Contact Us</h2>
        <div className="flex justify-center items-center gap-20">
          <div className="w-1/2">
            <ContactForm />
          </div>
          <div className="w-1/2">
            <div className="flex flex-col gap-6 justify-center">
              <div className="flex gap-3 justify-center items-center">
                <div className="bg-black p-[19px] text-white text-lg border">
                  <Mail />
                </div>
                <h1 className="text-lg text-gray-900 border border-gray-500 bg-white p-4 flex-1">
                  thedogsgarage@gmail.com
                </h1>
              </div>
              <div className="flex gap-3 justify-center items-center">
                <div className="bg-black p-[19px] text-white text-lg border">
                  <Headset />
                </div>
                <h1 className="text-lg text-gray-900 border border-gray-500 bg-white p-4 flex-1">
                  +91 62643 69991
                </h1>
              </div>

              <div className="flex gap-3 justify-center items-center">
                <div className="bg-black p-[19px] text-white text-lg">
                  <Building />
                </div>
                <h1 className="text-lg text-gray-900 border border-gray-500 bg-white p-4 flex-1">
                  New York City, Indore, Madhya Pradesh - 452012
                </h1>
              </div>
              <div className="flex gap-3 justify-center items-center">
                <div className="bg-black p-[19px] text-white text-lg border">
                  <Building />
                </div>
                <h1 className="text-lg text-gray-900 border border-gray-500 bg-white p-4 flex-1">
                  Srivastava Niwas, Gautam Gaj Garha, Jabalpur - 482003
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BuyNowModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        defaultCategory={modal.category || "dog"}
        defaultBreed={modal.breed}
      />
    </div>
  );
}
