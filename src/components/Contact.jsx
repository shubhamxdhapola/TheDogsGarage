import { Building, Headset, Mail } from "lucide-react";
import ContactForm from "./ContactForm";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const DATA = [
  {
    Icon: Mail,
    text: "anuroopmishra@thedogsgarage.in",
    heading: "Email",
    url: "mailto:anuroopmishra@thedogsgarage.in",
  },
  {
    Icon: Headset,
    text: "+91 62643 69991",
    heading: "Contact No.",
    url: "tel:+916264369991",
  },
  {
    Icon: Building,
    text: "New York City, Indore, Madhya Pradesh - 452012",
    heading: "Address 1",
    url: "https://www.google.com/maps?rlz=1C1CHBD_enIN1027IN1027&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBBzg2NGowajeoAgCwAgA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KV8djx2d-2I5MZHC-SrVozA9&daddr=Bypass+Road,+Morod,+Madhya+Pradesh+452018",
  },
  {
    Icon: Building,
    text: "Srivastava Niwas, Gautam Gaj Garha, Jabalpur - 482003",
    heading: "Address 2",
    url: "https://www.google.com/maps/search/Gautam+Srivastava+Niwas,+Gautam+Gaj+Garha,+Jabalpur+-+482003+Gaj+Garha,+Jabalpur+-+482003/@23.1601721,79.8797298,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDkyMS4wIKXMDSoASAFQAw%3D%3D",
  },
];

const SOCIAL_HANDLES = [
  {
    Icon: FaFacebookF,
    url: "https://",
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

const Contact = () => {
  return (
    <section id="contact" className="mt-30 mb-10 sm:mb-16" name="contact">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-center">Contact Us</h2>
        <div className="text-gray-800 text-center mt-2 max-w-4xl mx-auto">
          Reach out today and find your perfect pet.
        </div>
      </div>
      <div className="flex flex-col xl:flex-row justify-center items-center gap-10 lg:gap-20 md:max-w-[80vw] lg:max-w-[60vw] xl:max-w-full mx-auto">
        <div className="xl:w-1/2 w-full">
          <ContactForm />
        </div>
        <div className="xl:w-1/2 w-full flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-start items-start">
            {DATA.map(({ Icon, text, url, heading }, index) => (
              <div
                className="flex gap-3 justify-center items-center"
                key={index}
              >
                <div className="md:text-lg text-gray-900 border border-gray-500 bg-white p-4 w-full duration-300">
                  <Icon className="size-6 text-gray-700" />
                  <span className="font-semibold mt-2 block">
                    {heading}
                  </span>

                  <a href={url} target="_blank" className="hover:underline">
                    {text}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="space-x-3 mx-auto md:mx-0 md:self-start mt-7 md:mt-4">
            {SOCIAL_HANDLES.map(({ Icon, url }, index) => (
              <Link
                key={index}
                to={url}
                target="_blank"
                className="border text-black border-gray-500 px-4 py-3 inline-block hover:bg-black hover:text-white duration-300"
              >
                <Icon className="size-6" />
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
