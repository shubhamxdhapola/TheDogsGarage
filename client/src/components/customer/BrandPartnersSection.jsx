import React from 'react';
import { useSelector } from 'react-redux';
import { LogoLoop } from '../reactbits/LogoLoop.jsx';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

export const BrandPartnersSection = () => {
  const { cms } = useSelector((state) => state.cms);
  const data = cms?.home?.brandPartners || defaultCmsData.home.brandPartners;

  const eyebrow = data.eyebrow || 'Popular Breeds & Champion Lineages';
  const dogBreeds =
    data.items && data.items.length > 0 ? data.items : defaultCmsData.home.brandPartners.items;

  return (
    <section className="py-10 bg-white border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center">
          <p className="text-xs font-black tracking-widest text-stone-400 uppercase font-display">
            {eyebrow}
          </p>
        </div>

        <LogoLoop
          logos={dogBreeds}
          speed={35}
          pauseOnHover={true}
          className="my-1"
        />
      </div>
    </section>
  );
};

export default BrandPartnersSection;
