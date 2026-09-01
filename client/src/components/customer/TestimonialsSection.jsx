import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';
import { VerticalMarquee } from '../reactbits/VerticalMarquee.jsx';
import { InfiniteScroll } from '../reactbits/InfiniteScroll.jsx';

export const TestimonialsSection = () => {
  const col1Reviews = [
    {
      name: 'Ananya & Rohan Sharma',
      location: 'Indiranagar, Bangalore',
      pet: 'Adopted "Leo" (Golden Retriever)',
      review:
        'The transparent health certification and guidance from The Dogs Garage gave us complete peace of mind. Leo arrived healthy, active, and vaccinated.',
      rating: 5,
    },
    {
      name: 'Karthik Raman',
      location: 'HSR Layout, Bangalore',
      pet: 'Purchased Organic Shampoo',
      review:
        'Our Shih Tzu had sensitive itchy skin for months. Within 2 washes of their Botanical Shampoo, the scratching stopped completely and her coat is so soft.',
      rating: 5,
    },
    {
      name: 'Sneha Patel',
      location: 'Jayanagar, Bangalore',
      pet: 'Adopted "Bruno" (Labrador Pup)',
      review:
        'From kennel visit to doorstep arrival, the team was always accessible. Bruno is healthy, playful, and KCI registered as promised.',
      rating: 5,
    },
  ];

  const col2Reviews = [
    {
      name: 'Dr. Vikram Menon',
      location: 'Koramangala, Bangalore',
      pet: 'Veterinarian & Pet Parent',
      review:
        'As a veterinarian, I appreciate their strict ethical breeding standards and clean clinical records. Highly recommended to new pet parents.',
      rating: 5,
    },
    {
      name: 'Meera Iyer',
      location: 'Whitefield, Bangalore',
      pet: 'Adopted "Milo" (Beagle)',
      review:
        'Milo is the joy of our household! The post-adoption nutrition chart and weekly check-in calls made us feel completely supported.',
      rating: 5,
    },
    {
      name: 'Aditya Sen',
      location: 'MG Road, Bangalore',
      pet: 'Verified Customer',
      review:
        'Prompt delivery of pet grooming supplies and genuine advice on puppy diet. Best customer care experience in pet retail.',
      rating: 5,
    },
  ];

  const col3Reviews = [
    {
      name: 'Pooja Reddy',
      location: 'Sarjapur Road, Bangalore',
      pet: 'Adopted "Rocky" (German Shepherd)',
      review:
        'Rocky has exceptional temperament and strong bone density. The 42-point vet report was comprehensive and clear.',
      rating: 5,
    },
    {
      name: 'Naveen Kumar',
      location: 'Hebbal, Bangalore',
      pet: 'Regular Grooming Client',
      review:
        'The signature shampoo has a natural mild scent and cleans thoroughly without eye irritation. Truly a top-tier product.',
      rating: 5,
    },
    {
      name: 'Deepika Rao',
      location: 'JP Nagar, Bangalore',
      pet: 'Adopted "Daisy" (Poodle)',
      review:
        'The ethical housing conditions at the kennel impressed us immediately. Daisy is cheerful, confident, and well-socialized.',
      rating: 5,
    },
  ];

  const renderReviewCard = (rev, idx) => (
    <SpotlightCard
      key={idx}
      spotlightColor="rgba(232, 106, 44, 0.08)"
      className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-subtle hover:shadow-card transition-all space-y-3.5"
    >
      <div className="flex items-center text-amber-400 gap-0.5">
        {[...Array(rev.rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>

      <p className="text-xs text-stone-600 font-medium leading-relaxed italic">
        "{rev.review}"
      </p>

      <div className="pt-2 border-t border-stone-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center font-display shrink-0 shadow-2xs">
          {rev.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h5 className="font-extrabold text-xs text-stone-900 font-display truncate">
            {rev.name}
          </h5>
          <p className="text-[10px] text-stone-400 font-medium truncate">
            {rev.pet} • {rev.location}
          </p>
        </div>
      </div>
    </SpotlightCard>
  );

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-black tracking-widest text-amber-700 uppercase font-display mx-auto">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 / 5 RATED BY 1,000+ PET PARENTS</span>
          </div>

          <BlurText
            text="Loved by Pet Parents."
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-sm text-stone-500 font-medium">
            Real stories and verified experiences from families across Bangalore and India.
          </p>
          <p className="text-[11px] font-bold text-stone-400">
            Hover over cards to pause scrolling
          </p>
        </div>

        {/* Desktop: 3-Column Multi-Directional Vertical Auto Scroll */}
        <div className="hidden md:grid grid-cols-3 gap-6 max-h-[500px] overflow-hidden">
          {/* Column 1: Upward */}
          <VerticalMarquee
            items={col1Reviews}
            speed={28}
            direction="up"
            pauseOnHover={true}
            renderItem={renderReviewCard}
          />

          {/* Column 2: Downward */}
          <VerticalMarquee
            items={col2Reviews}
            speed={32}
            direction="down"
            pauseOnHover={true}
            renderItem={renderReviewCard}
          />

          {/* Column 3: Upward */}
          <VerticalMarquee
            items={col3Reviews}
            speed={26}
            direction="up"
            pauseOnHover={true}
            renderItem={renderReviewCard}
          />
        </div>

        {/* Mobile: Horizontal Infinite Carousel */}
        <div className="md:hidden">
          <div className="space-y-4">
            {col1Reviews.map((rev, idx) => renderReviewCard(rev, idx))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
