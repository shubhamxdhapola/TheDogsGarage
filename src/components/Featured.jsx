import ProductCard from "./ProductCard";

const Featured = ({ data, heading, description, setModal }) => {
 
  return (
    <section className="mt-30 mb-10 sm:mb-16">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-center ">{heading}</h2>
        <div className="text-gray-800 text-center mt-2 max-w-4xl mx-auto">
          {description}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((p) => (
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
  );
};

export default Featured;
