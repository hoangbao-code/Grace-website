import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { ClubUser } from '../types';
import { ADMIN_EMAILS, INITIAL_ADMIN_USER } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: ClubUser[];
  onLoginSuccess: (user: ClubUser) => void;
  onRegisterSuccess: (user: ClubUser) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onRegisterSuccess,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form states
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerPhone, setRegisterPhone] = useState<string>('');

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();

    // Check if it's Bảo's Admin email
    const isAdmin =
      ADMIN_EMAILS.some((adminEm) => adminEm.toLowerCase() === cleanEmail) ||
      cleanEmail.includes('dinhthilieu') ||
      cleanEmail.includes('hoangbao');

    if (isAdmin) {
      onLoginSuccess(INITIAL_ADMIN_USER);
      onShowToast(`Chào mừng Chủ nhiệm Bảo trở lại hệ thống với quyền ADMIN!`, 'emerald');
      onClose();
      return;
    }

    // Check existing registered user
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      onLoginSuccess(existing);
      onShowToast(`Đăng nhập thành công! Chào bạn ${existing.name}`, 'emerald');
      onClose();
      return;
    }

    // If new email, log in as member
    const newStudent: ClubUser = {
      id: `user-${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'student',
      tuitionStatus: 'trial',
      avatarText: cleanEmail.slice(0, 2).toUpperCase(),
      joinDate: new Date().toLocaleDateString('vi-VN'),
      streakDays: 1,
    };
    onLoginSuccess(newStudent);
    onShowToast(`Đăng nhập thành công! Chào mừng thành viên mới.`, 'emerald');
    onClose();
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim()) return;

    const cleanEmail = registerEmail.trim().toLowerCase();
    const isAdmin =
      ADMIN_EMAILS.some((adminEm) => adminEm.toLowerCase() === cleanEmail) ||
      cleanEmail.includes('dinhthilieu') ||
      cleanEmail.includes('hoangbao');

    const newUser: ClubUser = {
      id: `user-${Date.now()}`,
      name: registerName.trim(),
      email: cleanEmail,
      role: isAdmin ? 'admin' : 'student',
      tuitionStatus: isAdmin ? 'paid' : 'trial',
      avatarText: registerName
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      phone: registerPhone.trim(),
      joinDate: new Date().toLocaleDateString('vi-VN'),
      streakDays: 1,
    };

    onRegisterSuccess(newUser);
    onShowToast(`Đăng ký tài khoản thành công! Chào mừng ${newUser.name} đến với CLB!`, 'emerald');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white pt-2">
            {activeTab === 'login' ? 'Đăng Nhập Thành Viên' : 'Đăng Ký Tài Khoản CLB'}
          </h3>
          <p className="text-xs text-slate-400">
            {activeTab === 'login'
              ? 'Nhập email và mật khẩu để vào phòng học'
              : 'Gia nhập cộng đồng luyện nói tiếng Anh cùng các Leader'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký</span>
          </button>
        </div>

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email tài khoản:</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="VD: dinhthilieu001011969@gmail.com hoặc email của bạn..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
              <span className="text-[10px] text-slate-500 block">
                💡 Email của Bảo sẽ tự động được nhận diện với quyền <strong>ADMIN</strong> tối cao.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mật khẩu:</span>
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Ngay</span>
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Họ và tên:</span>
              </label>
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="VD: Hoàng Xuân Gia Bảo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email:</span>
              </label>
              <input
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="VD: email@gmail.com..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mật khẩu:</span>
              </label>
              <input
                type="password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Tạo mật khẩu..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Số điện thoại / Zalo:</label>
              <input
                type="tel"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                placeholder="VD: 0354084364..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tạo Tài Khoản Thành Viên</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
