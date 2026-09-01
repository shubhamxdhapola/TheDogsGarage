import React from 'react';
import { LogoLoop } from '../reactbits/LogoLoop.jsx';

export const BrandPartnersSection = () => {
  const dogBreeds = [
    { name: 'Golden Retriever', icon: '🦮' },
    { name: 'Labrador Retriever', icon: '🐕' },
    { name: 'French Bulldog', icon: '🐾' },
    { name: 'Shih Tzu', icon: '🐶' },
    { name: 'Beagle', icon: '🦴' },
    { name: 'German Shepherd', icon: '🐕‍🦺' },
    { name: 'Cocker Spaniel', icon: '🐾' },
    { name: 'Siberian Husky', icon: '🐺' },
    { name: 'Pomeranian', icon: '🐩' },
    { name: 'Rottweiler', icon: '🛡️' },
    { name: 'Chow Chow', icon: '🦁' },
  ];

  return (
    <section className="py-10 bg-white border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center">
          <p className="text-xs font-black tracking-widest text-stone-400 uppercase font-display">
            Popular Breeds & Champion Lineages
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
