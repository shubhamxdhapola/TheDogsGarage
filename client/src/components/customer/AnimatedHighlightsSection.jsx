import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award, Star, ArrowRight, Dog, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollVelocity } from '../reactbits/ScrollVelocity.jsx';
import { GlareCard } from '../reactbits/GlareCard.jsx';
import { CountUp } from '../reactbits/CountUp.jsx';
import { ShinyText } from '../reactbits/ShinyText.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';

export const AnimatedHighlightsSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-y border-stone-200/70 overflow-hidden space-y-10">
      
      {/* 1. Bidirectional High-Impact Scroll Velocity Marquee */}
      <div className="space-y-3 py-2 bg-stone-900 text-white transform -rotate-1 scale-105 shadow-float">
        <ScrollVelocity
          texts={[
            '✦ KCI CERTIFIED BLOODLINES',
            '✦ 42-POINT VET INSPECTION',
            '✦ 100% ETHICAL HABITATS',
            '✦ LIFETIME GUIDANCE',
          ]}
          defaultVelocity={1.2}
          className="text-sm sm:text-base font-black tracking-widest font-display text-amber-300 py-1"
        />
        <ScrollVelocity
          texts={[
            '★ 1,000+ HAPPY FAMILIES',
            '★ 100% ORGANIC COAT CARE',
            '★ TRANSPARENT ADOPTION',
            '★ THE DOGS GARAGE',
          ]}
          defaultVelocity={-1.2}
          className="text-xs sm:text-sm font-extrabold tracking-wider text-stone-300 py-1"
        />
      </div>

      {/* 2. Interactive Animated Bento Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: 42-Point Vet Guarantee */}
          <div className="md:col-span-5 flex">
            <GlareCard
              maxTilt={8}
              glareOpacity={0.25}
              borderRadius="28px"
              className="w-full"
            >
              <div className="p-8 flex flex-col justify-between h-full bg-[#FAFAFA] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                    CLINICAL STANDARD
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-stone-900 font-display tracking-tight">
                    42-Point Health Protocol
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
                    Complete physical, cardiac, orthopedic, and immunization screening before your puppy arrives home.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/70 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-stone-700">Microchipped & Vaccinated</span>
                  <span className="text-emerald-700 font-black">100% Guaranteed</span>
                </div>
              </div>
            </GlareCard>
          </div>

          {/* Card 2: 1000+ Companions Count */}
          <div className="md:col-span-4 flex">
            <GlareCard
              maxTilt={8}
              glareOpacity={0.25}
              borderRadius="28px"
              className="w-full"
            >
              <div className="p-8 flex flex-col justify-between h-full bg-[#FAFAFA] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shadow-xs">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-stone-900 font-display flex items-baseline tracking-tight">
                    <CountUp to={1000} duration={2} />
                    <span className="text-amber-600">+</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">Families Welcomed</p>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Lifelong relationships built across Bangalore and throughout India.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/70 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Average Rating</span>
                  <span className="font-black text-stone-900">4.9 / 5.0</span>
                </div>
              </div>
            </GlareCard>
          </div>

          {/* Card 3: Quick Action Card */}
          <div className="md:col-span-3 flex">
            <GlareCard
              maxTilt={8}
              glareOpacity={0.25}
              borderRadius="28px"
              className="w-full"
            >
              <div className="p-8 flex flex-col justify-between h-full bg-stone-900 text-white space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-xs">
                  <Dog className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black font-display tracking-tight text-white">
                    Looking for a Puppy?
                  </h3>
                  <p className="text-xs text-stone-300 font-medium leading-relaxed">
                    Explore available litters, reserve online, or request WhatsApp video consultation.
                  </p>
                </div>

                <ClickSpark sparkColor="#F59E0B">
                  <Link
                    to="/pets"
                    className="w-full py-3 px-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-105"
                  >
                    <ShinyText speed={2}>View Puppies</ShinyText>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </ClickSpark>
              </div>
            </GlareCard>
          </div>

        </div>
      </div>

    </section>
  );
};

export default AnimatedHighlightsSection;
