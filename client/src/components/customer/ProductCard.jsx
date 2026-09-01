import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { addItemToCart } from '../../redux/slices/cart.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';

export const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ product, quantity: 1 })).unwrap();
      toast.success('Added to bag');
    } catch (err) {
      toast.error('Could not add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  const mainImage =
    product.images?.[0] ||
    '/images/product-shampoo.jpg';

  return (
    <SpotlightCard
      spotlightColor="rgba(232, 106, 44, 0.08)"
      spotlightSize={250}
      className="group bg-white rounded-3xl p-3.5 border border-stone-200/90 shadow-subtle hover:shadow-float transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1"
    >
      {/* Top Part: Image, Category, Title */}
      <div className="flex flex-col flex-1">
        {/* Product Image Area with Fixed Aspect Ratio */}
        <Link
          to={`/accessories/${product._id || product.slug}`}
          className="relative aspect-square w-full rounded-2xl overflow-hidden bg-tdg-cream/60 mb-3 flex items-center justify-center p-2.5 block shrink-0"
        >
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-108"
            loading="lazy"
          />

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-2.5 left-2.5 pointer-events-none">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-tdg-orange text-white uppercase shadow-xs">
                {product.discount}% OFF
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-400 hover:text-red-500 hover:bg-white shadow-xs transition-all cursor-pointer hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        </Link>

        {/* Product Info with Uniform Heights */}
        <div className="px-1 flex flex-col flex-1 justify-between space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium h-4">
            <span className="truncate max-w-[130px] font-bold text-stone-500 uppercase tracking-wider">{product.category}</span>
            {product.rating > 0 && (
              <span className="flex items-center text-tdg-yellow font-bold shrink-0">
                <Star className="w-3 h-3 fill-current inline mr-0.5" />
                {product.rating}
              </span>
            )}
          </div>

          <Link
            to={`/accessories/${product._id || product.slug}`}
            className="font-bold text-sm text-tdg-brown group-hover:text-tdg-orange transition-colors line-clamp-2 leading-snug min-h-[2.65rem] flex items-start font-display"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>
      </div>

      {/* Bottom Part: Price & Add to Bag */}
      <div className="px-1 pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-tdg-brown tracking-tight font-display">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <ClickSpark sparkColor="#E86A2C">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="p-2.5 rounded-full bg-tdg-brown text-white hover:bg-tdg-orange transition-all duration-200 shadow-xs hover:scale-110 active:scale-95 disabled:bg-stone-300 disabled:cursor-not-allowed shrink-0 cursor-pointer flex items-center justify-center"
            title="Add to Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </ClickSpark>
      </div>
    </SpotlightCard>
  );
};

export default ProductCard;
