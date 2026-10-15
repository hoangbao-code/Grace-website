import React from 'react';
import { LayoutGrid, ShieldAlert, LogIn, LogOut, Crown, UserCheck, Sparkles, Video } from 'lucide-react';
import { ClubUser } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: 'intro' | 'lobby' | 'room' | 'admin';
  onSwitchView: (view: 'intro' | 'lobby' | 'room' | 'admin') => void;
  currentUser: ClubUser;
  onOpenLoginModal: () => void;
  onOpenTuitionModal: () => void;
  onOpenProfileModal: (user: ClubUser) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  currentUser,
  onOpenLoginModal,
  onOpenTuitionModal,
  onOpenProfileModal,
  onLogout,
}) => {
  const isGuest = currentUser.id === 'guest-user';

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Name */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => onSwitchView('intro')}
          title="Trang chủ Fluently Club"
        >
          <Logo size="md" showText={true} />
        </div>

        {/* Center Navigation Links: Trang Giới Thiệu & Sảnh Phòng Học */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
          {/* Intro Tab */}
          <button
            onClick={() => onSwitchView('intro')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              currentView === 'intro'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Giới Thiệu CLB</span>
          </button>

          {/* Lobby Tab */}
          <button
            onClick={() => onSwitchView('lobby')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              currentView === 'lobby'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Sảnh Phòng Học</span>
          </button>

          {/* Admin Dashboard Tab (Visible when Admin is logged in) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onSwitchView('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Quản Trị Admin</span>
            </button>
          )}

          {/* In-room status badge if currently attending a room */}
          {currentView === 'room' && (
            <button
              onClick={() => onSwitchView('room')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Video className="w-3.5 h-3.5" />
              <span>Đang Trong Phòng</span>
            </button>
          )}
        </nav>

        {/* Right Side: Tuition, Profile, Login/Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Tuition Button for Students */}
          {currentUser.role === 'student' && (
            <button
              onClick={onOpenTuitionModal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 ${
                currentUser.tuitionStatus === 'paid'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:border-amber-400'
              }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>
                {currentUser.tuitionStatus === 'paid' ? 'Đã Nộp Học Phí' : 'Học Phí CLB'}
              </span>
            </button>
          )}

          {/* Mobile Lobby Shortcut */}
          <button
            onClick={() => onSwitchView(currentView === 'intro' ? 'lobby' : 'intro')}
            className="md:hidden p-2 rounded-xl glass-button text-slate-300 hover:text-white cursor-pointer"
            title="Chuyển đổi Giới thiệu / Sảnh học"
          >
            {currentView === 'intro' ? <LayoutGrid className="w-4 h-4 text-cyan-400" /> : <Sparkles className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Auth State Handling */}
          {isGuest ? (
            /* Guest State: Show Login/Register */
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 cursor-pointer transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập / Đăng Ký</span>
            </button>
          ) : (
            /* Logged-In State: User Profile Pill + Logout Button */
            <div className="flex items-center gap-2">
              {/* Profile Pill Trigger */}
              <button
                onClick={() => onOpenProfileModal(currentUser)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer group"
                title="Xem thông tin tài khoản"
              >
                {/* Avatar with role gradient */}
                <div
                  className={`w-7 h-7 rounded-lg p-[1.5px] ${
                    currentUser.role === 'admin'
                      ? 'bg-gradient-to-tr from-purple-500 to-pink-500'
                      : currentUser.role === 'leader'
                      ? 'bg-gradient-to-tr from-amber-400 to-orange-500'
                      : 'bg-gradient-to-tr from-indigo-500 to-cyan-400'
                  }`}
                >
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-[10px] font-bold text-white">
                    {currentUser.avatarText}
                  </div>
                </div>

                {/* Name & Role Text */}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1 max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold flex items-center gap-1">
                    {currentUser.role === 'admin' ? (
                      <span className="text-purple-400 font-extrabold flex items-center gap-0.5">
                        <ShieldAlert className="w-2.5 h-2.5" /> ADMIN BẢO
                      </span>
                    ) : currentUser.role === 'leader' ? (
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        <UserCheck className="w-2.5 h-2.5" /> LEADER HOST
                      </span>
                    ) : (
                      <span className="text-indigo-400">HỌC VIÊN CLB</span>
                    )}
                  </div>
                </div>
              </button>

              {/* Direct Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-bold cursor-pointer transition-all active:scale-95"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
