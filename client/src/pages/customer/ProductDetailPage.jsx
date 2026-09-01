import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Star,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Minus,
  Plus,
  Heart,
  ArrowRight,
  Leaf,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProductById, clearSelectedProduct } from '../../redux/slices/product.slice.js';
import { addItemToCart } from '../../redux/slices/cart.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { GlareCard } from '../../components/reactbits/GlareCard.jsx';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading } = useSelector((state) => state.products);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-stone-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4" />
              <div className="h-6 bg-stone-200 rounded w-1/3" />
              <div className="h-24 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['/images/product-shampoo.jpg'];

  const currentImage = images[activeImageIndex] || images[0];

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ product, quantity })).unwrap();
      toast.success('Added to bag');
    } catch (err) {
      toast.error('Could not add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ product, quantity })).unwrap();
      navigate('/cart');
    } catch (err) {
      toast.error('Could not add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-stone-500 flex items-center gap-2 font-medium flex-wrap">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/accessories" className="hover:text-stone-900 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-stone-900 font-bold truncate max-w-md">{product.name}</span>
        </nav>

        {/* Main Product Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          
          {/* Left Column: Product Imagery */}
          <div className="lg:col-span-6 w-full min-w-0 space-y-4">
            <GlareCard
              maxTilt={8}
              glareOpacity={0.2}
              borderRadius="28px"
              className="w-full"
              innerClassName="bg-stone-900 border-0 rounded-[28px]"
            >
              <div className="relative aspect-square w-full rounded-[28px] overflow-hidden bg-stone-900 border border-stone-200/80 shadow-card">
                <img
                  src={currentImage}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/product-shampoo.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wider bg-amber-600 text-white uppercase shadow-xs">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200 shadow-xs text-stone-400 hover:text-rose-500 hover:scale-110 transition-all cursor-pointer"
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </GlareCard>
          </div>

          {/* Right Column: Full Details & Ordering */}
          <div className="lg:col-span-6 w-full min-w-0 space-y-6">
            
            {/* Category & Title */}
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
                {product.category || 'CANINE ESSENTIALS'}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 font-display tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-display">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-stone-400 line-through font-bold">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-black text-amber-800 uppercase bg-amber-100 px-2.5 py-0.5 rounded-full ml-auto">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed font-medium">
              {product.description || 'Premium quality canine formula crafted to clinical standards for pet vitality and wellbeing.'}
            </p>

            {/* Highlights */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-2.5">
              <p className="text-xs font-black text-stone-400 uppercase tracking-wider">Product Highlights</p>
              <ul className="space-y-2 text-xs text-stone-700 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Genuine product formulated for canine health</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dermatologically tested & free of harsh sulfates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fast express dispatch directly from our facility</span>
                </li>
              </ul>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border-2 border-stone-200 rounded-full bg-white p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-black text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    disabled={quantity >= (product.stock || 99)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag */}
                <ClickSpark sparkColor="#E86A2C">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAdding}
                    className="flex-1 py-3.5 px-6 rounded-full bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-900 font-bold text-xs shadow-xs hover:shadow-subtle transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                  </button>
                </ClickSpark>
              </div>

              {/* Buy Now Button */}
              <ClickSpark sparkColor="#E86A2C">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || isAdding}
                  className="w-full py-4 px-8 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-50"
                >
                  <ShinyText speed={2.5}>Instant Checkout / Buy Now</ShinyText>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </ClickSpark>
            </div>

            {/* 3 Trust Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200/80 text-center">
              <SpotlightCard spotlightColor="rgba(83, 107, 79, 0.08)" className="p-3 bg-white rounded-2xl border border-stone-200/70 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">Verified Quality</span>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(232, 106, 44, 0.08)" className="p-3 bg-white rounded-2xl border border-stone-200/70 space-y-1">
                <Truck className="w-5 h-5 text-amber-600 mx-auto" />
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">Express Shipping</span>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(83, 107, 79, 0.08)" className="p-3 bg-white rounded-2xl border border-stone-200/70 space-y-1">
                <RotateCcw className="w-5 h-5 text-stone-800 mx-auto" />
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">Easy Returns</span>
              </SpotlightCard>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
