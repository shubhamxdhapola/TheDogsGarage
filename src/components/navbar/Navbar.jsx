import { Link } from "react-scroll";
import MobileNav from "./MobileNav";
import { AlignRight, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <header className="sticky z-40 bg-gray-50 top-0 w-full px-4 md:px-10 lg:px-18 py-2">
      <div className="h-18 flex items-center justify-between gap-4">
        <Link to="home" className="font-semibold md:text-xl">
          <span className="bg-white py-3 md:py-2 px-4 text-black border border-gray-500">
            The
          </span>
          <span className="bg-black py-3 md:py-2 px-4 text-white border border-black">
            Dogs
          </span>
          <span className="bg-white py-3 md:py-2 px-4 text-black border border-gray-500">
            Garage
          </span>
        </Link>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="about"
            className="bg-white py-2 px-4 text-black border border-gray-500 hover:bg-black hover:text-white duration-300 cursor-pointer"
          >
            About
          </Link>
          <Link
            to="contact"
            className="bg-black py-2 px-4 text-white border border-black hover:border-gray-500 hover:bg-white hover:text-black duration-300 cursor-pointer"
          >
            Contact
          </Link>
          {/* <Link
            to="faq"
            className="bg-white py-2 px-4 text-black border border-gray-300 hover:bg-black hover:text-white duration-300 cursor-pointer"
          >
            FAQ
          </Link> */}
        </div>

        {/* Mobile Navbar */}
        <div
          className="bg-white py-2 px-2 text-black border border-gray-500 cursor-pointer hover:bg-black hover:text-white duration-300 md:hidden"
          onClick={toggleOpenMenu}
        >
          {openMenu ? <X /> : <AlignRight />}
        </div>
        <MobileNav openMenu={openMenu} setOpenMenu={setOpenMenu} />
      </div>
    </header>
  );
}
