import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { GlareCard } from '../reactbits/GlareCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { getBreedImages } from '../../utils/breedImages.js';

export const PetCard = ({ pet }) => {
  if (!pet) return null;

  const defaultBreedPair = getBreedImages(pet.breed);

  const validPhotos = Array.isArray(pet.images)
    ? pet.images
        .map((img) => (typeof img === 'string' ? img : img?.url || img?.secure_url))
        .filter((url) => url && typeof url === 'string' && !url.includes('dog-default') && url.trim().length > 0)
    : [];

  // Determine Primary Hero Image
  const primaryImage =
    validPhotos[0] ||
    (pet.image && !pet.image.includes('dog-default') ? pet.image : null) ||
    defaultBreedPair.primary;

  // Determine Secondary Hover Image
  const secondaryImage =
    validPhotos[1] ||
    (validPhotos.length === 1 ? null : defaultBreedPair.secondary);

  const petId = pet._id || pet.slug || pet.id;
  const petName = pet.name || pet.breed || 'Companion';

  return (
    <ClickSpark sparkColor="#E86A2C">
      <Link to={`/pets/${petId}`} className="block h-full group">
        <GlareCard
          maxTilt={10}
          glareOpacity={0.3}
          borderRadius="24px"
          className="h-full cursor-pointer"
        >
          <div className="flex flex-col h-full justify-between">
            
            {/* Pet Hero Image Container with Animated Hover Swap */}
            <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
              {/* Primary Image */}
              <img
                src={primaryImage}
                alt={petName}
                onError={(e) => {
                  if (e.target.dataset.hasFallback) return;
                  e.target.dataset.hasFallback = 'true';
                  e.target.src = defaultBreedPair.primary;
                }}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  secondaryImage
                    ? 'group-hover:opacity-0 group-hover:scale-105'
                    : 'group-hover:scale-110'
                }`}
                loading="lazy"
              />

              {/* Secondary Hover Image (Smooth cross-fade swap) */}
              {secondaryImage && (
                <img
                  src={secondaryImage}
                  alt={`${petName} alternate angle`}
                  onError={(e) => {
                    if (e.target.dataset.hasFallback) return;
                    e.target.dataset.hasFallback = 'true';
                    e.target.src = defaultBreedPair.secondary;
                  }}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-110"
                  loading="lazy"
                />
              )}

              {/* Top Badge with Shimmer Glow on Hover */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-black text-emerald-800 border border-emerald-200 shadow-xs flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Vet Certified</span><span className="xs:hidden">Verified</span>
                </span>
              </div>

              {/* Age Pill Badge */}
              <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-10">
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-stone-900/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold group-hover:bg-amber-600 transition-colors duration-300">
                  {pet.age || '3 Months'}
                </span>
              </div>

              {/* Subtle dark gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
            </div>

            {/* Content Section */}
            <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-extrabold text-sm sm:text-base text-stone-900 group-hover:text-amber-700 transition-colors font-display truncate">
                    {petName}
                  </h4>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-400 shrink-0">
                    {pet.gender || 'Male'}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 truncate">
                  {pet.breed}
                </p>
              </div>

              {/* Location & Interactive CTA with sliding arrow */}
              <div className="pt-2.5 sm:pt-3 border-t border-stone-100 flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 truncate max-w-[80px] sm:max-w-[110px]">
                  {pet.location || 'Bangalore'}
                </span>
                
                <span className="text-[10px] sm:text-xs font-black text-amber-700 flex items-center gap-0.5 sm:gap-1 group-hover:translate-x-1 transition-transform duration-300 font-display shrink-0">
                  <span>Meet {petName}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </span>
              </div>
            </div>

          </div>
        </GlareCard>
      </Link>
    </ClickSpark>
  );
};

export default PetCard;
