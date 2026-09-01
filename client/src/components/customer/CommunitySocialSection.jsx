import React from 'react';
import { Instagram, Phone, MessageCircle, Mail, ArrowUpRight, Sparkles } from 'lucide-react';
import { BlurText } from '../reactbits/BlurText.jsx';
import { GlareCard } from '../reactbits/GlareCard.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';
import { BUSINESS_CONFIG } from '../../utils/constants.js';

export const CommunitySocialSection = () => {
  const whatsappNumber = BUSINESS_CONFIG.WHATSAPP.replace(/\D/g, '');

  const socialChannels = [
    {
      name: 'Instagram',
      handle: '@the_dogsgarage',
      description: 'Daily nursery reels, puppy stories & pure canine moments.',
      icon: Instagram,
      bgColor: 'bg-rose-50 text-rose-600 border-rose-200/60',
      badge: 'Daily Stories',
      link: 'https://www.instagram.com/the_dogsgarage/',
      cta: 'Follow on Instagram',
    },
    {
      name: 'WhatsApp Community',
      handle: '+91 62643 69991',
      description: 'Priority litter announcements & instant adoption advisory.',
      icon: MessageCircle,
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      badge: 'Direct Chat',
      link: `https://wa.me/${whatsappNumber}?text=Hi%20The%20Dogs%20Garage,%20I%20would%20like%20to%20know%20more%20about%20your%20puppies%20and%20services.`,
      cta: 'Chat on WhatsApp',
    },
    {
      name: 'Direct Helpline',
      handle: '+91 62643 69991',
      description: 'Speak directly with certified handlers and adoption counselors.',
      icon: Phone,
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
      badge: 'Helpline',
      link: `tel:${BUSINESS_CONFIG.PHONE_RAW}`,
      cta: 'Call +91 62643 69991',
    },
    {
      name: 'Email Support',
      handle: 'thedogsgarage@gmail.com',
      description: 'Official correspondence, documentation and health records.',
      icon: Mail,
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200/60',
      badge: 'Official Desk',
      link: 'mailto:thedogsgarage@gmail.com',
      cta: 'Send an Email',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-black tracking-widest text-amber-700 uppercase font-display mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>JOIN OUR DIGITAL PACK</span>
          </div>

          <BlurText
            text="Connect Across Channels"
            delay={60}
            className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <BlurText
            text="Daily training tips, nursery moments, and new puppy announcements."
            delay={20}
            className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed justify-center text-center max-w-lg mx-auto"
          />
        </div>

        {/* 4 Social Media Channel Cards with GlareCard Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialChannels.map((channel, idx) => {
            const Icon = channel.icon;

            return (
              <ClickSpark key={idx} sparkColor="#E86A2C">
                <a
                  href={channel.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full group"
                >
                  <GlareCard
                    maxTilt={10}
                    glareOpacity={0.25}
                    borderRadius="28px"
                    className="h-full cursor-pointer"
                  >
                    <div className="p-7 flex flex-col justify-between h-full bg-white space-y-6">
                      
                      {/* Top Bar: Branded Icon & Badge */}
                      <div className="flex items-center justify-between">
                        <div className={`w-14 h-14 rounded-2xl ${channel.bgColor} border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200/60">
                          {channel.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-amber-700 tracking-wide block font-display">
                          {channel.handle}
                        </span>
                        <h4 className="text-xl font-black text-stone-900 font-display group-hover:text-amber-700 transition-colors">
                          {channel.name}
                        </h4>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">
                          {channel.description}
                        </p>
                      </div>

                      {/* Action Link */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                        <span className="font-display">{channel.cta}</span>
                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                    </div>
                  </GlareCard>
                </a>
              </ClickSpark>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CommunitySocialSection;
