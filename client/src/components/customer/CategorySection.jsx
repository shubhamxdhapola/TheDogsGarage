import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { TiltedCard } from '../reactbits/TiltedCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';

export const CategorySection = () => {
  const categories = [
    {
      title: 'Food & Nutrition',
      subtitle: 'Wholesome puppy & adult kibble',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
      link: '/accessories?category=food',
      badge: 'Certified Organic',
    },
    {
      title: 'Grooming & Shampoo',
      subtitle: 'Gentle dermatologically tested coat care',
      image: '/images/product-shampoo.jpg',
      link: '/accessories?category=grooming',
      badge: 'Best Seller',
    },
    {
      title: 'Interactive Toys',
      subtitle: 'Mental enrichment & chew resistance',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
      link: '/accessories?category=toys',
      badge: 'Non-Toxic',
    },
    {
      title: 'Accessories & Leashes',
      subtitle: 'Ergonomic harnesses, bowls & collars',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
      link: '/accessories?category=accessories',
      badge: 'Premium Build',
    },
    {
      title: 'Healthcare & Wellness',
      subtitle: 'Vitamins, supplements & tick care',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
      link: '/accessories?category=healthcare',
      badge: 'Vet Endorsed',
    },
    {
      title: 'Beds & Comfort',
      subtitle: 'Orthopedic sleep & travel crates',
      image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
      link: '/accessories?category=beds',
      badge: 'Ultra Soft',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
              CURATED ESSENTIALS
            </span>
            <BlurText
              text="Everything They Need."
              delay={60}
              className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight"
            />
            <p className="text-sm text-stone-500 font-medium max-w-lg">
              Explore handpicked nutrition, wellness grooming, and play gear designed specifically for canine vitality.
            </p>
          </div>

          <Link
            to="/accessories"
            className="text-xs font-bold text-stone-900 hover:text-amber-600 flex items-center gap-1.5 transition-colors group self-start sm:self-auto"
          >
            <span>Explore All Categories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6 Category Grid with ReactBits TiltedCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <ClickSpark key={idx} sparkColor="#E86A2C">
              <Link to={cat.link} className="block group">
                <TiltedCard
                  maxTilt={10}
                  scale={1.02}
                  className="rounded-3xl bg-white border border-stone-200/80 shadow-subtle hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-48 bg-stone-50 overflow-hidden p-3 flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/dog-default.png';
                      }}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-108 transition-transform duration-700"
                      loading="lazy"
                    />
                    <span className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-black text-stone-800 uppercase tracking-wider shadow-xs border border-stone-200/60">
                      {cat.badge}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-extrabold text-base text-stone-900 group-hover:text-amber-700 transition-colors font-display flex items-center justify-between">
                        <span>{cat.title}</span>
                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>
                </TiltedCard>
              </Link>
            </ClickSpark>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
