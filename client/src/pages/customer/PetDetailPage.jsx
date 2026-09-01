import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageSquare,
  Phone,
  CheckCircle2,
  Award,
  MapPin,
  ShieldCheck,
  Play,
  Sparkles,
  Camera,
  Film,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
} from 'lucide-react';
import { fetchPetById, clearSelectedPet } from '../../redux/slices/pet.slice.js';
import { formatCurrency, buildPetWhatsAppLink, buildCallLink } from '../../utils/helpers.js';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { GlareCard } from '../../components/reactbits/GlareCard.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { ScrollReveal } from '../../components/reactbits/ScrollReveal.jsx';

const getBreedPhotos = (breed, name) => {
  const b = (breed + ' ' + (name || '')).toLowerCase();
  if (b.includes('husky') || b.includes('shadow')) {
    return [
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?auto=format&fit=crop&w=1000&h=1000&q=80',
    ];
  }
  if (b.includes('shepherd') || b.includes('german') || b.includes('thor')) {
    return [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1588774069410-84ae30757c8e?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1000&h=1000&q=80',
    ];
  }
  if (b.includes('labrador') || b.includes('leo') || (b.includes('retriever') && !b.includes('golden'))) {
    return [
      'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&h=1000&q=80',
    ];
  }
  if (b.includes('golden') || b.includes('rocky')) {
    return [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&h=1000&q=80',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=1000&h=1000&q=80',
    ];
  }
  return [
    'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=1000&h=1000&q=80',
    'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1000&h=1000&q=80',
    'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=1000&h=1000&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&h=1000&q=80',
  ];
};

