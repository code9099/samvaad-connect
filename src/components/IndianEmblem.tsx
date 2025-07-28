/**
 * Indian National Emblem SVG Component
 * Government-grade official emblem for SamvaadCop
 */

import React from 'react';

interface IndianEmblemProps {
  className?: string;
  size?: number;
}

export const IndianEmblem: React.FC<IndianEmblemProps> = ({ 
  className = '', 
  size = 40 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} drop-shadow-sm`}
      aria-label="भारत का राष्ट्रीय चिह्न - Indian National Emblem"
    >
      {/* Base Platform */}
      <ellipse
        cx="50"
        cy="85"
        rx="45"
        ry="8"
        fill="url(#baseGradient)"
        opacity="0.8"
      />
      
      {/* Central Pillar */}
      <rect
        x="46"
        y="45"
        width="8"
        height="40"
        fill="url(#pillarGradient)"
        rx="4"
      />
      
      {/* Lion Silhouettes - Simplified representation */}
      <g transform="translate(50,35)">
        {/* North Lion */}
        <path
          d="M0,-25 C-5,-28 -8,-25 -8,-20 L-8,-15 C-8,-12 -5,-10 0,-10 C5,-10 8,-12 8,-15 L8,-20 C8,-25 5,-28 0,-25 Z"
          fill="url(#lionGradient)"
        />
        
        {/* East Lion */}
        <path
          d="M25,0 C28,-5 25,-8 20,-8 L15,-8 C12,-8 10,-5 10,0 C10,5 12,8 15,8 L20,8 C25,8 28,5 25,0 Z"
          fill="url(#lionGradient)"
        />
        
        {/* South Lion */}
        <path
          d="M0,25 C5,28 8,25 8,20 L8,15 C8,12 5,10 0,10 C-5,10 -8,12 -8,15 L-8,20 C-8,25 -5,28 0,25 Z"
          fill="url(#lionGradient)"
        />
        
        {/* West Lion */}
        <path
          d="M-25,0 C-28,5 -25,8 -20,8 L-15,8 C-12,8 -10,5 -10,0 C-10,-5 -12,-8 -15,-8 L-20,-8 C-25,-8 -28,-5 -25,0 Z"
          fill="url(#lionGradient)"
        />
      </g>
      
      {/* Dharma Chakra (Wheel) - Simplified */}
      <circle
        cx="50"
        cy="35"
        r="12"
        fill="none"
        stroke="url(#chakraGradient)"
        strokeWidth="2"
      />
      
      {/* Chakra Spokes */}
      <g stroke="url(#chakraGradient)" strokeWidth="1" fill="none">
        <line x1="50" y1="23" x2="50" y2="47" />
        <line x1="60.5" y1="28" x2="39.5" y2="42" />
        <line x1="60.5" y1="42" x2="39.5" y2="28" />
        <line x1="62" y1="35" x2="38" y2="35" />
      </g>
      
      {/* Central Hub */}
      <circle
        cx="50"
        cy="35"
        r="3"
        fill="url(#hubGradient)"
      />
      
      {/* Motto Banner - "सत्यमेव जयते" represented as decorative band */}
      <rect
        x="20"
        y="75"
        width="60"
        height="6"
        fill="url(#mottoGradient)"
        rx="3"
      />
      
      {/* Decorative elements */}
      <circle cx="25" cy="78" r="1.5" fill="hsl(var(--saffron))" />
      <circle cx="50" cy="78" r="1.5" fill="hsl(var(--green))" />
      <circle cx="75" cy="78" r="1.5" fill="hsl(var(--saffron))" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--navy))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--navy))" stopOpacity="0.1" />
        </linearGradient>
        
        <linearGradient id="pillarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--saffron))" />
          <stop offset="50%" stopColor="hsl(var(--saffron-light))" />
          <stop offset="100%" stopColor="hsl(var(--saffron-dark))" />
        </linearGradient>
        
        <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--saffron-light))" />
          <stop offset="100%" stopColor="hsl(var(--saffron))" />
        </linearGradient>
        
        <linearGradient id="chakraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--navy))" />
          <stop offset="100%" stopColor="hsl(var(--navy-light))" />
        </linearGradient>
        
        <radialGradient id="hubGradient">
          <stop offset="0%" stopColor="hsl(var(--navy-light))" />
          <stop offset="100%" stopColor="hsl(var(--navy))" />
        </radialGradient>
        
        <linearGradient id="mottoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--green))" />
          <stop offset="50%" stopColor="hsl(var(--green-light))" />
          <stop offset="100%" stopColor="hsl(var(--green-dark))" />
        </linearGradient>
      </defs>
    </svg>
  );
};