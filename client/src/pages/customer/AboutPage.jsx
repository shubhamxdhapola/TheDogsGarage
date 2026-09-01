import React from 'react';
import { BrandStorySection } from '../../components/customer/BrandStorySection.jsx';
import { TrustStrip } from '../../components/common/TrustStrip.jsx';
import { ShieldCheck, Heart, Award } from 'lucide-react';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';

export const AboutPage = () => {
  return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen text-stone-900 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 py-8">
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
            ABOUT THE DOGS GARAGE
          </span>
          <BlurText
            text="More Than a Pet Store."
            delay={50}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-lg text-stone-700 font-semibold leading-relaxed">
            “We believe pets aren't products. They're family.”
          </p>
          <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Founded with an uncompromising mission: to ensure every pet parent welcomes a healthy, joyful, and vet-certified companion into their family while providing the cleanest nutrition and coat care essentials.
          </p>
        </div>

        <BrandStorySection />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <SpotlightCard
            spotlightColor="rgba(83, 107, 79, 0.08)"
            className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-subtle space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-display">100% Health Guarantee</h3>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Every pup undergoes strict 42-point veterinary health checks, initial deworming, vaccination, and microchipping prior to home arrival.
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(235, 169, 53, 0.08)"
            className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-subtle space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-display">KCI Certified Lineage</h3>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              We exclusively maintain champion kennel club lineage with verified bloodlines for temperamental stability and breed standards.
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(232, 106, 44, 0.08)"
            className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-subtle space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center shadow-2xs">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-display">Lifetime Nutrition Guidance</h3>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              From puppyhood through adulthood, our dedicated clinical animal nutritionists provide tailored meal plans and accessories support.
            </p>
          </SpotlightCard>
        </div>

        <TrustStrip />
      </div>
    </div>
  );
};

export default AboutPage;
