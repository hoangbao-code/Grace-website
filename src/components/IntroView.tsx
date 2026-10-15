import React from 'react';
import { ArrowRight, Sparkles, Compass, Users, Award, CheckCircle2, ShieldCheck, Video, Zap, MessageSquareQuote } from 'lucide-react';
import { Logo } from './Logo';

interface IntroViewProps {
  onGoToLobby: () => void;
  onOpenTuitionModal: () => void;
  onOpenLoginModal: () => void;
  isLoggedIn: boolean;
}

export const IntroView: React.FC<IntroViewProps> = ({
  onGoToLobby,
  onOpenTuitionModal,
  onOpenLoginModal,
  isLoggedIn,
}) => {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative">
        {/* Glow orb backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-violet-600/20 via-indigo-600/20 to-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/15 via-indigo-500/15 to-cyan-500/15 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>GRACESPEAK CLUB • KHÔNG GIAN LUYỆN NÓI TIẾNG ANH PHẢN XẠ THỜI GIAN THỰC</span>
        </div>

        {/* Main Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-tight">
            Tự Tin Bứt Phá Giao Tiếp Với{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Phòng Luyện Nói Tương Tác
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Môi trường thực chiến xóa bỏ hoàn toàn rào cản sợ phát âm sai hay ngại ngùng. Luyện phản xạ tự nhiên theo từng cấp độ phòng học cùng Leader & Giảng viên giàu kinh nghiệm.
          </p>
        </div>

        {/* GIANT PROMINENT CTA BUTTON */}
        <div className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGoToLobby}
            className="w-full sm:w-auto px-8 py-5 sm:px-12 sm:py-5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-extrabold text-lg sm:text-xl shadow-2xl shadow-indigo-500/40 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group border border-white/20"
          >
            <Video className="w-6 h-6 text-cyan-200" />
            <span>VÀO SẢNH PHÒNG HỌC NGAY</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          {!isLoggedIn && (
            <button
              onClick={onOpenLoginModal}
              className="w-full sm:w-auto px-6 py-5 rounded-2xl glass-button text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer"
            >
              Đăng Nhập / Đăng Ký Thành Viên
            </button>
          )}
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Phân cấp theo phòng (Room-Based)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Leader / Cô giáo host kèm cặp</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Tương tác Real-time Game hóa</span>
          </div>
        </div>
      </section>

      {/* 3 Room Levels Breakdown */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hệ Thống Phòng Học Phân Cấp Khoa Học
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Học viên không bị gắn mác cố định. Bạn hoàn toàn tự do lựa chọn phòng học phù hợp với mục tiêu và sự tự tin của bản thân mỗi ngày.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Newbie Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 relative group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Cấp Độ Newbie</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  A1 — A2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Dành cho người mới bắt đầu hoặc mất gốc phản xạ</p>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Chỉnh phát âm chuẩn bảng ký âm quốc tế IPA.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Nạp từ vựng và mẫu câu phản xạ giao tiếp cơ bản.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Host gợi mở từng câu ngắn, không tạo áp lực.</span>
              </li>
            </ul>
          </div>

          {/* Intermediate Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 relative group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Cấp Độ Intermediate</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  B1 — B2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Đã có từ vựng cơ bản, muốn phản xạ trôi chảy tự nhiên</p>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Thảo luận các chủ đề đời sống, công việc và xã hội.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Nâng cấp Idioms, Collocations và nối âm mượt mà.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Luyện cách diễn đạt ý kiến dài 2 - 3 phút không vấp.</span>
              </li>
            </ul>
          </div>

          {/* Advance Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 relative group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl font-bold">
              🌳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Cấp Độ Advance</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  C1 — C2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Tranh biện học thuật, luyện Speaking IELTS 7.5+</p>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Tranh biện (Debate), phản biện tư duy chuyên sâu.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Thuyết trình phân tích Case Study kinh doanh & công nghệ.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Hoàn thiện phong thái và ngữ điệu tự nhiên như người bản xứ.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Experience Pillars */}
      <section className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Trải Nghiệm Độc Đáo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tại Sao Nên Luyện Nói Tại GraceSpeak Club?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              1
            </div>
            <h4 className="font-bold text-white text-base">Host Duy Nhất Bởi Leader</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mỗi phòng luôn có 1 Giảng viên/Leader mở phòng, điều phối lượt phát biểu, ghim từ vựng hay ngay trên bảng và sửa lỗi ngữ điệu trực tiếp.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <h4 className="font-bold text-white text-base">Tương Tác Real-time Sống Động</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thả tim, biểu cảm bay lượn (👏, 🔥, ❤️, 💡, 💯), bắn pháo hoa Confetti tán thưởng, micro visualizer sóng âm giúp buổi học tràn đầy năng lượng.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              3
            </div>
            <h4 className="font-bold text-white text-base">Học Phí Linh Hoạt & Minh Bạch</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thành viên được trải nghiệm phòng học thử nghiệm trước khi quyết định tham gia dài hạn. Thanh toán VietQR thuận tiện và kích hoạt tức thì.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="text-center py-8 space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sẵn Sàng Nâng Tầm Tiếng Anh Của Bạn?
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Bước vào Sảnh Phòng Học ngay hôm nay và chọn chủ đề bạn yêu thích để bắt đầu luyện phản xạ cùng mọi người.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onGoToLobby}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-black text-lg shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer group border border-white/20"
          >
            <span>VÀO SẢNH PHÒNG HỌC NGAY</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </section>
    </main>
  );
};
