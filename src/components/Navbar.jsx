export default function Navbar() {
  return (
    <header className="sticky z-40 bg-white top-0 mx-auto w-full px-19 py-2">
      <div className="container mx-auto h-18 flex items-center justify-between gap-4">
        <a href="/" className="font-semibold text-xl">
          {" "}
          <span className="bg-white py-2 px-4 text-black border border-gray-300">
            The
          </span>
          <span className="bg-black py-2 px-4 text-white border border-black">
            Dogs
          </span>
          <span className="bg-white py-2 px-4 text-black border border-gray-300">
            Garage
          </span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <span className="bg-white py-2 px-4 text-black border border-gray-300">
            About
          </span>
          <span className="bg-black py-2 px-4 text-white border border-black">
            Contact
          </span>
          <span className="bg-white py-2 px-4 text-black border border-gray-300">
            FAQ
          </span>
        </div>
      </div>
    </header>
  );
}
