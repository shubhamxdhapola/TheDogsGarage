import React from 'react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { InfiniteScroll } from '../reactbits/InfiniteScroll.jsx';

export const ImageShowcaseSection = () => {
  const showcaseImages = [
    {
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      title: 'Golden Sunshine',
      tag: 'Play Time',
      description: 'Healthy socialization in open Bangalore runs.',
    },
    {
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
      title: 'Active Training',
      tag: 'Enrichment',
      description: 'Confidence-building routines and playtime.',
    },
    {
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
      title: 'Outdoor Walk',
      tag: 'Habitats',
      description: 'Ergonomic harnesses tested for daily agility.',
    },
    {
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      title: 'Healthy Meal',
      tag: 'Nutrition',
      description: 'Veterinary formulated clean nutrition.',
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nc3xlbnwwfHwwfHx8MA%3D%3D',
      title: 'Outdoor Walk',
      tag: 'Nutrition',
      description: 'Veterinary formulated clean nutrition.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Clean Static Header without cursor popup trail */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
            VISUAL CHRONICLES
          </span>
          <BlurText
            text="Life at The Dogs Garage"
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-sm text-stone-500 font-medium">
            Daily glimpses of nurturing care, spacious exercise, and happy companions.
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
