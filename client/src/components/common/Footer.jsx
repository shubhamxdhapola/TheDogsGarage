import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Phone, Mail, MapPin, Instagram, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../utils/constants.js';
import { Logo } from './Logo.jsx';
import { Magnet } from '../reactbits/Magnet.jsx';

export const Footer = () => {
  const { settings } = useSelector((state) => state.settings);

  const storeName = settings?.storeName || BUSINESS_CONFIG.NAME;
  const tagline = settings?.tagline || BUSINESS_CONFIG.TAGLINE;
  const address = settings?.address || BUSINESS_CONFIG.LOCATION;
  const phone = settings?.contactPhone || BUSINESS_CONFIG.PHONE;
  const email = settings?.contactEmail || BUSINESS_CONFIG.EMAIL;
  const instagramUrl = settings?.instagramUrl || BUSINESS_CONFIG.INSTAGRAM;
  const phoneRaw = phone.replace(/[^\d+]/g, '');

  return (
    <footer className="bg-white text-stone-700 pt-16 pb-12 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 pb-12 border-b border-stone-200/70">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <Magnet padding={20} magnetStrength={2}>
              <Logo theme="light" size="md" />
            </Magnet>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium max-w-sm">
              {tagline || 'Setting the benchmark in ethical pet companionship, veterinary-certified nutrition, and lifetime guidance.'}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FAFAFA] hover:bg-amber-50 text-stone-600 hover:text-amber-700 border border-stone-200 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-8 h-8 rounded-full bg-[#FAFAFA] hover:bg-amber-50 text-stone-600 hover:text-amber-700 border border-stone-200 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-black text-xs text-stone-900 uppercase tracking-wider font-display">
              Shop Essentials
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-600">
              <li>
                <Link to="/accessories?category=food" className="hover:text-amber-700 transition-colors">
                  Food & Nutrition
                </Link>
              </li>
              <li>
                <Link to="/accessories?category=grooming" className="hover:text-amber-700 transition-colors">
                  Grooming & Shampoo
                </Link>
              </li>
              <li>
                <Link to="/accessories?category=toys" className="hover:text-amber-700 transition-colors">
                  Interactive Toys
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="hover:text-amber-700 transition-colors">
                  All Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-black text-xs text-stone-900 uppercase tracking-wider font-display">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-600">
              <li>
                <Link to="/about" className="hover:text-amber-700 transition-colors">
                  About Our Standards
                </Link>
              </li>
              <li>
                <Link to="/pets" className="hover:text-amber-700 transition-colors">
                  Available Puppies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-700 transition-colors">
                  Kennel Visit & Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-700 transition-colors">
                  Veterinary Advisory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-black text-xs text-stone-900 uppercase tracking-wider font-display">
              Care & Support
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`tel:${phoneRaw}`} className="hover:text-stone-900 font-bold transition-colors">
                  {phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-stone-900 font-medium transition-colors">
                  {email}
                </a>
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified KCI Registered Kennel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-medium">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/account/orders" className="hover:text-stone-700 transition-colors">
              Track Order
            </Link>
            <span className="hover:text-stone-700 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-stone-700 cursor-pointer transition-colors">
              Terms & Conditions
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
