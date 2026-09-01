import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, ShieldCheck, Award } from 'lucide-react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { CountUp } from '../reactbits/CountUp.jsx';
import { TiltedCard } from '../reactbits/TiltedCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { ShinyText } from '../reactbits/ShinyText.jsx';
import { TextLoop } from '../reactbits/TextLoop.jsx';

export const BrandStorySection = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-y border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Image */}
          <div className="lg:col-span-6">
            <TiltedCard maxTilt={8} scale={1.02} className="relative rounded-3xl overflow-hidden shadow-float border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80"
                alt="More Than a Pet Store - The Dogs Garage"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/dog-default.png';
                }}
                className="w-full h-[400px] sm:h-[480px] object-cover bg-stone-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-amber-300">
                    OUR CORE ETHOS
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-tight">
                    "Pets aren't products. They're{' '}
                    <TextLoop
                      items={['family.', 'companions.', 'daily joy.', 'pure love.']}
                      interval={2400}
                      className="text-amber-300 font-display"
                    />"
                  </h3>
                </div>
              </div>
            </TiltedCard>
          </div>

          {/* Right Column: Storytelling & Key Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
                OUR PHILOSOPHY
              </span>
              <BlurText
                text="More Than a Pet Store."
                delay={60}
                className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight"
              />
              <p className="text-base sm:text-lg text-stone-700 font-semibold leading-relaxed">
                We believe pets aren't products. They're family.
              </p>
              <p className="text-sm text-stone-500 font-medium leading-relaxed">
                We bring together trusted pet essentials, responsible companionship and genuine guidance to help you give your pet a better, healthier, and happier life.
              </p>
            </div>

            {/* Metrics Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-stone-200/80 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display flex items-baseline">
                  <CountUp to={1000} duration={2} />
                  <span>+</span>
                </div>
                <p className="text-xs text-stone-500 font-bold mt-1">Happy Families</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-stone-200/80 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display flex items-baseline">
                  <CountUp to={50} duration={2} />
                  <span>+</span>
                </div>
                <p className="text-xs text-stone-500 font-bold mt-1">Certified Breeds</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-stone-200/80 shadow-xs col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display flex items-baseline">
                  <CountUp to={42} duration={2} />
                  <span>-Pt</span>
                </div>
                <p className="text-xs text-stone-500 font-bold mt-1">Vet Health Check</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <ClickSpark sparkColor="#E86A2C">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card hover:shadow-float transition-all hover:scale-105"
                >
                  <ShinyText speed={2.5}>Our Story & Standards</ShinyText>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </ClickSpark>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;
