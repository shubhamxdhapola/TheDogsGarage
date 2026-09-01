import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { ClickSpark } from './ClickSpark.jsx';
import { Magnet } from './Magnet.jsx';
import { ShinyText } from './ShinyText.jsx';

export const PetSpotlightCarousel = ({ pets = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackPets = [
    {
      _id: 'bruno-golden',
      name: 'Bruno',
      breed: 'Golden Retriever',
      age: '4 Months',
      gender: 'Male',
      location: 'Bangalore Kennel',
      kciCertified: true,
      vaccinated: true,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      description: 'Exceptionally gentle, playful, and affectionate champion bloodline puppy ready for a warm loving home.',
    },
    {
      _id: 'luna-labrador',
      name: 'Luna',
      breed: 'Labrador Retriever',
      age: '3.5 Months',
      gender: 'Female',
      location: 'Bangalore Kennel',
      kciCertified: true,
      vaccinated: true,
      image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=600&q=80',
      description: 'Energetic, eager to please, and highly socialized puppy with verified KCI registration documents.',
    },
    {
      _id: 'rocky-shepherd',
      name: 'Rocky',
      breed: 'German Shepherd',
      age: '4.5 Months',
      gender: 'Male',
      location: 'Certified Facility',
      kciCertified: true,
      vaccinated: true,
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
      description: 'Noble posture, alert intelligence, and stable temperament with initial clinical immunization complete.',
    },
  ];

  const petList = pets.length > 0 ? pets : fallbackPets;
  const currentPet = petList[currentIndex] || petList[0];
  const petImage = currentPet.images?.[0] || currentPet.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % petList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + petList.length) % petList.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-3xl border border-stone-200/80 shadow-card">
      <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        
        {/* Single Focused Pet Image with Smooth Transition */}
        <div className="relative w-full md:w-1/2 aspect-square max-w-[340px] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-float shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPet._id || currentIndex}
              src={petImage}
              alt={currentPet.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/dog-default.png';
              }}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-black text-emerald-700 border border-emerald-200 shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> KCI Verified
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-xs font-bold">
              {currentPet.age}
            </span>
          </div>
        </div>

        {/* Pet Details & Controls */}
        <div className="flex-1 space-y-5 text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 font-display">
              {currentPet.breed}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-stone-900 font-display">
              {currentPet.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
              {currentPet.description || `${currentPet.breed} puppy available at ${currentPet.location || 'Bangalore'}. Full medical records and microchip provided.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-stone-600">
            <span className="px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
              Gender: <strong className="text-stone-900">{currentPet.gender || 'Male'}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
              Location: <strong className="text-stone-900">{currentPet.location || 'Bangalore'}</strong>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
            <ClickSpark sparkColor="#E86A2C">
              <Link
                to={`/pets/${currentPet._id || currentPet.id}`}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs hover:shadow-subtle transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
              >
                <ShinyText speed={2}>View Full Profile</ShinyText>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ClickSpark>

            {/* Prev / Next Navigation Buttons with Magnet */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <Magnet padding={15} magnetStrength={0.2}>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                  title="Previous Pet"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </Magnet>

              <Magnet padding={15} magnetStrength={0.2}>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                  title="Next Pet"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Magnet>

              <span className="text-xs font-bold text-stone-400 pl-2">
                {currentIndex + 1} / {petList.length}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PetSpotlightCarousel;
