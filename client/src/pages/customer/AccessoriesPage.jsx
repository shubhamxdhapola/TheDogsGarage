import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Leaf,
  Check,
  Package,
  Minus,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts } from '../../redux/slices/product.slice.js';
import { addItemToCart } from '../../redux/slices/cart.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { GlareCard } from '../../components/reactbits/GlareCard.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';

const defaultProductImages = [
  '/images/product-shampoo.jpg',
  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
];

export const AccessoriesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.products);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const signatureProduct = products?.[0] || {
    _id: 'tdg-premium-dog-shampoo-250ml',
    name: 'The Dogs Garage Premium Dog Shampoo 250ml',
    category: 'Grooming & Coat Care',
    price: 650,
    originalPrice: 850,
    discount: 24,
    images: defaultProductImages,
    packageSize: '250ml Bottle',
    description:
      'Our flagship botanical shampoo crafted with natural silk proteins and organic extracts. Relieves dry, itchy skin while keeping your dog’s coat fluffy, lustrous, and fragrant without harsh chemicals.',
  };

  const productPhotos =
    signatureProduct.images && signatureProduct.images.length > 1
      ? signatureProduct.images.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean)
      : defaultProductImages;

  const currentPhoto = productPhotos[activeImgIndex] || productPhotos[0];

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ product: signatureProduct, quantity })).unwrap();
      toast.success(`Added ${quantity} to bag`);
    } catch (err) {
      toast.error('Could not add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ product: signatureProduct, quantity })).unwrap();
      navigate('/cart');
    } catch (err) {
      toast.error('Could not add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAFA] min-h-screen text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-black tracking-widest text-amber-700 uppercase font-display mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>THE GARAGE SHOP • SIGNATURE COLLECTION</span>
          </div>

          <BlurText
            text="The Garage Shop"
            delay={60}
            className="text-4xl sm:text-5xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-sm text-stone-500 font-medium leading-relaxed">
            Curated canine essentials developed to veterinary specifications. Currently showcasing our #1 rated organic grooming formula.
          </p>
        </div>

        {/* Hero Presentation of Signature Product */}
        <SpotlightCard
          spotlightColor="rgba(232, 106, 44, 0.08)"
          spotlightSize={500}
          className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200/80 shadow-card"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left: Product Images & Thumbnails (No Overlay Arrows) */}
            <div className="lg:col-span-5 flex flex-col items-center gap-3.5 w-full min-w-0">
              <GlareCard maxTilt={8} glareOpacity={0.2} borderRadius="24px" className="w-full max-w-sm" innerClassName="bg-stone-900 border-0 rounded-3xl">
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/80 group shadow-subtle block">
                  <img
                    src={currentPhoto}
                    alt={signatureProduct.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {signatureProduct.discount > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wide bg-amber-600 text-white uppercase shadow-xs">
                        {signatureProduct.discount}% OFF
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>100% Organic</span>
                    </span>
                  </div>

                  {/* Counter Pill */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                      {activeImgIndex + 1}/{productPhotos.length}
                    </span>
                  </div>
                </div>
              </GlareCard>

              {/* Product Photo Thumbnails */}
              <div className="flex items-center gap-2.5 max-w-sm justify-center flex-wrap">
                {productPhotos.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 bg-stone-900 transition-all cursor-pointer block ${
                      activeImgIndex === idx
                        ? 'border-amber-600 shadow-sm scale-105 ring-2 ring-amber-600/30'
                        : 'border-stone-200 opacity-75 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Detailed Information & Perfectly Aligned Buttons */}
            <div className="lg:col-span-7 space-y-6 w-full min-w-0">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight leading-tight">
                  {signatureProduct.name}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  {signatureProduct.description}
                </p>
              </div>

              {/* Price Box */}
              <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-3xl font-black text-stone-900 font-display tracking-tight">
                  {formatCurrency(signatureProduct.price)}
                </span>
                {signatureProduct.originalPrice > signatureProduct.price && (
                  <span className="text-sm text-stone-400 line-through font-bold">
                    {formatCurrency(signatureProduct.originalPrice)}
                  </span>
                )}
                {signatureProduct.discount > 0 && (
                  <span className="text-xs font-black text-emerald-800 uppercase bg-emerald-100 px-2.5 py-0.5 rounded-full ml-auto">
                    Save {formatCurrency(signatureProduct.originalPrice - signatureProduct.price)}
                  </span>
                )}
                <span className="text-xs text-stone-400 font-bold ml-2">
                  Size: {signatureProduct.packageSize || '250ml'}
                </span>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  <span>Relieves dry, itchy & sensitive skin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  <span>Silk proteins for soft & lustrous coat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  <span>100% Tearless & pH balanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  <span>Paraben-free & Vet recommended</span>
                </div>
              </div>

              {/* Perfectly Aligned Button Matrix */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  {/* Quantity Increase / Decrease Controls */}
                  <div className="flex items-center justify-between border-2 border-stone-200 rounded-xl bg-white p-1 shrink-0 h-12 shadow-2xs w-full sm:w-32">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-800 hover:bg-stone-100 disabled:opacity-30 cursor-pointer transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-center font-black text-sm text-stone-900 select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(signatureProduct.stock || 99, q + 1))}
                      disabled={quantity >= (signatureProduct.stock || 99)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-800 hover:bg-stone-100 disabled:opacity-30 cursor-pointer transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <ClickSpark sparkColor="#E86A2C" className="flex-1 w-full">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="w-full h-12 px-6 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-900 font-bold text-xs shadow-xs hover:shadow-subtle transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      <span>Add to Bag</span>
                    </button>
                  </ClickSpark>
                </div>

                {/* Buy Now Button - Full Width */}
                <ClickSpark sparkColor="#E86A2C" className="w-full block">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isAdding}
                    className="w-full h-12 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-50"
                  >
                    <ShinyText speed={2.5}>
                      Buy Now — {formatCurrency(signatureProduct.price * quantity)}
                    </ShinyText>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </ClickSpark>
              </div>
            </div>

          </div>
        </SpotlightCard>

      </div>
    </div>
  );
};

export default AccessoriesPage;