export const PetDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPet: pet, loading } = useSelector((state) => state.pets);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    dispatch(fetchPetById(id));
    return () => {
      dispatch(clearSelectedPet());
    };
  }, [dispatch, id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isLightboxOpen || activeVideoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, activeVideoModal]);

  if (loading || !pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 aspect-square bg-stone-200 rounded-3xl" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
              <div className="h-10 bg-stone-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compile gallery images
  const defaultGallery = getBreedPhotos(pet.breed, pet.name);
  const customImages = (pet.images || [])
    .map((img) => (typeof img === 'string' ? img : img.url))
    .filter((url) => url && !url.includes('dog-default'));

  const allPhotos = customImages.length > 0 ? customImages : defaultGallery;
  const mainPhoto = pet.images?.[0]?.url || pet.images?.[0] || pet.image || allPhotos[0];

  // Video data
  const videoGallery = pet.videos && pet.videos.length > 0 ? pet.videos : [
    {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-dog-catching-a-ball-in-a-park-1481-large.mp4',
      thumbnail: allPhotos[0],
      title: `${pet.name || 'Puppy'} Playing in the Grass`,
      duration: '0:24',
    },
    {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-little-dog-walking-on-the-grass-43890-large.mp4',
      thumbnail: allPhotos[1] || allPhotos[0],
      title: 'Outdoor Socialization & Gait Walk',
      duration: '0:18',
    },
    {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-petting-a-cute-puppy-in-her-hands-43888-large.mp4',
      thumbnail: allPhotos[2] || allPhotos[0],
      title: 'Gentle Handler Interaction & Cuddles',
      duration: '0:32',
    },
  ];

  const whatsAppUrl = buildPetWhatsAppLink(pet);
  const callUrl = buildCallLink();

  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev === 0 ? allPhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev === allPhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-8 pb-28 bg-[#FAFAFA] min-h-screen text-stone-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-8">
        
        {/* Professional Breadcrumb */}
        <nav className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium py-1 px-3 rounded-full bg-white border border-stone-200/80 shadow-2xs w-fit">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-stone-400" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
          <Link
            to="/pets"
            className="text-stone-500 hover:text-stone-900 transition-colors"
          >
            Puppies
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
          <span className="text-stone-900 font-bold">
            {pet.name || pet.breed}
          </span>
        </nav>

        {/* 1. TOP PET OVERVIEW SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Hero Image with Navigation Controls & See More Images */}
          <div className="lg:col-span-5 w-full max-w-md">
            <GlareCard
              maxTilt={6}
              glareOpacity={0.2}
              borderRadius="28px"
              className="w-full aspect-square rounded-[28px] overflow-hidden group cursor-pointer shadow-card"
              innerClassName="bg-stone-900 border-0 rounded-[28px]"
            >
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative w-full h-full rounded-[28px] overflow-hidden block"
              >
                <img
                  src={allPhotos[activePhotoIndex] || mainPhoto}
                  alt={pet.name || pet.breed}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Prev Photo Arrow */}
                {allPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-85 hover:opacity-100 hover:scale-110 cursor-pointer shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {/* Next Photo Arrow */}
                {allPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-85 hover:opacity-100 hover:scale-110 cursor-pointer shadow-md"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Bottom Left: See More Images CTA Button */}
                <div className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-[11px] font-bold backdrop-blur-sm shadow-xs transition-all cursor-pointer hover:scale-105"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>See All Photos ({allPhotos.length})</span>
                  </button>
                </div>

                {/* Bottom Right: Photo Counter & Age Pill */}
                <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                    {activePhotoIndex + 1}/{allPhotos.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                    {pet.age || 'Puppy'}
                  </span>
                </div>
              </div>
            </GlareCard>
          </div>

          {/* Right Column: Pet Information & Direct Inquiries */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <BlurText
                text={pet.breed?.toUpperCase() || 'COMPANION'}
                delay={30}
                className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block mb-1.5"
              />
              
              <div className="flex flex-wrap items-center gap-3">
                <BlurText
                  text={pet.name || pet.breed}
                  delay={50}
                  className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight"
                />

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide shadow-2xs ${
                    pet.isAvailable !== false ? 'bg-emerald-600 text-white' : 'bg-stone-600 text-white'
                  }`}>
                    {pet.isAvailable !== false ? 'Available For Adoption' : 'Adopted'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> KCI Verified
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <BlurText
                  text={`${pet.gender || 'Male'}  •  ${pet.age || 'Puppy'}  •  📍 ${pet.location || 'Bangalore, Karnataka'}`}
                  delay={25}
                  className="text-xs sm:text-sm text-stone-500 font-medium"
                />
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-stone-200/80">
              <BlurText
                text={formatCurrency(pet.price)}
                delay={40}
                className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-display"
              />
            </div>

            {/* Description */}
            <BlurText
              text={pet.description || `${pet.name || 'This companion'} is a healthy, purebred ${pet.breed} raised in a hygienic, climate-controlled nursery with verified champion bloodlines and continuous socialization.`}
              delay={15}
              className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium"
            />

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <SpotlightCard spotlightColor="rgba(232, 106, 44, 0.06)" className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-0.5">
                <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Gender</span>
                <span className="font-extrabold text-stone-900 text-xs">{pet.gender || 'Male'}</span>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(232, 106, 44, 0.06)" className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-0.5">
                <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Age</span>
                <span className="font-extrabold text-stone-900 text-xs">{pet.age || 'Puppy'}</span>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(232, 106, 44, 0.06)" className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-0.5">
                <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Health Status</span>
                <span className="font-extrabold text-emerald-700 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {pet.healthStatus || '42-Pt Checked'}
                </span>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(232, 106, 44, 0.06)" className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-0.5">
                <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Lineage</span>
                <span className="font-extrabold text-stone-900 text-xs flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> {pet.kciCertified ? 'KCI Certified' : 'Verified'}
                </span>
              </SpotlightCard>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <ClickSpark sparkColor="#E86A2C">
                <a
                  href={callUrl}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-card hover:shadow-float transition-all hover:scale-102"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Enquire About {pet.name || 'Pet'}</span>
                </a>
              </ClickSpark>

              <ClickSpark sparkColor="#10B981">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-card hover:shadow-float transition-all hover:scale-102"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </ClickSpark>
            </div>
          </div>
        </div>

        {/* 2. SEPARATE SECTION: PLAYTIME & NURSERY VIDEOS */}
        <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
          <div className="space-y-6 pt-10 border-t border-stone-200/80">
            
            {/* Videos Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200/60 text-xs font-bold text-amber-900">
                <Film className="w-3.5 h-3.5 text-amber-600" />
                <span>VIDEO ARCHIVE</span>
              </div>
              <BlurText
                text="Playtime & Nursery Video Clips"
                delay={40}
                className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight"
              />
              <BlurText
                text={`Watch live recorded videos of ${pet.name || 'this companion'} playing, socializing, and interacting with handlers.`}
                delay={18}
                className="text-xs sm:text-sm text-stone-500 font-medium"
              />
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videoGallery.map((vid, idx) => (
                <GlareCard
                  key={idx}
                  maxTilt={6}
                  glareOpacity={0.2}
                  borderRadius="20px"
                  className="aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-subtle hover:shadow-card"
                  innerClassName="bg-stone-900 border-0 rounded-2xl"
                >
                  <div
                    onClick={() => setActiveVideoModal(vid.url)}
                    className="relative w-full h-full rounded-2xl overflow-hidden block"
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-108 transition-transform duration-500"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 group-hover:bg-amber-600 text-stone-900 group-hover:text-white flex items-center justify-center shadow-card transition-all duration-300 group-hover:scale-110">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Gradient Overlay with Title and Duration */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex items-center justify-between text-white">
                      <h4 className="text-xs font-bold truncate max-w-[78%]">
                        {vid.title}
                      </h4>
                      <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                        {vid.duration}
                      </span>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                        <Film className="w-2.5 h-2.5" /> Live Clip
                      </span>
                    </div>
                  </div>
                </GlareCard>
              ))}
            </div>

          </div>
        </ScrollReveal>

        {/* 3. SEPARATE SECTION: PHOTO GALLERY ARCHIVE */}
        <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
          <div className="space-y-6 pt-10 border-t border-stone-200/80">
            
            {/* Photos Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200/60 text-xs font-bold text-emerald-900">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>PHOTO GALLERY</span>
              </div>
              <BlurText
                text="High-Resolution Photo Gallery"
                delay={40}
                className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight"
              />
              <BlurText
                text={`Explore verified studio portraits and natural candid shots of ${pet.name || 'this pet'}.`}
                delay={18}
                className="text-xs sm:text-sm text-stone-500 font-medium"
              />
            </div>

            {/* Photos Grid - Compact Sizing */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {allPhotos.map((photo, idx) => (
                <GlareCard
                  key={idx}
                  maxTilt={6}
                  glareOpacity={0.2}
                  borderRadius="14px"
                  className="aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-2xs"
                  innerClassName="bg-stone-900 border-0 rounded-xl"
                >
                  <div
                    onClick={() => {
                      setActivePhotoIndex(idx);
                      setIsLightboxOpen(true);
                    }}
                    className="relative w-full h-full rounded-xl overflow-hidden block"
                  >
                    <img
                      src={photo}
                      alt={`${pet.name || 'Pet'} Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Index Badge */}
                    <div className="absolute top-1.5 left-1.5 z-10">
                      <span className="px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                      <Maximize2 className="w-2.5 h-2.5" />
                      <span>Zoom</span>
                    </div>
                  </div>
                </GlareCard>
              ))}
            </div>

          </div>
        </ScrollReveal>

        {/* Full Image Lightbox Modal */}
        {isLightboxOpen && typeof document !== 'undefined' && createPortal(
          <div
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
            style={{ margin: 0, top: 0, left: 0 }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Fullscreen Image Display */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            >
              <img
                src={allPhotos[activePhotoIndex] || mainPhoto}
                alt={pet.name || pet.breed}
                className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Counter / Label */}
              <div className="mt-4 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold shadow-xs">
                {activePhotoIndex + 1} of {allPhotos.length} • {pet.name || pet.breed}
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Video Player Modal */}
        {activeVideoModal && typeof document !== 'undefined' && createPortal(
          <div
            onClick={() => setActiveVideoModal(null)}
            className="fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            style={{ margin: 0, top: 0, left: 0 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <video
                src={activeVideoModal}
                controls
                autoPlay
                className="w-full aspect-video object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 hover:bg-white text-white hover:text-black text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                ✕ Close
              </button>
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
};

export default PetDetailPage;
