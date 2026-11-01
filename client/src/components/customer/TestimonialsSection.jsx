import React from 'react';
import { useSelector } from 'react-redux';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';
import { VerticalMarquee } from '../reactbits/VerticalMarquee.jsx';
import { InfiniteScroll } from '../reactbits/InfiniteScroll.jsx';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

export const TestimonialsSection = () => {
  const { cms } = useSelector((state) => state.cms);
  const data = cms?.home?.testimonials || defaultCmsData.home.testimonials;

  const allReviews =
    data.reviews && data.reviews.length > 0 ? data.reviews : defaultCmsData.home.testimonials.reviews;

  // Split into 3 columns
  const col1Reviews = allReviews.filter((_, i) => i % 3 === 0);
  const col2Reviews = allReviews.filter((_, i) => i % 3 === 1);
  const col3Reviews = allReviews.filter((_, i) => i % 3 === 2);

  // If uneven, ensure columns have elements
  const c1 = col1Reviews.length > 0 ? col1Reviews : allReviews;
  const c2 = col2Reviews.length > 0 ? col2Reviews : allReviews;
  const c3 = col3Reviews.length > 0 ? col3Reviews : allReviews;

  const renderReviewCard = (rev, idx) => (
    <SpotlightCard
      key={idx}
      spotlightColor="rgba(232, 106, 44, 0.08)"
      className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-subtle hover:shadow-card transition-all space-y-3.5"
    >
      <div className="flex items-center text-amber-400 gap-0.5">
        {[...Array(rev.rating || 5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>

      <p className="text-xs text-stone-600 font-medium leading-relaxed italic">
        "{rev.review}"
      </p>

      <div className="pt-2 border-t border-stone-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center font-display shrink-0 shadow-2xs">
          {rev.name ? rev.name.charAt(0) : 'P'}
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
            <span>{data.capsule || '4.9 / 5 RATED BY 1,000+ PET PARENTS'}</span>
          </div>

          <BlurText
            text={data.title || 'Loved by Pet Parents.'}
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-sm text-stone-500 font-medium">
            {data.description ||
              'Real stories and verified experiences from families across Bangalore and India.'}
          </p>
          <p className="text-[11px] font-bold text-stone-400">
            {data.pauseHint || 'Hover over cards to pause scrolling'}
          </p>
        </div>

        {/* Desktop: 3-Column Multi-Directional Vertical Auto Scroll */}
        <div className="hidden md:grid grid-cols-3 gap-6 max-h-[500px] overflow-hidden">
          {/* Column 1: Upward */}
          <VerticalMarquee
            items={c1}
            speed={28}
            direction="up"
            pauseOnHover={true}
            renderItem={renderReviewCard}
          />

          {/* Column 2: Downward */}
          <VerticalMarquee
            items={c2}
            speed={32}
            direction="down"
            pauseOnHover={true}
            renderItem={renderReviewCard}
          />

          {/* Column 3: Upward */}
          <VerticalMarquee
            items={c3}
            speed={26}
            direction="up"
            pauseOnHover={true}
            renderItem={renderReviewCard}
          />
        </div>

        {/* Mobile: Horizontal list */}
        <div className="md:hidden">
          <div className="space-y-4">
            {allReviews.map((rev, idx) => renderReviewCard(rev, idx))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
