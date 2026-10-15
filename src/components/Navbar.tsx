import React from 'react';
import { LayoutGrid, Video, ShieldAlert, LogIn, Crown, UserCheck } from 'lucide-react';
import { ClubUser } from '../types';

interface NavbarProps {
  currentView: 'lobby' | 'room' | 'admin';
  onSwitchView: (view: 'lobby' | 'room' | 'admin') => void;
  currentUser: ClubUser;
  onOpenLoginModal: () => void;
  onOpenTuitionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  currentUser,
  onOpenLoginModal,
  onOpenTuitionModal,
}) => {
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
              <span className="text-lg">🇬🇧</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                GRACE ENGLISH CLUB
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CLB TIẾNG ANH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Không gian luyện phản xạ giao tiếp theo cấp độ phòng
            </p>
          </div>
        </div>

        {/* Center View Switcher */}
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
            <span>Phân Cấp Phòng</span>
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
            <span>Phòng Luyện Nói</span>
          </button>

          {/* Admin Tab (Only when Admin is logged in) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onSwitchView('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Quản Trị Admin</span>
            </button>
          )}
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-3">
          {/* Tuition Button for Students */}
          {currentUser.role === 'student' && (
            <button
              onClick={onOpenTuitionModal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 ${
                currentUser.tuitionStatus === 'paid'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:border-amber-400'
              }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>
                {currentUser.tuitionStatus === 'paid' ? 'Đã Nộp Học Phí' : 'Nộp Học Phí CLB'}
              </span>
            </button>
          )}

          {/* Role Pill Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
            {currentUser.role === 'admin' ? (
              <span className="text-purple-400 font-extrabold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ADMIN BẢO</span>
              </span>
            ) : currentUser.role === 'leader' ? (
              <span className="text-amber-400 font-extrabold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>LEADER / CÔ GIÁO</span>
              </span>
            ) : (
              <span className="text-indigo-400 font-semibold text-[11px]">
                🎓 HỌC VIÊN CLB
              </span>
            )}
          </div>

          {/* Login / Switch Account Button */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
            title="Đăng nhập hoặc đăng ký tài khoản"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">
              {currentUser.id === 'guest-user' ? 'Đăng Nhập' : 'Tài Khoản'}
            </span>
          </button>

          {/* User Profile Avatar */}
          <div
            className="relative cursor-pointer"
            onClick={onOpenLoginModal}
            title={`${currentUser.name} (${currentUser.role})`}
          >
            <div
              className={`w-8 h-8 rounded-lg p-[1.5px] relative ${
                currentUser.role === 'admin'
                  ? 'bg-gradient-to-tr from-purple-500 to-indigo-500'
                  : currentUser.role === 'leader'
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                  : 'bg-gradient-to-tr from-violet-600 to-indigo-500'
              }`}
            >
              <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center text-xs font-bold text-white">
                {currentUser.avatarText}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
