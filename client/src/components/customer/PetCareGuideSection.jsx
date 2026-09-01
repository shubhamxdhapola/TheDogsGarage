import React, { useState } from 'react';
import { BookOpen, ChevronDown, Clock, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from '../reactbits/BlurText.jsx';
import { SpotlightCard } from '../reactbits/SpotlightCard.jsx';

export const PetCareGuideSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      title: 'First 48 Hours: Bringing Your Puppy Home',
      category: 'Puppy Care',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
      summary: 'Essential setup checklist, crate training basics, and how to ease separation anxiety on your puppy’s first night.',
    },
    {
      title: 'Puppy Diet Chart: Feeding Guide for 2-12 Months',
      category: 'Nutrition',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=500&q=80',
      summary: 'Portion sizes, transition schedules from starter mousse to dry kibble, and vital supplements for bone growth.',
    },
    {
      title: 'Core Vaccination & Deworming Schedule in India',
      category: 'Health & Vet',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=500&q=80',
      summary: 'Detailed timeline for DHPPIL 7-in-1 shots, Anti-Rabies, Kennel Cough vaccines, and regular parasite prevention.',
    },
  ];

  const faqs = [
    {
      q: 'Are all puppies certified and health guaranteed?',
      a: 'Yes! Every puppy listed on The Dogs Garage undergoes a rigorous 21-point physical examination by certified veterinarians. We provide full vaccination cards, deworming history, microchip certificates, and an initial health guarantee.',
    },
    {
      q: 'How does doorstep pet transport work across India?',
      a: 'We operate customized, climate-controlled pet vehicles with experienced animal handlers. For long distances, we arrange direct air transport with dedicated airline pet cargo protocols, ensuring minimal travel stress.',
    },
    {
      q: 'Can I meet the puppy and mother dog via video call before booking?',
      a: 'Absolutely! We believe in 100% transparency. Once you select a puppy, you can schedule a live 1-on-1 video call to see the puppy playing with its littermates and observe the mother dog.',
    },
    {
      q: 'What post-adoption support do you provide?',
      a: 'You receive lifetime advisory access to our in-house canine nutritionists and veterinarians, guidance on diet transitions, and 24/7 priority customer support for any health or behavior queries.',
    },
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-14 bg-white rounded-3xl my-6 border border-stone-200/80 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5" /> Vet Knowledge Hub
          </span>
          <BlurText
            text="Puppy Parenting Guides & Advice"
            delay={80}
            className="text-2xl sm:text-4xl font-black text-tdg-brown font-display tracking-tight justify-center"
          />
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            Expert-backed tips on puppy health, grooming, and training to help you give your companion the best life.
          </p>
        </div>

        {/* 3 Guide Cards with SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((g, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(83, 107, 79, 0.08)"
              spotlightSize={280}
              className="bg-tdg-cream/30 rounded-3xl overflow-hidden border border-stone-200/80 hover:shadow-card hover:border-tdg-orange/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black text-tdg-brown shadow-xs">
                    {g.category}
                  </span>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
                    <Clock className="w-3.5 h-3.5" /> {g.readTime}
                  </div>
                  <h3 className="text-lg font-black text-tdg-brown font-display leading-snug group-hover:text-tdg-orange transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-medium">
                    {g.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 text-xs font-black text-tdg-orange hover:underline"
                >
                  Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="pt-6 border-t border-stone-200 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-tdg-orange flex items-center justify-center font-bold shadow-2xs">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-black text-tdg-brown font-display">Frequently Asked Questions</h3>
              <p className="text-xs text-stone-500">Everything you need to know about adoption, health, and transport.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-tdg-cream/40 rounded-2xl border border-stone-200/80 p-4 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-2 font-bold text-sm text-tdg-brown hover:text-tdg-orange cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-stone-600 leading-relaxed mt-2.5 pt-2.5 border-t border-stone-200/60 font-medium overflow-hidden"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetCareGuideSection;
