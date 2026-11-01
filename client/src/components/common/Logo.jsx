import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PawPrint } from 'lucide-react';
import { Magnet } from '../reactbits/Magnet.jsx';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

/**
 * Reusable Minimalist Brand Logo Component
 * - Dynamically connected to CMS
 * - Supports custom uploaded logo image or paw icon
 * - Supports custom brand prefix and highlighted suffix
 */
export const Logo = ({
  to = '/',
  theme = 'light',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const isDark = theme === 'dark';
  const { cms } = useSelector((state) => state.cms || {});
  const globalCms = cms?.global || defaultCmsData.global;

  const brandPrefix = globalCms.brandNamePrefix || 'The Dogs';
  const brandHighlight = globalCms.brandNameHighlight || 'Garage';
  const logoImage = globalCms.logoImage || '';
  const logoType = globalCms.logoType || (logoImage ? 'image' : 'icon');

  const sizeConfigs = {
    sm: {
      badge: 'w-8 h-8 rounded-xl',
      icon: 'w-4 h-4',
      prefix: 'text-xs font-bold',
      highlight: 'text-sm font-black',
      gap: 'gap-2',
    },
    md: {
      badge: 'w-10 h-10 rounded-2xl',
      icon: 'w-5 h-5',
      prefix: 'text-[13px] sm:text-sm font-bold',
      highlight: 'text-lg sm:text-xl font-black',
      gap: 'gap-2.5',
    },
    lg: {
      badge: 'w-12 h-12 rounded-2xl',
      icon: 'w-6 h-6',
      prefix: 'text-base sm:text-lg font-bold',
      highlight: 'text-2xl sm:text-3xl font-black',
      gap: 'gap-3',
    },
  };

  const currentSize = sizeConfigs[size] || sizeConfigs.md;

  const content = (
    <Magnet padding={20} magnetStrength={0.25} className="inline-flex">
      <div className={`flex items-center ${currentSize.gap} group cursor-pointer select-none ${className}`}>
        {/* Custom Logo Image OR Brown Badge with Paw Icon */}
        {logoType === 'image' && logoImage ? (
          <div className={`${currentSize.badge} overflow-hidden rounded-2xl border border-stone-200/80 bg-white flex items-center justify-center shadow-subtle transition-all duration-300 group-hover:scale-105 shrink-0`}>
            <img
              src={logoImage}
              alt={globalCms.brandName || "Logo"}
              className="w-full h-full object-contain p-0.5"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div
            className={`${currentSize.badge} bg-tdg-brown text-white border border-stone-800/30 flex items-center justify-center shadow-subtle transition-all duration-300 group-hover:scale-105 group-hover:shadow-card shrink-0`}
          >
            <PawPrint className={currentSize.icon} />
          </div>
        )}

        {/* Title Case Typography */}
        {showText && (
          <div className="flex flex-col justify-center -space-y-1">
            <span
              className={`tracking-tight font-display leading-tight ${currentSize.prefix} ${
                isDark ? 'text-white' : 'text-tdg-brown'
              }`}
            >
              {brandPrefix}
            </span>
            <span
              className={`font-display text-tdg-orange tracking-tight leading-none ${currentSize.highlight}`}
            >
              {brandHighlight}
            </span>
          </div>
        )}
      </div>
    </Magnet>
  );

  if (to) {
    return <Link to={to} className="inline-flex">{content}</Link>;
  }

  return content;
};

export default Logo;
