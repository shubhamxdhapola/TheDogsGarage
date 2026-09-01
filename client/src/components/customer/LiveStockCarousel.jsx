import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { fetchPets } from '../../redux/slices/pet.slice.js';
import { BlurText } from '../reactbits/BlurText.jsx';
import { GlareCard } from '../reactbits/GlareCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { getBreedImages } from '../../utils/breedImages.js';

export const LiveStockCarousel = () => {
  const dispatch = useDispatch();
  const { pets } = useSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchPets({ limit: 4 }));
  }, [dispatch]);

  const defaultPets = [
    {
      _id: 'pet-husky',
      name: 'Shadow',
      breed: 'Siberian Husky',
      age: '2 Months',
      gender: 'Male',
      location: 'Bangalore, Karnataka',
      price: 28000,
      images: [
        { url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?auto=format&fit=crop&w=800&h=800&q=80' },
      ],
    },
    {
      _id: 'pet-shepherd',
      name: 'Thor',
      breed: 'German Shepherd',
      age: '3 Months',
      gender: 'Male',
      location: 'Bangalore, Karnataka',
      price: 25000,
      images: [
        { url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1588774069410-84ae30757c8e?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&h=800&q=80' },
      ],
    },
    {
      _id: 'pet-labrador',
      name: 'Leo',
      breed: 'Labrador Retriever',
      age: '2.5 Months',
      gender: 'Male',
      location: 'Bangalore, Karnataka',
      price: 22000,
      images: [
        { url: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&h=800&q=80' },
      ],
    },
    {
      _id: 'pet-golden',
      name: 'Rocky',
      breed: 'Golden Retriever',
      age: '3 Months',
      gender: 'Male',
      location: 'Bangalore, Karnataka',
      price: 32000,
      images: [
        { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&h=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=800&h=800&q=80' },
      ],
    },
  ];

  const displayPets = pets && pets.length > 0 ? pets.slice(0, 4) : defaultPets;

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
              ETHICAL COMPANIONSHIP
            </span>
            <BlurText
              text="Meet the Pets"
              delay={60}
              className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight"
            />
            <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-xl">
              Each pup is raised in a clean, nurturing habitat with 42-point veterinary health checks and KCI certified lineage.
            </p>
          </div>

          <Link
            to="/pets"
            className="text-xs font-bold text-stone-900 hover:text-amber-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto group"
          >
            <span>View All Available Pets</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Pet Cards Grid with ReactBits GlareCard Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPets.map((pet, idx) => {
            const petId = pet._id || pet.id;
            const breedPair = getBreedImages(pet.breed, idx);

            // Extract valid uploaded photos from database / admin panel
            const validPhotos = Array.isArray(pet.images)
              ? pet.images
                  .map((img) => (typeof img === 'string' ? img : img?.url || img?.secure_url))
                  .filter((url) => url && typeof url === 'string' && !url.includes('dog-default') && url.trim().length > 0)
              : [];

            const primaryImg =
              validPhotos[0] ||
              (pet.image && !pet.image.includes('dog-default') ? pet.image : null) ||
              breedPair.primary;

            const secondaryImg =
              validPhotos[1] ||
              (validPhotos.length === 1 ? null : breedPair.secondary);

            const petName = pet.name || pet.breed || 'Companion';

            return (
              <ClickSpark key={petId} sparkColor="#E86A2C">
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
                        <img
                          src={primaryImg}
                          alt={petName}
                          onError={(e) => {
                            if (e.target.dataset.hasFallback) return;
                            e.target.dataset.hasFallback = 'true';
                            e.target.src = breedPair.primary;
                          }}
                          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                            secondaryImg
                              ? 'group-hover:opacity-0 group-hover:scale-105'
                              : 'group-hover:scale-110'
                          }`}
                          loading="lazy"
                        />

                        {secondaryImg && (
                          <img
                            src={secondaryImg}
                            alt={`${petName} alternate view`}
                            onError={(e) => {
                              if (e.target.dataset.hasFallback) return;
                              e.target.dataset.hasFallback = 'true';
                              e.target.src = breedPair.secondary;
                            }}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-110"
                            loading="lazy"
                          />
                        )}

                        {/* Top Badge with Shimmer Glow on Hover */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-black text-emerald-800 border border-emerald-200 shadow-xs flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            <ShieldCheck className="w-3.5 h-3.5" /> Vet Certified
                          </span>
                        </div>

                        {/* Age Pill Badge */}
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="px-2.5 py-0.5 rounded-full bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-bold group-hover:bg-amber-600 transition-colors duration-300">
                            {pet.age || '3 Months'}
                          </span>
                        </div>

                        {/* Subtle dark gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-base text-stone-900 group-hover:text-amber-700 transition-colors font-display truncate">
                              {petName}
                            </h4>
                            <span className="text-xs font-bold text-stone-400">
                              {pet.gender || 'Male'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">
                            {pet.breed}
                          </p>
                        </div>

                        {/* Location & CTA */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-400">
                            {pet.location || 'Bangalore'}
                          </span>
                          
                          <span className="text-xs font-black text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300 font-display">
                            <span>Meet {petName}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                        </div>
                      </div>

                    </div>
                  </GlareCard>
                </Link>
              </ClickSpark>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LiveStockCarousel;
