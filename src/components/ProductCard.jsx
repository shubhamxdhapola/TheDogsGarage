export default function ProductCard({ image, name, description, onBuy }) {
  return (
    <div className="bg-white border border-gray-300 p-4">
      {image && (
        <img src={image} alt={name} className="w-full h-50 object-cover" />
      )}
      <div className="px-2 mt-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text text-gray-600 mt-1 ">{description}</p>

        <button
          onClick={onBuy}
          className="px-y py-2 w-full bg-black text-white mt-4 hover:bg-white hover:text-black duration-300 border-black border cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
