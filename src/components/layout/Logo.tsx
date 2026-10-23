'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'header' | 'footer' | 'auth' | 'admin' | 'minimal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  showSubtitle?: boolean;
}

/**
 * Bespoke Luxury Emblem SVG for ATELIER ÉCLAT
 * Features:
 * - Diamond-cut octagonal luxury seal
 * - Interlocking Haute Couture "A" & "É" Monogram
 * - Four-point Éclat brilliance star with micro radiance rays
 * - Dual-layer metallic gold and royal burgundy precision vectors
 */
export function AtelierEmblem({
  className = 'w-8 h-8',
  theme = 'light',
}: {
  className?: string;
  theme?: 'light' | 'dark' | 'gold';
}) {
  const isDark = theme === 'dark' || theme === 'gold';

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-1 ${className}`}
      aria-label="Atelier Éclat Emblem"
    >
      <defs>
        {/* Luxury Gold Gradients */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E8CE" />
          <stop offset="30%" stopColor="#E8CFA8" />
          <stop offset="70%" stopColor="#CBB085" />
          <stop offset="100%" stopColor="#8C6D3B" />
        </linearGradient>

        <linearGradient id="burgundyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7E2540" />
          <stop offset="50%" stopColor="#641C32" />
          <stop offset="100%" stopColor="#3F0E1E" />
        </linearGradient>

        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E8CFA8" stopOpacity="0.2" />
        </linearGradient>

        {/* Outer Glow Filter */}
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Fine Diamond Facet Frame */}
      <polygon
        points="50,3 97,50 50,97 3,50"
        stroke="url(#goldGradient)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill={isDark ? '#17151A' : '#FFF9F3'}
        className="transition-colors duration-300"
      />

      {/* Inner Concentric Diamond Border */}
      <polygon
        points="50,9 91,50 50,91 9,50"
        stroke="url(#goldGradient)"
        strokeWidth="0.6"
        strokeDasharray="2 1.5"
        strokeOpacity="0.75"
        fill="none"
      />

      {/* 8-Point Geometric Facet Accent Dots */}
      <circle cx="50" cy="5.5" r="1.2" fill="url(#goldGradient)" />
      <circle cx="94.5" cy="50" r="1.2" fill="url(#goldGradient)" />
      <circle cx="50" cy="94.5" r="1.2" fill="url(#goldGradient)" />
      <circle cx="5.5" cy="50" r="1.2" fill="url(#goldGradient)" />

      {/* Maison Crest Monogram: Stylized Haute Couture "A" & "É" */}
      <g className="transition-transform duration-300 group-hover:scale-[1.02] origin-center">
        {/* Left Leg of A */}
        <path
          d="M32 72 L49 26 L51 26 L36 72 Z"
          fill={isDark ? 'url(#goldGradient)' : 'url(#burgundyGradient)'}
        />
        {/* Right Leg of A / Backbone of É */}
        <path
          d="M48 26 L65 72 L61 72 L47 26 Z"
          fill={isDark ? 'url(#goldGradient)' : 'url(#burgundyGradient)'}
        />
        {/* Horizontal Crossbar of A & É */}
        <path
          d="M37 54 L62 54 L63 56 L36 56 Z"
          fill="url(#goldGradient)"
        />
        {/* Top Serif Accent & É Bar */}
        <path
          d="M47 38 L65 38 L65 40 L49 40 Z"
          fill="url(#goldGradient)"
        />
        {/* Bottom Serifs on legs */}
        <line x1="29" y1="72" x2="38" y2="72" stroke="url(#goldGradient)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="59" y1="72" x2="68" y2="72" stroke="url(#goldGradient)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Éclat Acute Accent (Crown Jewel) */}
        <polygon
          points="51,20 57,14 59,15 53,22"
          fill="url(#goldGradient)"
          filter="url(#goldGlow)"
        />

        {/* Central Éclat Brilliance Star (4-Point Diamond Sparkle) */}
        <g transform="translate(50, 50)" filter="url(#goldGlow)">
          <path
            d="M0,-8 Q0,-1.5 6.5,0 Q0,1.5 0,8 Q0,1.5 -6.5,0 Q0,-1.5 0,-8 Z"
            fill="url(#goldGradient)"
          />
          <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  );
}

export function Logo({
  variant = 'header',
  size = 'md',
  href = '/',
  className = '',
  showSubtitle = true,
}: LogoProps) {
  const isDark = variant === 'footer' || variant === 'admin';

  // Sizing configurations
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 md:w-9 md:h-9',
    lg: 'w-10 h-10 md:w-12 md:h-12',
    xl: 'w-14 h-14 md:w-16 md:h-16',
  };

  const titleSizes = {
    sm: 'text-lg tracking-[0.2em]',
    md: 'text-xl sm:text-2xl tracking-[0.24em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.26em]',
    xl: 'text-3xl sm:text-4xl tracking-[0.28em]',
  };

  const subtitleContent = {
    header: 'HAUTE HORLOGERIE & COUTURE',
    footer: 'PARIS • GENÈVE • NEW YORK',
    auth: 'MAISON DE HAUTE COUTURE',
    admin: 'MAISON ATELIER • PORTAL',
    minimal: 'PARIS',
    icon: '',
  };

  if (variant === 'icon') {
    const iconOnly = (
      <div className={`group inline-flex items-center justify-center ${className}`}>
        <AtelierEmblem
          className={emblemSizes[size]}
          theme={isDark ? 'dark' : 'light'}
        />
      </div>
    );
    return href ? <Link href={href} aria-label="Atelier Éclat Home">{iconOnly}</Link> : iconOnly;
  }

  const logoContent = (
    <div className={`group inline-flex items-center gap-3 md:gap-3.5 select-none ${className}`}>
      {/* Handcrafted Royal Crest Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <AtelierEmblem
          className={emblemSizes[size]}
          theme={isDark ? 'dark' : 'light'}
        />
      </div>

      {/* Brand Typography & Subtitle */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-medium leading-none transition-colors duration-300 ${titleSizes[size]} ${
              isDark
                ? 'text-[#FFF9F3] group-hover:text-[#E8CFA8]'
                : 'text-[#17151A] group-hover:text-[#641C32]'
            }`}
          >
            ATELIER ÉCLAT
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`text-[8px] md:text-[9px] font-semibold tracking-[0.35em] uppercase leading-none transition-colors duration-300 ${
                isDark
                  ? 'text-[#E8CFA8]/90 group-hover:text-[#F7EFE4]'
                  : 'text-[#641C32] group-hover:text-[#B83B5E]'
              }`}
            >
              {subtitleContent[variant]}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" aria-label="Atelier Éclat Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
