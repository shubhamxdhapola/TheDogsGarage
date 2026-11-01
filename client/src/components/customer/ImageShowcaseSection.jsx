import React from 'react';
import { useSelector } from 'react-redux';
import { BlurText } from '../reactbits/BlurText.jsx';
import { InfiniteScroll } from '../reactbits/InfiniteScroll.jsx';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

export const ImageShowcaseSection = () => {
  const { cms } = useSelector((state) => state.cms);
  const data = cms?.home?.imageShowcase || defaultCmsData.home.imageShowcase;

  const showcaseImages =
    data.items && data.items.length > 0 ? data.items : defaultCmsData.home.imageShowcase.items;

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Clean Static Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
            {data.eyebrow || 'VISUAL CHRONICLES'}
          </span>
          <BlurText
            text={data.title || 'Life at The Dogs Garage'}
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-sm text-stone-500 font-medium">
            {data.description ||
              'Daily glimpses of nurturing care, spacious exercise, and happy companions.'}
          </p>
        </div>

        {/* Continuous Infinite Story Reel */}
        <div className="pt-2">
          <InfiniteScroll
            items={showcaseImages}
            speed={30}
            itemWidth={280}
            itemHeight={340}
          />
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;
