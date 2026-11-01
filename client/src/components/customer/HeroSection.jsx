import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, ShieldCheck, Heart, Sparkles, Star } from "lucide-react";
import { ShinyText } from "../reactbits/ShinyText.jsx";
import { ClickSpark } from "../reactbits/ClickSpark.jsx";
import { Magnet } from "../reactbits/Magnet.jsx";
import { CircularGallery } from "../reactbits/CircularGallery.jsx";
import { TextLoop } from "../reactbits/TextLoop.jsx";
import { defaultCmsData } from "../../utils/defaultCmsData.js";

export const HeroSection = () => {
  const { cms } = useSelector((state) => state.cms);
  const heroData = cms?.home?.hero || defaultCmsData.home.hero;

  const eyebrowPrefix = heroData.eyebrowPrefix || "THE DOGS GARAGE • ";
  const eyebrowLoops =
    heroData.eyebrowLoops && heroData.eyebrowLoops.length > 0
      ? heroData.eyebrowLoops
      : ["KCI CERTIFIED", "100% ORGANIC CARE", "ETHICAL HABITATS", "LIFETIME GUIDANCE"];

  const headingPrefix = heroData.headingPrefix || "Everything Your Dog ";
  const headingLoops =
    heroData.headingLoops && heroData.headingLoops.length > 0
      ? heroData.headingLoops
      : ["Deserves.", "Loves.", "Needs.", "Cherishes."];

  const description =
    heroData.description ||
    "Premium pet essentials, trusted nutrition, and responsibly raised, vet-certified companions — all in one place.";

  const primaryBtnText = heroData.primaryBtnText || "Shop Pet Essentials";
  const primaryBtnLink = heroData.primaryBtnLink || "/accessories";
  const secondaryBtnText = heroData.secondaryBtnText || "Meet Our Puppies";
  const secondaryBtnLink = heroData.secondaryBtnLink || "/pets";

  const heroDogs =
    heroData.galleryDogs && heroData.galleryDogs.length > 0
      ? heroData.galleryDogs
      : defaultCmsData.home.hero.galleryDogs;

  const trustBadges =
    heroData.trustBadges && heroData.trustBadges.length > 0
      ? heroData.trustBadges
      : defaultCmsData.home.hero.trustBadges;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-[#FAFAFA]">
      {/* Subtle modern dot-grid background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#18181B 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Minimal Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Small Eyebrow with TextLoop */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-xs text-xs font-black tracking-widest text-amber-700 uppercase font-display mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{eyebrowPrefix}</span>
              <TextLoop
                items={eyebrowLoops}
                interval={2800}
                className="text-stone-800"
              />
            </div>

            {/* Large Minimal Heading with TextLoop */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 font-display tracking-tight leading-[1.12]">
                <span>{headingPrefix}</span>
                <TextLoop
                  items={headingLoops}
                  interval={2600}
                  className="text-amber-700 inline-block font-display"
                />
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-stone-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <ClickSpark sparkColor="#E86A2C">
                <Magnet padding={20} magnetStrength={2}>
                  <Link
                    to={primaryBtnLink}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105"
                  >
                    <ShinyText speed={2.5}>{primaryBtnText}</ShinyText>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Magnet>
              </ClickSpark>

              <ClickSpark sparkColor="#F59E0B">
                <Magnet padding={20} magnetStrength={2}>
                  <Link
                    to={secondaryBtnLink}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-stone-50 text-stone-900 font-bold text-sm border border-stone-200/90 shadow-subtle hover:shadow-card transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <span>{secondaryBtnText}</span>
                  </Link>
                </Magnet>
              </ClickSpark>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-bold">
              {trustBadges.map((badge, bIdx) => (
                <span key={bIdx} className="flex items-center gap-1.5">
                  {bIdx === 0 ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ) : bIdx === 1 ? (
                    <Heart className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  )}
                  {badge.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: ReactBits Circular Gallery Centerpiece */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient subtle glow ring behind gallery */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-200/30 to-orange-200/20 blur-3xl -z-10 pointer-events-none" />

            <div className="w-full max-w-lg">
              <CircularGallery
                items={heroDogs}
                radius={200}
                itemWidth={150}
                itemHeight={195}
                autoRotateSpeed={0.5}
                className="my-auto"
              />
              <p className="text-center text-[11px] font-bold text-stone-400 mt-2">
                Drag or hover to pause & spin
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
