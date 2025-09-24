import { Link } from "react-router-dom";
import Slider from "react-slick";

const data = [
  {
    image: "/images/dog.jpg",
    heading: "Happy Paws",
    subHeading: "Bringing joy every single day",
    objPos: "center_-100px",
  },
  {
    image: "/images/dog2.jpg",
    heading: "Loyal Friend",
    subHeading: "Wagging tails, endless love",
    objPos: "center_-120px",
  },
  {
    image: "/images/cat1.jpg",
    heading: "Purr Magic",
    subHeading: "Soft paws, big hearts",
    objPos: "center_-130px",
  },
];

const Carousel = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="h-[450px] space-x-10">
      <Slider {...settings}>
        {data.map(({ image, heading, subHeading, objPos }, index) => (
          <div
            className="w-full h-[450px] relative overflow-hidden"
            key={index}
          >
            <img
              src={image}
              alt="image"
              className={`w-full h-full object-cover object-[${objPos}]`}
            />

            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center">
              <h1 className="text-7xl uppercase font-bold ">{heading}</h1>
              <h3 className="text-lg">{subHeading}</h3>
              <Link
                to="/dogs"
                className="mt-10 bg-white py-3 px-6 text-black hover:bg-black hover:text-white duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
