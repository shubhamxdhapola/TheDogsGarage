import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, MessageSquare, Home, ArrowRight } from 'lucide-react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { ShinyText } from '../reactbits/ShinyText.jsx';
import { ScrollReveal } from '../reactbits/ScrollReveal.jsx';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

const stepIcons = [Search, MessageSquare, Home];

export const AdoptionProcessSection = () => {
  const { cms } = useSelector((state) => state.cms);
  const data = cms?.home?.adoptionProcess || defaultCmsData.home.adoptionProcess;

  const steps =
    data.steps && data.steps.length > 0 ? data.steps : defaultCmsData.home.adoptionProcess.steps;

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block">
            {data.eyebrow || 'SEAMLESS JOURNEY'}
          </span>
          <BlurText
            text={data.title || 'Simple From Start to Home.'}
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <p className="text-sm text-stone-500 font-medium">
            {data.description ||
              'We make welcoming a healthy pet or ordering premium care effortless, transparent, and joyful.'}
          </p>
        </div>

        {/* 3 Steps Row with Staggered ScrollReveal & ReactBits SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = stepIcons[idx % stepIcons.length];
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 0.12}
                duration={0.65}
                viewportAmount={0.2}
              >
                <SpotlightCard
                  spotlightColor="rgba(232, 106, 44, 0.08)"
                  className="bg-[#FAFAFA] rounded-3xl p-8 border border-stone-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-6 relative group h-full"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-stone-300 font-display group-hover:text-amber-600 transition-colors">
                      {step.num || `0${idx + 1}`}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-800">
                      <Icon className="w-5 h-5 text-amber-700" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-stone-900 font-display">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2">
          <ClickSpark sparkColor="#E86A2C">
            <Link
              to={data.btnLink || '/pets'}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card hover:shadow-float transition-all hover:scale-105"
            >
              <ShinyText speed={2.5}>{data.btnText || 'Begin Your Journey'}</ShinyText>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ClickSpark>
        </div>
      </div>
    </section>
  );
};

export default AdoptionProcessSection;
