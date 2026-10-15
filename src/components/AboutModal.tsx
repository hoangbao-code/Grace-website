import React from 'react';
import { X, Sparkles, Compass, Users, Award, ShieldCheck, HeartHandshake, PhoneCall, Mail } from 'lucide-react';
import { Logo } from './Logo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center">
            <Logo size="lg" showText={false} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Về <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">GraceSpeak Club</span>
            </h2>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              Không gian luyện phản xạ và giao tiếp tiếng Anh tương tác độc quyền
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-cyan-950/20 border border-indigo-500/20 text-slate-200 text-sm leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Sứ Mệnh Của Câu Lạc Bộ</span>
          </div>
          <p>
            <strong>GraceSpeak Club</strong> được sáng lập với tâm huyết mang lại một môi trường luyện nói tiếng Anh thực chiến, xóa bỏ hoàn toàn nỗi sợ phát âm sai hay ngại ngùng khi giao tiếp. Tại đây, mỗi thành viên đều được lắng nghe, được hướng dẫn và rèn luyện phản xạ tự nhiên cùng các Leader & Cô giáo đầy nhiệt huyết.
          </p>
        </div>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Phân Cấp Theo Phòng</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Từ Newbie (A1-A2), Intermediate (B1-B2) đến Advance (C1-C2). Thành viên tự do lựa chọn thử thách.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Leader Host Kèm Cặp</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mỗi phòng do duy nhất Leader/Cô giáo host, dẫn dắt chủ đề, ghim từ vựng hay và chỉnh phát âm chuẩn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Tương Tác Real-time</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hiệu ứng bắn pháo hoa vỗ tay, thả biểu cảm bay, sóng âm thanh micro sống động tạo động lực 100%.
            </p>
          </div>
        </div>

        {/* Leadership & Staff */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Ban Chủ Nhiệm & Đội Ngũ Phụ Trách</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin Bảo */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                GB
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-white text-sm">Hoàng Xuân Gia Bảo</h5>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    ADMIN
                  </span>
                </div>
                <p className="text-xs text-slate-400">Chủ Nhiệm CLB & Quản Trị Hệ Thống</p>
                <p className="text-[11px] text-indigo-400 mt-0.5">SĐT: 0354084364</p>
              </div>
            </div>

            {/* Leader Cô Lan Anh */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                LA
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-white text-sm">Cô Hoàng Lan Anh</h5>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    LEADER
                  </span>
                </div>
                <p className="text-xs text-slate-400">Giảng Viên Trưởng & Host Phòng Luyện Nói</p>
                <p className="text-[11px] text-amber-400 mt-0.5">IELTS Speaking 8.0 • 5+ năm KN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Tuition Info */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>0354.084.364</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>dinhthilieu001011969@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <HeartHandshake className="w-4 h-4" />
            <span>Đồng hành cùng học viên 24/7</span>
          </div>
        </div>

        {/* Bottom Close Action */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            Đã Hiểu & Bắt Đầu Học Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
