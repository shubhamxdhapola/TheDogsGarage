import { Hourglass, PawPrint, Truck, Users } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Link as Navigate } from "react-scroll";

const DATA = [
  { Icon: Users, text: "500+ Happy Customers" },
  { Icon: Truck, text: "PAN India Delivery" },
  { Icon: Hourglass, text: "8+ Years of Experience" },
  { Icon: PawPrint, text: "200+ Dogs Breeds" },
];

const SOCIAL_HANDLES = [
  {
    Icon: FaFacebookF,
    url: "https://www.facebook.com",
  },
  {
    Icon: FaInstagram,
    url: "https://www.instagram.com/the_dogsgarage?igsh=MWlodjdkenJlY3B1cw==",
  },
  {
    Icon: FaYoutube,
    url: "https://youtube.com/@thedogsgarage?si=61QCjt_8WtiN2I6j",
  },
];

const About = () => {
  return (
    <section id="about" className="mt-30 mb-10 sm:mb-16" name="about">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-center ">About Us</h2>
        <div className="text-gray-800 text-center mt-2 max-w-4xl mx-auto">
          Connecting loving families with healthy, happy pets.
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DATA.map(({ Icon, text }, index) => (
            <div
              className="border border-gray-500 bg-white px-4 sm:px-6 py-4 flex flex-col gap-2 justify-center"
              key={index}
            >
              <Icon />
              <h1 className="text-lg  text-gray-900">{text}</h1>
            </div>
          ))}
        </div>

        <div className="flex flex-col px-2 md:px-0">
          <p className="text-gray-800 text-justify">
            We help families find the perfect dog or cat, with guidance from our
            caring team. From first visit to first cuddle, we make the journey
            simple, transparent, and joyful.
          </p>

          <ul className="space-y-2 text-gray-700 list-disc list-inside mt-2 text-justify">
            <li>Curated breeds with well-being first</li>
            <li>Personalized matching and support</li>
            <li>Trusted aftercare and tips</li>
          </ul>

          <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-4 md:gap-20 mt-6">
            <div className="flex-1">
              <Navigate
                to="contact"
                className="bg-black px-4 py-3 text-white w-full inline-block text-center hover:bg-white hover:text-black duration-300 border border-black cursor-pointer"
              >
                Get in touch
              </Navigate>
            </div>
            <div className="space-x-3 mx-auto justify-self-center flex justify-center items-center">
              {SOCIAL_HANDLES.map(({ Icon, url }, index) => (
                <Link
                  key={index}
                  to={url}
                  target="_blank"
                  className="border text-black border-black px-4 py-3 inline-block hover:bg-black hover:text-white duration-300"
                >
                  <Icon className="size-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
