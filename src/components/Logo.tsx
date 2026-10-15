import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Badge */}
      <div
        className={`relative ${iconSizes[size]} rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300`}
      >
        <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-cyan-500/10 pointer-events-none" />

          {/* SVG Monogram */}
          <svg viewBox="0 0 100 100" className="w-[82%] h-[82%] drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="logo-linear" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="star-linear" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>

            {/* Stylized Speech G */}
            <path
              d="M66 42 C63 34 56 30 48 30 C37 30 29 39 29 50 C29 61 37 70 48 70 C58 70 65 63 66 54 L48 54 L48 46 L75 46 C75.5 48 75.5 49 75.5 51 C75.5 66 64 77 48 77 C32 77 21 65 21 50 C21 35 32 23 48 23 C57 23 65 27 70 34 L66 42 Z"
              fill="url(#logo-linear)"
            />

            {/* Speaking Sparkle Star */}
            <path
              d="M72 26 C72 31 75 34 80 34 C75 34 72 37 72 42 C72 37 69 34 64 34 C69 34 72 31 72 26 Z"
              fill="url(#star-linear)"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              GraceSpeak
            </span>
            <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-indigo-300 border border-indigo-500/30">
              CLUB
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 tracking-wide hidden sm:block">
            Cộng Đồng Luyện Nói & Phản Xạ Tiếng Anh
          </span>
        </div>
      )}
    </div>
  );
};
