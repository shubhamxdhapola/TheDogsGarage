import { Link } from "react-router-dom";
import Carousel from "./Carousel";

const data = [
  {
    heading: "Dogs Collection",
    image: "/images/dog3.jpg",
    category: '/dogs'
  },
  {
    heading: "Cats Collection",
    image: "/images/cat3.jpg",
    category: '/cats'

  },
];

const Hero = () => {
  return (
    <section name="home">
      <Carousel />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
        {data.map(({ heading, image, category }, index) => (
          <div className="relative overflow-hidden" key={index}>
            <img src={image} alt="" className="h-100 object-cover w-full" />
            <div className="absolute bottom-8 left-8 bg-white p-4 z-12">
              <h1 className="text-xl font-bold">{heading}</h1>
              <Link to={category} className="mt-1.5 inline-block underline">Explore Now</Link>
            </div>
            <div className="absolute inset-0 bg-black/20 z-10"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
