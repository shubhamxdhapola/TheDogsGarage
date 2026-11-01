import React from 'react';
import { useSelector } from 'react-redux';
import { BrandStorySection } from '../../components/customer/BrandStorySection.jsx';
import { TrustStrip } from '../../components/common/TrustStrip.jsx';
import { ShieldCheck, Heart, Award } from 'lucide-react';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

const pillarIcons = [ShieldCheck, Award, Heart];
const spotlightColors = [
  'rgba(83, 107, 79, 0.08)',
  'rgba(235, 169, 53, 0.08)',
  'rgba(232, 106, 44, 0.08)',
];
const iconBgColors = [
  'bg-emerald-50 text-emerald-700',
  'bg-amber-50 text-amber-700',
  'bg-orange-50 text-orange-700',
];

export const AboutPage = () => {
  const { cms } = useSelector((state) => state.cms);
  const data = cms?.about || defaultCmsData.about;

  const pillars =
    data.pillars && data.pillars.length > 0 ? data.pillars : defaultCmsData.about.pillars;

  return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen text-stone-900 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 py-8">
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
            {data.eyebrow || 'ABOUT THE DOGS GARAGE'}
          </span>
          <BlurText
            text={data.title || 'More Than a Pet Store.'}
            delay={50}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-lg text-stone-700 font-semibold leading-relaxed">
            {data.quote || "“We believe pets aren't products. They're family.”"}
          </p>
          <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {data.description ||
              'Founded with an uncompromising mission: to ensure every pet parent welcomes a healthy, joyful, and vet-certified companion into their family while providing the cleanest nutrition and coat care essentials.'}
          </p>
        </div>

        <BrandStorySection />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            const color = spotlightColors[idx % spotlightColors.length];
            const iconBg = iconBgColors[idx % iconBgColors.length];

            return (
              <SpotlightCard
                key={idx}
                spotlightColor={color}
                className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-subtle space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-2xs`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-stone-900 font-display">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  {pillar.description}
                </p>
              </SpotlightCard>
            );
          })}
        </div>

        <TrustStrip />
      </div>
    </div>
  );
};

export default AboutPage;
