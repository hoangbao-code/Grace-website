import React from 'react';
import { X, LogOut, ShieldAlert, UserCheck, GraduationCap, Flame, Calendar, Phone, Mail, CheckCircle2, AlertCircle, Award, BookOpen } from 'lucide-react';
import { ClubUser } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ClubUser;
  isSelf: boolean;
  onLogout: () => void;
  onOpenTuitionModal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  isSelf,
  onLogout,
  onOpenTuitionModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          {/* Avatar with dynamic glow ring */}
          <div
            className={`w-20 h-20 rounded-2xl p-[2px] shadow-xl ${
              user.role === 'admin'
                ? 'bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 shadow-purple-500/30'
                : user.role === 'leader'
                ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-500 shadow-amber-500/30'
                : 'bg-gradient-to-tr from-indigo-500 via-cyan-500 to-emerald-400 shadow-indigo-500/20'
            }`}
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
              {user.avatarText}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{user.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>

          {/* Role Badge */}
          <div className="flex items-center gap-2">
            {user.role === 'admin' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-extrabold tracking-wide">
                <ShieldAlert className="w-3.5 h-3.5" />
                CHỦ NHIỆM ADMIN BẢO
              </span>
            ) : user.role === 'leader' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold tracking-wide">
                <UserCheck className="w-3.5 h-3.5" />
                LEADER / GIẢNG VIÊN HOST
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold tracking-wide">
                <GraduationCap className="w-3.5 h-3.5" />
                HỌC VIÊN CLB
              </span>
            )}

            {/* Tuition Status */}
            {user.role === 'student' && (
              <span
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  user.tuitionStatus === 'paid'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {user.tuitionStatus === 'paid' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Đã Nộp Học Phí</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    <span>Dùng Thử (Trial)</span>
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Detailed Stats & Info */}
        <div className="space-y-2.5">
          {/* Phone & Date */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-indigo-400" /> Số điện thoại
              </span>
              <p className="font-semibold text-slate-200">{user.phone || 'Chưa cập nhật'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" /> Ngày gia nhập
              </span>
              <p className="font-semibold text-slate-200">{user.joinDate || 'Hôm nay'}</p>
            </div>
          </div>

          {/* Streak & Activity */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Chuỗi học tập
              </span>
              <p className="font-bold text-amber-400">{user.streakDays || 0} Ngày liên tiếp 🔥</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Tinh thần rèn luyện
              </span>
              <p className="font-bold text-purple-300">Xuất Sắc 10/10</p>
            </div>
          </div>

          {/* Special Leader Bio if Leader */}
          {user.role === 'leader' && (
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Hồ sơ Giảng viên / Leader</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                IELTS Speaking 8.0, 5+ năm kinh nghiệm dẫn dắt các câu lạc bộ tiếng Anh thực chiến. Phương pháp giảng dạy gợi mở, chỉnh sửa phát âm IPA từng âm tiết và truyền cảm hứng tự tin cho học viên.
              </p>
            </div>
          )}

          {/* Pay Tuition Action if unpaid student */}
          {user.role === 'student' && user.tuitionStatus !== 'paid' && isSelf && onOpenTuitionModal && (
            <button
              onClick={() => {
                onClose();
                onOpenTuitionModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Nộp Học Phí CLB Qua VietQR MBBank</span>
            </button>
          )}
        </div>

        {/* Bottom Actions: Logout or Close */}
        <div className="pt-2 flex items-center gap-3">
          {isSelf && user.id !== 'guest-user' ? (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Đăng Xuất Tài Khoản</span>
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl glass-button text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer text-center"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
