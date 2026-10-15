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
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const svgSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon: Khung hội thoại + Sóng âm phản xạ Gradient */}
      <div
        className={`relative flex items-center justify-center ${containerSizes[size]} bg-slate-900/90 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all duration-300 group-hover:border-purple-400/60 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]`}
      >
        <svg
          className={svgSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          {/* Khung hội thoại cách điệu */}
          <path
            d="M12 3C7.02944 3 3 6.58172 3 11C3 12.9585 3.79468 14.7535 5.11583 16.1431C5.42322 16.4664 5.51865 16.9298 5.3444 17.3416L4.39162 19.5936C4.09391 20.2973 4.78283 21.0125 5.49811 20.7429L7.9547 19.8172C8.34901 19.6687 8.78483 19.6874 9.19209 19.7995C10.0827 20.0447 11.0261 20.1765 12 20.1765C16.9706 20.1765 21 16.5947 21 12.1765C21 7.7582 16.9706 3 12 3Z"
            stroke="url(#brandGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 3 vạch sóng âm luyện nói bên trong */}
          <path
            d="M8.5 11.5V12.5M12 9V15M15.5 10.5V13.5"
            stroke="url(#brandGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
              Fluently
            </span>
            <span className="text-[10px] font-extrabold tracking-widest px-1.5 py-0.5 rounded-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 uppercase">
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
