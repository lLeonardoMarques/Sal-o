import React from 'react';
import logoImg from '../assets/images/toque_da_beleza_logo_1788544243145.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  // Dimension presets for mobile and desktop fluidity
  const sizeClasses = {
    sm: {
      img: 'w-10 h-10',
      title: 'text-lg',
      subtitle: 'text-[9px] tracking-[0.2em]',
    },
    md: {
      img: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
      title: 'text-lg sm:text-xl md:text-2xl',
      subtitle: 'text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.2em] sm:tracking-[0.22em]',
    },
    lg: {
      img: 'w-16 h-16 md:w-20 md:h-20',
      title: 'text-2xl md:text-3xl',
      subtitle: 'text-[11px] md:text-xs tracking-[0.25em]',
    },
    hero: {
      img: 'w-24 h-24 md:w-28 md:h-28',
      title: 'text-3xl md:text-4xl',
      subtitle: 'text-xs md:text-sm tracking-[0.28em]',
    },
  };

  const current = sizeClasses[size];

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group ${className}`}
    >
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 rounded-full bg-[#F3D5D0]/40 blur-[4px] transform group-hover:scale-110 transition-transform duration-300" />
        <img
          src={logoImg}
          alt="Toque da Beleza - Salão de Estética"
          className={`${current.img} relative rounded-full object-cover border border-[#EAC6BF]/60 shadow-sm transition-transform duration-300 group-hover:scale-105`}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`font-serif-luxury font-medium text-[#4A222B] leading-none ${current.title} tracking-tight group-hover:text-[#7D3845] transition-colors`}>
            Toque <span className="font-script text-[#B35A6C] text-[1.25em] font-normal mx-0.5">da</span> Beleza
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-px w-3 bg-[#D4A9A0]/60 hidden sm:inline-block" />
            <span className={`uppercase font-serif-luxury font-semibold text-[#8C5D66] ${current.subtitle}`}>
              Salão de Estética
            </span>
            <span className="h-px w-3 bg-[#D4A9A0]/60 hidden sm:inline-block" />
          </div>
        )}
      </div>
    </div>
  );
};
