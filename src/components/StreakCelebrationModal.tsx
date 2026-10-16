import React, { useEffect } from 'react';
import { X, Flame, Check, Sparkles, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClubUser } from '../types';
import { audioEngine } from '../services/audioService';

interface StreakCelebrationModalProps {
  isOpen: boolean;
  user: ClubUser;
  onClose: () => void;
  isJustClaimed?: boolean;
}

export const StreakCelebrationModal: React.FC<StreakCelebrationModalProps> = ({
  isOpen,
  user,
  onClose,
  isJustClaimed = false,
}) => {
  useEffect(() => {
    if (isOpen && isJustClaimed) {
      audioEngine.playTaskVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5722', '#FF9800', '#FFC107', '#E91E63', '#00E5FF'],
      });
    }
  }, [isOpen, isJustClaimed]);

  if (!isOpen) return null;

  // Lấy các ngày trong tuần hiện tại (Thứ 2 -> Chủ Nhật)
  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = Thứ 2, 6 = Chủ Nhật
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const streakDays = user.streakDays || 0;

  const handleShareStreak = () => {
    const text = `🔥 Tôi vừa hoàn thành buổi học và duy trì chuỗi Streak ${streakDays} ngày liên tiếp tại Fluently Club! Hãy cùng tôi luyện nói tiếng Anh mỗi ngày tại: https://www.hxgb07.site 🚀`;
    navigator.clipboard.writeText(text);
    alert('Đã sao chép nội dung khoe chuỗi Streak! Bạn có thể dán vào Zalo/Facebook story ngay nhé!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-orange-500/40 p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-orange-500/30 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white glass-button transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Animated Fire Icon */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsing glow ring */}
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 blur-xl opacity-60 animate-pulse pointer-events-none" />

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-1 shadow-2xl shadow-orange-500/50 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center relative overflow-hidden">
                <span className="text-5xl animate-bounce">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isJustClaimed ? 'THẮP SÁNG CHUỖI STREAK HÔM NAY!' : 'CHUỖI LUYỆN NÓI LIÊN TỤC'}</span>
        </div>

        {/* Streak Count Big Number */}
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {streakDays}{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            NGÀY LIÊN TIẾP!
          </span>
        </h2>

        <p className="text-xs text-slate-300 max-w-xs mx-auto mt-2 leading-relaxed">
          {streakDays === 0
            ? 'Hãy hoàn thành 1 buổi học trong phòng để bắt đầu thắp sáng ngọn lửa Streak đầu tiên nhé!'
            : isJustClaimed
            ? 'Tuyệt vời! Bạn đã giữ vững thói quen luyện nói tiếng Anh mỗi ngày. Hãy quay lại vào ngày mai để chuỗi ngày không bị ngắt quãng nhé!'
            : 'Chuỗi ngày luyện nói phản xạ liên tiếp của bạn tại Fluently Club. Hãy chăm chỉ giữ lửa mỗi ngày!'}
        </p>

        {/* 7 Days of Week Streak Tracker (Duolingo Style) */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 my-6">
          <div className="text-[11px] text-slate-400 font-semibold mb-3 flex items-center justify-between">
            <span>Tiến độ tuần này:</span>
            <span className="text-orange-400 font-bold">Hôm nay: {daysOfWeek[currentDayOfWeek]}</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === currentDayOfWeek;
              // Nếu hôm nay đã nhận streak, ngày hôm nay sáng. Các ngày trước đó nếu streakDays đủ thì sáng
              const isPastAndAchieved =
                idx <= currentDayOfWeek && currentDayOfWeek - idx < streakDays;

              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold ${
                      isToday ? 'text-amber-300 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </span>

                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isPastAndAchieved
                        ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-orange-500/30'
                        : isToday
                        ? 'bg-slate-800 border-2 border-orange-500/60 text-orange-400 animate-pulse'
                        : 'bg-slate-950 border border-white/5 text-slate-600'
                    }`}
                  >
                    {isPastAndAchieved ? (
                      <Flame className="w-5 h-5 fill-current" />
                    ) : isToday ? (
                      <span className="text-xs font-bold">Hôm nay</span>
                    ) : (
                      <Check className="w-4 h-4 opacity-30" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleShareStreak}
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-2xl glass-button text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Khoe Chuỗi Streak</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-xl shadow-orange-500/25 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Tiếp Tục Luyện Nói 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
