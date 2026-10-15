import React from 'react';
import { LayoutGrid, Video, Music, Crown, Zap, Flame } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'lobby' | 'room';
  onSwitchView: (view: 'lobby' | 'room') => void;
  user: UserProfile;
  onOpenProModal: () => void;
  onOpenAudioHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  user,
  onOpenProModal,
  onOpenAudioHub,
}) => {
  const xpPercent = Math.min(100, Math.round((user.xp / user.maxXp) * 100));

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSwitchView('lobby')}
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-lg">🔥</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                100-DAY MASTERY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CLUB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Không gian học tập & Co-working ảo
            </p>
          </div>
        </div>

        {/* Center View Navigation Switcher */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => onSwitchView('lobby')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentView === 'lobby'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Sảnh Chung (Lobby)</span>
          </button>
          <button
            onClick={() => onSwitchView('room')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all relative cursor-pointer ${
              currentView === 'room'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Video className="w-3.5 h-3.5" />
            <span>Phòng Đang Học</span>
          </button>
        </div>

        {/* Right User Stats & Upgrade CTA */}
        <div className="flex items-center gap-3">
          {/* XP Bar & Level */}
          <div className="hidden md:flex flex-col items-end pr-2 border-r border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-amber-400 flex items-center gap-0.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Lv.{user.level}
              </span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-200">{user.xp.toLocaleString()}</span>
              <span className="text-slate-400 text-[10px]">/ {user.maxXp.toLocaleString()} XP</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
                +2 XP/m
              </span>
            </div>
            <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Streak Badges */}
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold"
              title="Chuỗi kỷ luật cá nhân"
            >
              <Flame className="w-3.5 h-3.5 fill-current text-orange-400" />
              <span>{user.personalStreak}</span>
              <span className="text-[10px] text-orange-400/80 font-normal hidden sm:inline">/100</span>
            </div>
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold"
              title="Chuỗi đồng đội Biệt đội"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user.squadStreak}</span>
              <span className="text-[10px] text-indigo-400/80 font-normal">ngày</span>
            </div>
          </div>

          {/* VIP Pro Badge Button */}
          <button
            onClick={onOpenProModal}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95 ${
              user.isPro
                ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                : 'bg-amber-500/15 border border-amber-500/30 hover:border-amber-400 text-amber-300'
            }`}
            title="Mở khóa gói Mastery Pro & VIP Dragon"
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">
              {user.isPro ? 'VIP PRO ACTIVE' : 'Nâng cấp Pro'}
            </span>
          </button>

          {/* Focus Audio Hub Button */}
          <button
            onClick={onOpenAudioHub}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 border border-indigo-400/40 transition-all relative group cursor-pointer active:scale-95 ring-2 ring-indigo-500/30"
            title="Mở Trạm Tìm Kiếm Nhạc YouTube, Spotify & Âm Thanh Tập Trung"
          >
            <span className="relative flex items-center justify-center">
              <Music className="w-4 h-4 text-white fill-current animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1"></span>
            </span>
            <span className="font-extrabold flex items-center gap-1">
              <span>🎵 Chọn & Tìm Nhạc</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono hidden sm:inline border border-amber-400/30">
              YOUTUBE/SPOTIFY
            </span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 p-[1.5px] relative">
              <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center text-xs font-bold text-white">
                {user.avatarText}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
