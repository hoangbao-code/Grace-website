import React from 'react';
import { X, Crown, Check, Sparkles, Zap, Flame, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioService';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onActivatePro: () => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onActivatePro,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleActivate = () => {
    onActivatePro();
    audioEngine.playTaskVictory();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
    onShowToast('🎉 Chúc mừng Bảo đã kích hoạt MASTERY PRO VIP thành công!', 'amber');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl space-y-6 overflow-hidden">
        {/* Glow Background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>GÓI ĐẶC QUYỀN VIP MASTERY</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Nâng Cấp Gói <span className="bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">Mastery Pro</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Mở khóa toàn bộ đặc quyền phòng học VIP Dragon, hệ số nhân x2 XP, biểu tượng cảm xúc độc quyền và âm thanh sóng não chuyên sâu.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-xs text-slate-200">
          {[
            { title: 'Truy cập phòng học VIP Dragon Lounge không giới hạn', icon: <Crown className="w-4 h-4 text-amber-400" /> },
            { title: 'Tăng tốc x2.0 XP khi cày Pomodoro đồng bộ', icon: <Zap className="w-4 h-4 text-indigo-400" /> },
            { title: 'Viền phát sáng RGB Rainbow quanh Avatar cá nhân', icon: <Sparkles className="w-4 h-4 text-pink-400" /> },
            { title: 'Mở khóa toàn bộ bộ trộn âm thanh Binaural Beats', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
            { title: 'Bảo vệ chuỗi Streak 100 ngày (Đóng băng khi bận)', icon: <Flame className="w-4 h-4 text-orange-400" /> },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <span className="flex-1 font-medium">{item.title}</span>
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Pricing / Trial Action */}
        <div className="pt-2 text-center space-y-3">
          {isPro ? (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
              ✨ Bạn đã là thành viên VIP Mastery Pro!
            </div>
          ) : (
            <>
              <button
                onClick={handleActivate}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
              >
                Kích Hoạt 7 Ngày Dùng Thử Miễn Phí (Trial)
              </button>
              <p className="text-[11px] text-slate-400">
                Không yêu cầu thẻ tín dụng • Trải nghiệm đầy đủ 100% tính năng cao cấp
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
