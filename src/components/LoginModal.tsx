import React, { useState } from 'react';
import { X, LogIn, UserCheck, Shield, GraduationCap } from 'lucide-react';
import { ClubUser, EnglishLevel, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: ClubUser[];
  onSelectUser: (user: ClubUser) => void;
  onRegisterUser: (name: string, email: string, level: EnglishLevel) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onSelectUser,
  onRegisterUser,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'register'>('quick');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [level, setLevel] = useState<EnglishLevel>('intermediate');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onRegisterUser(name.trim(), email.trim(), level);
    onShowToast(`Đăng ký tài khoản thành công! Chào mừng ${name} đến với CLB!`, 'emerald');
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-2 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Đăng Nhập Tài Khoản CLB Tiếng Anh</h3>
            <p className="text-xs text-slate-400">Kiểm soát quyền Leader, Admin và Học viên.</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'quick' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Nhập Nhanh Theo Vai Trò
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký Học Viên Mới
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Chọn một tài khoản mẫu để trải nghiệm đầy đủ quyền năng phân cấp:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    onShowToast(`Đã chuyển sang tài khoản: ${u.name} (${u.role.toUpperCase()})`, 'emerald');
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/90 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        u.role === 'admin'
                          ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                          : u.role === 'leader'
                          ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                          : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {u.avatarText}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                            ADMIN
                          </span>
                        )}
                        {u.role === 'leader' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                            LEADER
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
                    {u.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Họ và tên học viên:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn A..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="VD: nguyenvana@gmail.com..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Cấp độ tiếng Anh hiện tại:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as EnglishLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="newbie">🌱 Newbie (Mất gốc / Nhập môn A1-A2)</option>
                <option value="intermediate">🌿 Intermediate (Biết một chút / B1-B2)</option>
                <option value="advance">🌳 Advance (Chuyên sâu / IELTS 7.0+ C1-C2)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
            >
              Đăng Ký & Tham Gia CLB Ngay
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
