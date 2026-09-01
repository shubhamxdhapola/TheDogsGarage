import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Heart, ShieldCheck, Home, Zap, Users } from 'lucide-react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { ShinyText } from '../reactbits/ShinyText.jsx';

export const PetMatchmakerSection = () => {
  const [livingSpace, setLivingSpace] = useState('apartment');
  const [energyLevel, setEnergyLevel] = useState('gentle');
  const [experience, setExperience] = useState('family');

  const matches = {
    'apartment-gentle-family': {
      breed: 'Shih Tzu',
      tagline: 'Affectionate, quiet & hypoallergenic coat',
      image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=600&q=80',
      temperament: 'Sweet, calm & gentle with children',
      exercise: '30 mins/day',
      grooming: 'Moderate',
      link: '/pets',
    },
    'apartment-gentle-first': {
      breed: 'French Bulldog',
      tagline: 'Playful, low-barking & great for city apartments',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      temperament: 'Charming, adaptable & loving',
      exercise: '25 mins/day',
      grooming: 'Low maintenance',
      link: '/pets',
    },
    'house-gentle-family': {
      breed: 'Golden Retriever',
      tagline: 'The ultimate patient & loving family companion',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      temperament: 'Gentle, loyal, intelligent & eager to please',
      exercise: '60 mins/day',
      grooming: 'Regular brushing',
      link: '/pets',
    },
    'house-active-family': {
      breed: 'Labrador Retriever',
      tagline: 'Vibrant, friendly & loves outdoor adventures',
      image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=600&q=80',
      temperament: 'Outgoing, active, social & robust',
      exercise: '60-90 mins/day',
      grooming: 'Easy coat care',
      link: '/pets',
    },
    'villa-active-handler': {
      breed: 'German Shepherd',
      tagline: 'Noble guardian, loyal protector & agile learner',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
      temperament: 'Confident, brave, highly trainable',
      exercise: '90+ mins/day',
      grooming: 'Regular',
      link: '/pets',
    },
  };

  const currentKey = `${livingSpace}-${energyLevel}-${experience}`;
  const currentMatch =
    matches[currentKey] ||
    (livingSpace === 'apartment' ? matches['apartment-gentle-family'] : matches['house-gentle-family']);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200/60 text-xs font-bold text-amber-900 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>INTERACTIVE MATCHMAKER</span>
          </div>

          <BlurText
            text="Find Your Ideal Companion"
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Select your lifestyle and home dynamic to find the breed best suited for your family.
          </p>
        </div>

        {/* 2 Column Interactive Finder Card */}
        <SpotlightCard
          spotlightColor="rgba(232, 106, 44, 0.08)"
          className="bg-[#FAFAFA] rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Column: Interactive Preference Selectors */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Living Space */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-amber-600" />
                <span>1. Your Home Environment</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'apartment', label: 'Apartment / Flat' },
                  { id: 'house', label: 'Independent House' },
                  { id: 'villa', label: 'Villa with Yard' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLivingSpace(item.id)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      livingSpace === item.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Activity Preference */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>2. Energy & Play Routine</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gentle', label: 'Calm & Gentle' },
                  { id: 'active', label: 'Moderately Active' },
                  { id: 'handler', label: 'High Energy / Agility' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEnergyLevel(item.id)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      energyLevel === item.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Household Dynamic */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Household Dynamic</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'family', label: 'Family with Kids' },
                  { id: 'first', label: 'First-Time Parent' },
                  { id: 'handler', label: 'Experienced Handler' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExperience(item.id)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      experience === item.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Recommended Match Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-card space-y-5">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80">
                <img
                  src={currentMatch.image}
                  alt={currentMatch.breed}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-black text-amber-800 border border-amber-200 shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" /> 98% Match
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 font-display">
                  Recommended Breed
                </span>
                <h4 className="text-2xl font-black text-stone-900 font-display">
                  {currentMatch.breed}
                </h4>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  {currentMatch.tagline}
                </p>
              </div>

              {/* Trait Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Temperament</span>
                  <span className="font-bold text-stone-800 line-clamp-1">{currentMatch.temperament}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Daily Exercise</span>
                  <span className="font-bold text-stone-800">{currentMatch.exercise}</span>
                </div>
              </div>

              <ClickSpark sparkColor="#E86A2C">
                <Link
                  to={currentMatch.link}
                  className="w-full py-3.5 px-6 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                >
                  <ShinyText speed={2}>Explore Available {currentMatch.breed}s</ShinyText>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </ClickSpark>
            </div>
          </div>

        </SpotlightCard>

      </div>
    </section>
  );
};

export default PetMatchmakerSection;
