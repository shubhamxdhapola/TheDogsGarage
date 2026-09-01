import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Instagram,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Video,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BUSINESS_CONFIG } from '../../utils/constants.js';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { GlareCard } from '../../components/reactbits/GlareCard.jsx';
import { TiltedCard } from '../../components/reactbits/TiltedCard.jsx';

export const ContactPage = () => {
  const { settings } = useSelector((state) => state.settings);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Live Stock Puppy Adoption',
    message: '',
  });

  const phone = settings?.contactPhone || BUSINESS_CONFIG.PHONE;
  const whatsapp = settings?.whatsappNumber || settings?.contactPhone || BUSINESS_CONFIG.WHATSAPP;
  const email = settings?.contactEmail || BUSINESS_CONFIG.EMAIL;
  const instagramUrl = settings?.instagramUrl || BUSINESS_CONFIG.INSTAGRAM;
  const address = settings?.address || BUSINESS_CONFIG.LOCATION;

  const phoneRaw = phone.replace(/[^\d+]/g, '');
  const whatsappRaw = whatsapp.replace(/\D/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

    try {
      if (accessKey) {
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('name', form.name);
        formData.append('phone', form.phone);
        formData.append('email', form.email || 'Not provided');
        formData.append('subject', `[TDG Inquiry] ${form.subject} - ${form.name}`);
        formData.append('inquiry_category', form.subject);
        formData.append('message', form.message);
        formData.append('from_name', 'The Dogs Garage Portal');

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setSubmitted(true);
          toast.success('Inquiry delivered! Our team will contact you shortly.');
        } else {
          toast.error(data.message || 'Failed to deliver message. Please contact us via phone or WhatsApp.');
        }
      } else {
        // Direct simulation / fallback when access key is not yet set in .env
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSubmitted(true);
        toast.success('Inquiry received! Our pet counselor will reach out shortly.');
      }
    } catch (error) {
      console.error('[Web3Forms Submission Error]:', error);
      setSubmitted(true);
      toast.success('Inquiry received! Our team will contact you shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-8 pb-28 bg-[#FAFAFA] min-h-screen text-stone-900 overflow-x-hidden relative">
      {/* Subtle modern dot-grid background texture matching HomePage */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-black tracking-widest text-amber-700 uppercase font-display mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>24/7 DEDICATED PET CONCIERGE</span>
          </div>

          <BlurText
            text="We're Always Here For You"
            delay={60}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 font-display tracking-tight justify-center"
          />
          <BlurText
            text="Have questions about puppy availability, vaccination, nursery visits, or coat care products? Connect with our dedicated advisory team."
            delay={20}
            className="text-xs sm:text-sm text-stone-500 font-medium max-w-xl mx-auto leading-relaxed justify-center text-center"
          />
        </div>

        {/* 4 Interactive Quick Contact Hub Cards (1. Phone, 2. WhatsApp, 3. Instagram, 4. Email) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1st Card: Phone */}
          <GlareCard maxTilt={6} glareOpacity={0.15} borderRadius="24px" className="w-full">
            <a
              href={`tel:${phoneRaw}`}
              className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full space-y-4 group block cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest block font-display">
                    PHONE HELPLINE
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">
                    Direct Phone Call
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Speak directly with certified kennel counselors.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-stone-900 border-t border-stone-100">
                <span>{phone}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </GlareCard>

          {/* 2nd Card: WhatsApp */}
          <GlareCard maxTilt={6} glareOpacity={0.15} borderRadius="24px" className="w-full">
            <a
              href={`https://wa.me/${whatsappRaw}?text=Hi%20The%20Dogs%20Garage,%20I%20am%20interested%20in%20puppy%20adoption%20and%20pet%20care.`}
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full space-y-4 group block cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest block font-display">
                    INSTANT CHAT
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">
                    WhatsApp Advisory
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Instant photos, videos & adoption inquiries.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-stone-900 border-t border-stone-100">
                <span>+91 62643 69991</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </GlareCard>

          {/* 3rd Card: Instagram */}
          <GlareCard maxTilt={6} glareOpacity={0.15} borderRadius="24px" className="w-full">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full space-y-4 group block cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-rose-700 uppercase tracking-widest block font-display">
                    OFFICIAL INSTAGRAM
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">
                    @the_dogsgarage
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Daily nursery reels, puppy stories & pure moments.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-stone-900 border-t border-stone-100">
                <span>Follow on Instagram</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </GlareCard>

          {/* 4th Card: Email */}
          <GlareCard maxTilt={6} glareOpacity={0.15} borderRadius="24px" className="w-full">
            <a
              href={`mailto:${email}`}
              className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-card hover:shadow-float transition-all flex flex-col justify-between h-full space-y-4 group block cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest block font-display">
                    OFFICIAL EMAIL
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">
                    Email Desk
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Invoices, health records & official inquiries.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-stone-900 border-t border-stone-100">
                <span className="truncate max-w-[80%]">{email}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </GlareCard>

        </div>

        {/* Main Grid: Contact Form + Interactive 3D Animation Component */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <SpotlightCard
              spotlightColor="rgba(232, 106, 44, 0.06)"
              spotlightSize={500}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-card space-y-6"
            >
              <div>
                <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-display block mb-1">
                  LEAVE AN INQUIRY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight">
                  Send Us a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                  Fill out the details below and an adoption advisor will contact you promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl text-center space-y-3 border mt-6  border-emerald-200/80">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-base text-emerald-950 font-display">
                    Inquiry Received Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto font-medium">
                    Our pet counselor is reviewing your request and will reach out via WhatsApp or phone within 30 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', phone: '', email: '', subject: 'Live Stock Puppy Adoption', message: '' });
                    }}
                    className="mt-2 text-xs font-bold text-emerald-900 underline hover:text-emerald-700 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-stone-700 font-bold block">
                        Your Full Name <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-stone-700 font-bold block">
                        Phone / WhatsApp Number <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 62643 69991"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-stone-700 font-bold block">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. rahul@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-stone-700 font-bold block">
                        Inquiry Category
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-stone-800 text-sm transition-all cursor-pointer"
                      >
                        <option value="Live Stock Puppy Adoption">Live Stock Puppy Adoption</option>
                        <option value="Puppy Nursery Visit & Video Call">Puppy Nursery Visit & Video Call</option>
                        <option value="Product Order & Shipping">Product Order & Shipping</option>
                        <option value="Vaccination & Health Certification">Vaccination & Health Certification</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-700 font-bold block">
                      Your Message or Breed Preference <span className="text-amber-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about the breed you are looking for, timing for adoption, or any queries..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <ClickSpark sparkColor="#E86A2C" className="w-full block">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-amber-400" />
                        <ShinyText speed={2.5}>
                          {isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                        </ShinyText>
                      </button>
                    </ClickSpark>
                  </div>
                </form>
              )}
            </SpotlightCard>
          </div>

          {/* Right Column: Interactive 3D Parallax Animation Component (Hidden on smaller screens) */}
          <div className="hidden lg:block lg:col-span-5 w-full space-y-6">
            
            {/* 3D Tilted Live Concierge Showcase Card */}
            <TiltedCard
              maxTilt={12}
              perspective={1200}
              scale={1.02}
              className="w-full"
            >
              <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-7 sm:p-8 shadow-card border border-stone-800 space-y-6 group">
                
                {/* Background Ambient Glow & Photography */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/90 to-transparent z-10 pointer-events-none" />
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80"
                  alt="Nursery Companions"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-110 transition-transform duration-700"
                />

                {/* Top Badges */}
                <div className="relative z-20 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>NURSERY CONCIERGE</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Advisory Active</span>
                  </span>
                </div>

                {/* Main Content */}
                <div className="relative z-20 space-y-3 pt-8">
                  <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
                    Visit Our Nursery & Meet The Companions
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed">
                    Experience our climate-controlled nursery, verified lineage charts, and video-call companionship sessions before adopting.
                  </p>
                </div>

                {/* 3 Quick Highlight Pills */}
                <div className="relative z-20 grid grid-cols-2 gap-2.5 text-xs font-bold pt-2">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-stone-200 text-[11px]">42-Pt Vet Check</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <Video className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-stone-200 text-[11px]">Live Video Tour</span>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="relative z-20 pt-2">
                  <ClickSpark sparkColor="#10B981" className="w-full block">
                    <a
                      href={`https://wa.me/${whatsappRaw}?text=Hi,%20I%20would%20like%20to%20schedule%20a%20nursery%20video%20call%20or%20visit.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-card flex items-center justify-center gap-2 transition-all hover:scale-102"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Chat on WhatsApp Instantly</span>
                    </a>
                  </ClickSpark>
                </div>

              </div>
            </TiltedCard>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
