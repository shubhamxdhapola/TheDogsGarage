import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from '../reactbits/BlurText.jsx';
import { GooeyNav } from '../reactbits/GooeyNav.jsx';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { getBreedImages } from '../../utils/breedImages.js';

export const PopularBreedsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Family Friendly', value: 'Family Friendly' },
    { label: 'Apartment Dogs', value: 'Apartment Dogs' },
    { label: 'Guard & Active', value: 'Guard & Active' },
    { label: 'Playful & Cute', value: 'Playful & Cute' },
  ];

  const breeds = [
    {
      name: 'Siberian Husky',
      category: 'Guard & Active',
      tag: 'Stunning Coat',
      traits: ['High Energy', 'Outgoing', 'Gentle'],
      size: 'Large',
      price: '₹28,000 - ₹45,000',
    },
    {
      name: 'German Shepherd',
      category: 'Guard & Active',
      tag: 'Protective & Smart',
      traits: ['Intelligent', 'Courageous', 'Alert'],
      size: 'Large',
      price: '₹25,000 - ₹40,000',
    },
    {
      name: 'Labrador Retriever',
      category: 'Family Friendly',
      tag: 'Playful & Loving',
      traits: ['Affectionate', 'Active', 'Gentle with Kids'],
      size: 'Large',
      price: '₹22,000 - ₹35,000',
    },
    {
      name: 'Golden Retriever',
      category: 'Family Friendly',
      tag: 'Most Popular',
      traits: ['Gentle', 'Loyal', 'Great with Kids'],
      size: 'Large',
      price: '₹32,000 - ₹48,000',
    },
  ];

  const filteredBreeds =
    selectedCategory === 'All'
      ? breeds
      : breeds.filter((b) => b.category === selectedCategory);

  return (
    <section className="py-12 bg-white rounded-3xl my-6 border border-stone-200/70 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Companions
            </span>
            <BlurText
              text="Explore Popular Breeds"
              delay={80}
              className="text-2xl sm:text-4xl font-black text-stone-900 font-display tracking-tight"
            />
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-medium">
              Find the perfect furry friend that matches your home, family size, and everyday lifestyle.
            </p>
          </div>

          {/* Category Filter Pills with GooeyNav */}
          <div className="overflow-x-auto pb-1">
            <GooeyNav
              items={categories}
              activeValue={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Breed Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredBreeds.map((breed) => {
              const images = getBreedImages(breed.name);
              return (
                <motion.div
                  layout
                  key={breed.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <SpotlightCard
                    spotlightColor="rgba(232, 106, 44, 0.08)"
                    spotlightSize={280}
                    className="group bg-stone-50/50 rounded-3xl p-4 border border-stone-200/80 hover:border-stone-400 hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      {/* Image Container with Hover Swap */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
                        <img
                          src={images.primary}
                          alt={breed.name}
                          className="w-full h-full object-cover group-hover:opacity-0 group-hover:scale-105 transition-all duration-500"
                          loading="lazy"
                        />
                        {images.secondary && (
                          <img
                            src={images.secondary}
                            alt={`${breed.name} alternate view`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black text-stone-900 shadow-xs z-10">
                          {breed.tag}
                        </div>
                        <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white z-10">
                          {breed.size}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-stone-900 font-display group-hover:text-amber-700 transition-colors">
                          {breed.name}
                        </h3>

                        {/* Personality Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {breed.traits.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-md bg-white border border-stone-200/60 text-[11px] font-bold text-stone-600 shadow-2xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action */}
                    <div className="pt-4 mt-3 border-t border-stone-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-display">
                          Price Range
                        </span>
                        <span className="text-xs font-black text-stone-900 font-display">
                          {breed.price}
                        </span>
                      </div>

                      <ClickSpark sparkColor="#E86A2C">
                        <Link
                          to={`/pets?breed=${encodeURIComponent(breed.name)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors group-hover:translate-x-0.5 duration-200"
                        >
                          <span>View Pups</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </ClickSpark>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularBreedsSection;
