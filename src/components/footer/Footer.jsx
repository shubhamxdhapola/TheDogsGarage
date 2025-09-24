export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 text-gray-700 text-center">
        <p>
          © {new Date().getFullYear()} The Dogs Garage. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
