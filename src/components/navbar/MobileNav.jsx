import { useEffect, useRef } from "react";
import { Link } from "react-scroll";

const MobileNav = ({ openMenu, setOpenMenu }) => {
    
  const menuRef = useRef("");
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  });

  return (
    <div
      ref={menuRef}
      className={`md:hidden bg-white/90 backdrop-blur-2xl border-gray-300 border fixed w-[90vw] z-20 -translate-x-1/2 left-1/2 duration-300 ${
        openMenu ? "bottom-4" : "-bottom-20"
      }`}
    >
      <div className="flex items-center justify-center p-4 gap-5 ">
        <Link
          to="about"
          className="bg-black py-2 px-4 text-white flex-1 text-center"
          onClick={() => setOpenMenu(false)}
        >
          About
        </Link>
        <Link
          to="contact"
          className="bg-black py-2 px-4 text-white flex-1 text-center"
          onClick={() => setOpenMenu(false)}
        >
          Contact
        </Link>
        {/* <Link
          to="faq"
          className="bg-black py-2 px-4 text-white flex-1 text-center"
          onClick={() => setOpenMenu(false)}
        >
          FAQ
        </Link> */}
      </div>
    </div>
  );
};

export default MobileNav;
