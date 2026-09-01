import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Star, Heart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { addItemToCart } from '../../redux/slices/cart.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { BlurText } from '../reactbits/BlurText.jsx';
import { TiltedCard } from '../reactbits/TiltedCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { ShinyText } from '../reactbits/ShinyText.jsx';

export const FeaturedProductsSection = ({ products = [] }) => {
  const dispatch = useDispatch();

  const sampleProducts = products.length > 0 ? products.slice(0, 4) : [
    {
      _id: 'prod-shampoo',
      name: 'The Dogs Garage Premium Dog Shampoo 250ml',
      category: 'Grooming',
      price: 650,
      originalPrice: 850,
      discount: 24,
      rating: 5.0,
      numReviews: 148,
      image: '/images/product-shampoo.jpg',
      badge: 'Best Seller',
    },
    {
      _id: 'prod-food-1',
      name: 'Royal Canin Maxi Puppy Balanced Kibble (3kg)',
      category: 'Food & Nutrition',
      price: 2450,
      originalPrice: 2800,
      discount: 12,
      rating: 4.9,
      numReviews: 92,
      image: '/images/category-food.jpg',
      badge: 'Vet Choice',
    },
    {
      _id: 'prod-toy-1',
      name: 'Tough Chew Natural Rubber Enrichment Toy',
      category: 'Toys',
      price: 499,
      originalPrice: 699,
      discount: 28,
      rating: 4.8,
      numReviews: 64,
      image: '/images/category-toys.jpg',
      badge: 'Durable',
    },
    {
      _id: 'prod-acc-1',
      name: 'Ergonomic Reflective Padded Harness & Leash',
      category: 'Accessories',
      price: 1199,
      originalPrice: 1599,
      discount: 25,
      rating: 4.9,
      numReviews: 81,
      image: '/images/category-accessories.jpg',
      badge: 'Comfort Fit',
    },
  ];

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(addItemToCart({ product, quantity: 1 })).unwrap();
      toast.success(`${product.name.slice(0, 20)}... added to bag!`);
    } catch (err) {
      toast.error('Failed to add to bag');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
              TOP RATED CARE ESSENTIALS
            </span>
            <BlurText
              text="Pet Favorites"
              delay={60}
              className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight"
            />
            <p className="text-sm text-stone-500 font-medium max-w-lg">
              Tested for quality, comfort, and safety to keep your furry friend happy and healthy.
            </p>
          </div>

          <Link
            to="/accessories"
            className="text-xs font-bold text-stone-900 hover:text-amber-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Product Cards Grid with ReactBits TiltedCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => {
            const productId = product._id || product.id;
            const image = product.image || product.images?.[0] || '/images/product-shampoo.jpg';

            return (
              <ClickSpark key={productId} sparkColor="#E86A2C">
                <Link to={`/accessories/${productId}`} className="block h-full group">
                  <TiltedCard
                    maxTilt={8}
                    scale={1.02}
                    className="rounded-3xl bg-white border border-stone-200/80 shadow-subtle hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* Image Area */}
                    <div className="relative h-52 bg-stone-50/80 p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                          {product.badge}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold text-stone-800">{product.rating || 5.0}</span>
                          <span className="text-[11px] text-stone-400 font-medium">
                            ({product.numReviews || 50}+)
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2 font-display">
                          {product.name}
                        </h4>
                      </div>

                      {/* Price & Add to Cart Action */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-black text-stone-900 font-display">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-stone-400 line-through ml-2">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          className="p-2.5 rounded-full bg-stone-900 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-xs hover:scale-110 active:scale-95"
                          title="Add to Bag"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </TiltedCard>
                </Link>
              </ClickSpark>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProductsSection;
