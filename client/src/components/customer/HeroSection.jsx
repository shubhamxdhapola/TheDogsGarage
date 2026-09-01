import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Heart, Sparkles, Star } from "lucide-react";
import { ShinyText } from "../reactbits/ShinyText.jsx";
import { ClickSpark } from "../reactbits/ClickSpark.jsx";
import { Magnet } from "../reactbits/Magnet.jsx";
import { CircularGallery } from "../reactbits/CircularGallery.jsx";
import { TextLoop } from "../reactbits/TextLoop.jsx";

export const HeroSection = () => {
  // Curated single dog breed portraits for the 3D Circular Gallery
  const heroDogs = [
    {
      image:
        "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=600&h=600&q=80",
      title: "Siberian Husky",
      subtitle: "Bold & Striking",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nc3xlbnwwfHwwfHx8MA%3D%3D",
      title: "Golden Retriever",
      subtitle: "Gentle & Loving",
    },
    {
      image:
        "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&h=600&q=80",
      title: "German Shepherd",
      subtitle: "Noble & Alert",
    },
    {
      image:
        "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=600&h=600&q=80",
      title: "Labrador Retriever",
      subtitle: "Playful & Loyal",
    },
    {
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&h=600&q=80",
      title: "Golden Retriever",
      subtitle: "Gentle & Loving",
    },
  ];

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
              <span>THE DOGS GARAGE • </span>
              <TextLoop
                items={[
                  "KCI CERTIFIED",
                  "100% ORGANIC CARE",
                  "ETHICAL HABITATS",
                  "LIFETIME GUIDANCE",
                ]}
                interval={2800}
                className="text-stone-800"
              />
            </div>

            {/* Large Minimal Heading with TextLoop */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 font-display tracking-tight leading-[1.12]">
                <span>Everything Your Dog </span>
                <TextLoop
                  items={["Deserves.", "Loves.", "Needs.", "Cherishes."]}
                  interval={2600}
                  className="text-amber-700 inline-block font-display"
                />
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-stone-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Premium pet essentials, trusted nutrition, and responsibly raised,
              vet-certified companions — all in one place.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <ClickSpark sparkColor="#E86A2C">
                <Magnet padding={20} magnetStrength={2}>
                  <Link
                    to="/accessories"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105"
                  >
                    <ShinyText speed={2.5}>Shop Pet Essentials</ShinyText>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Magnet>
              </ClickSpark>

              <ClickSpark sparkColor="#F59E0B">
                <Magnet padding={20} magnetStrength={2}>
                  <Link
                    to="/pets"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-stone-50 text-stone-900 font-bold text-sm border border-stone-200/90 shadow-subtle hover:shadow-card transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <span>Meet Our Puppies</span>
                  </Link>
                </Magnet>
              </ClickSpark>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> KCI
                Verified Pedigree
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> 42-Pt Health Checks
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> 4.9/5
                Rating (1,000+ Families)
              </span>
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
