import React from 'react';

interface PitchArchitectLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showBadge?: boolean;
}

export const PitchArchitectLogo: React.FC<PitchArchitectLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  showBadge = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Geometric Architectural Deck Emblem */}
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(77,68,255,0.4)] group-hover:drop-shadow-[0_6px_22px_rgba(255,204,213,0.5)] transition-all duration-300"
        >
          <defs>
            {/* Background container gradient */}
            <linearGradient id="pa-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#141938" />
              <stop offset="50%" stopColor="#0D122B" />
              <stop offset="100%" stopColor="#070A18" />
            </linearGradient>

            {/* Glowing border gradient */}
            <linearGradient id="pa-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4D44FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFCCD5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#05F1CD" stopOpacity="0.6" />
            </linearGradient>

            {/* Top apex slide plane */}
            <linearGradient id="pa-apex-slide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#FFCCD5" />
              <stop offset="100%" stopColor="#FF5470" />
            </linearGradient>

            {/* Middle foundation slide */}
            <linearGradient id="pa-mid-slide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4D44FF" />
            </linearGradient>

            {/* Bottom ground slide */}
            <linearGradient id="pa-bottom-slide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#05F1CD" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Architectural light beam */}
            <linearGradient id="pa-light-beam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. Rounded squircle frame with neon architectural border */}
          <rect
            x="1.5"
            y="1.5"
            width="45"
            height="45"
            rx="12"
            fill="url(#pa-bg-grad)"
            stroke="url(#pa-border-grad)"
            strokeWidth="1.5"
          />

          {/* 2. Architectural Blueprint Grid Accents */}
          <line x1="8" y1="24" x2="40" y2="24" stroke="#4D44FF" strokeOpacity="0.15" strokeDasharray="2 2" />
          <line x1="24" y1="8" x2="24" y2="40" stroke="#4D44FF" strokeOpacity="0.15" strokeDasharray="2 2" />

          {/* 3. Layer 1 (Base Slide - Emerald / Cyan Foundation) */}
          <g transform="translate(0, 5)">
            <path
              d="M24 25L35 19L24 13L13 19L24 25Z"
              fill="url(#pa-bottom-slide)"
              fillOpacity="0.35"
            />
            <path
              d="M13 19L24 25V27L13 21V19Z"
              fill="#0369A1"
              fillOpacity="0.4"
            />
            <path
              d="M35 19L24 25V27L35 21V19Z"
              fill="#0284C7"
              fillOpacity="0.5"
            />
          </g>

          {/* 4. Layer 2 (Middle Slide - Indigo / Purple Growth) */}
          <g transform="translate(0, 1)">
            <path
              d="M24 24L36 17.5L24 11L12 17.5L24 24Z"
              fill="url(#pa-mid-slide)"
              fillOpacity="0.85"
            />
            <path
              d="M12 17.5L24 24V26L12 19.5V17.5Z"
              fill="#3730A3"
            />
            <path
              d="M36 17.5L24 24V26L36 19.5V17.5Z"
              fill="#4338CA"
            />
          </g>

          {/* 5. Layer 3 (Apex Pitch Deck - Radiant Rose / Coral / White) */}
          <g transform="translate(0, -3)">
            {/* Top Plane */}
            <path
              d="M24 22L36 15.5L24 9L12 15.5L24 22Z"
              fill="url(#pa-apex-slide)"
            />
            {/* Left Edge Depth */}
            <path
              d="M12 15.5L24 22V24L12 17.5V15.5Z"
              fill="#BE123C"
            />
            {/* Right Edge Depth */}
            <path
              d="M36 15.5L24 22V24L36 17.5V15.5Z"
              fill="#E11D48"
            />

            {/* Precision Architectural Vector Trajectory (Ascending Pitch Arrow / P-Glyph) */}
            <path
              d="M20 16L24 12L28 14.5L24 18.5L20 16Z"
              fill="#FFFFFF"
              fillOpacity="0.9"
            />
            <path
              d="M23 13L25.5 14.5L23 17"
              stroke="#BE123C"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Specular light sheen on top ridge */}
            <path
              d="M13 15.5L24 9.5L35 15.5"
              stroke="url(#pa-light-beam)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>

          {/* 6. Apex Innovation Sparkle Node */}
          <circle cx="36" cy="11" r="1.5" fill="#05F1CD" className="animate-pulse" />
          <circle cx="36" cy="11" r="3.5" stroke="#05F1CD" strokeWidth="0.5" strokeOpacity="0.5" />
        </svg>
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-sans font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-slate-100 transition-colors">
              Pitch<span className="text-[#FFCCD5]">Architect</span>
            </span>
            {showBadge && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#4D44FF]/20 text-[#A5B4FC] border border-[#4D44FF]/35 shadow-sm">
                PRO STUDIO
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400 hidden xl:block">
            Autonomous Investor Engine
          </p>
        </div>
      )}
    </div>
  );
};
