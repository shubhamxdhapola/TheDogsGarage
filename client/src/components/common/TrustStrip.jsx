import React from 'react';
import { HeartHandshake, ShieldCheck, Eye, Headphones } from 'lucide-react';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';
import { BlurText } from '../reactbits/BlurText.jsx';
import { ScrollReveal } from '../reactbits/ScrollReveal.jsx';

export const TrustStrip = () => {
  const trustCards = [
    {
      icon: HeartHandshake,
      title: 'Responsible',
      description: 'Thoughtful, compassionate approach to pet companionship with spacious socialization and zero puppy mill sourcing.',
      badge: 'Ethical Standard',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted',
      description: 'Carefully selected organic coat care, vet-approved nutrition, and high-durability essentials.',
      badge: 'Clinically Vetted',
    },
    {
      icon: Eye,
      title: 'Transparent',
      description: 'Clear, uncompromised pedigree documentation, 42-point medical records, and transparent pricing.',
      badge: '100% Verified',
    },
    {
      icon: Headphones,
      title: 'Personal',
      description: 'Real guidance and lifetime veterinary advice for pet parents whenever you have questions.',
      badge: '24/7 Support',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
            WHY THE DOGS GARAGE
          </span>
          <BlurText
            text="Built Around Better Pet Care."
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-sm text-stone-500 font-medium">
            We hold ourselves to uncompromising standards of health, transparency, and care for every puppy and product.
          </p>
        </div>

        {/* 4 Trust Cards Grid with Staggered ScrollReveal & ReactBits SpotlightCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 0.1}
                duration={0.6}
                viewportAmount={0.2}
              >
                <SpotlightCard
                  spotlightColor="rgba(232, 106, 44, 0.08)"
                  className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-5 group h-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800 shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200/60">
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-extrabold text-lg text-stone-900 font-display">
                      {card.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TrustStrip;
