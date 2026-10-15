import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, BookOpen, Users, Calendar, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EnglishRoom } from '../types';
import { audioEngine } from '../services/audioService';

interface SessionRecapModalProps {
  isOpen: boolean;
  room: EnglishRoom;
  vocabList: string[];
  participantsCount: number;
  onClose: () => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber' | 'rose') => void;
}

export const SessionRecapModal: React.FC<SessionRecapModalProps> = ({
  isOpen,
  room,
  vocabList,
  participantsCount,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const generateRecapText = () => {
    const vocabLines =
      vocabList.length > 0
        ? vocabList.map((item, idx) => `  ${idx + 1}. ${item}`).join('\n')
        : '  (Buổi học tập trung phản xạ giao tiếp tự do không ghim từ vựng)';

    return `🌟 [BẢN TỔNG KẾT BUỔI SINH HOẠT — FLUENTLY CLUB] 🌟
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗓️ Ngày: ${todayStr}
🏫 Phòng học: ${room.title}
🎯 Cấp độ: ${room.levelLabel}
🎙️ Leader Chủ Trì: ${room.leaderName}
👥 Số lượng thành viên tham gia: ${participantsCount} bạn
💬 Chủ đề thảo luận: "${room.topic}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 DANH SÁCH TỪ VỰNG & MẪU CÂU ĐÃ GHIM:
${vocabLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Lời nhắn từ Leader: Cảm ơn tất cả các bạn đã tích cực mở mic tương tác hôm nay! Hãy ôn lại từ vựng và hẹn gặp lại các bạn trong buổi sinh hoạt tiếp theo nhé!
🌐 Luyện nói tiếng Anh mỗi ngày tại: https://www.hxgb07.site
#FluentlyClub #EnglishSpeaking #PracticeMakesPerfect`;
  };

  const handleCopyRecap = () => {
    const recapText = generateRecapText();
    navigator.clipboard.writeText(recapText);
    setCopied(true);
    audioEngine.playTaskVictory();

    // Small celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    onShowToast('Đã sao chép toàn bộ bản tổng kết! Bạn có thể dán ngay vào Zalo/Facebook nhóm lớp.', 'emerald');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-purple-500/30 p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SESSION RECAP EXPORTER • BÁO CÁO TỔNG KẾT BUỔI HỌC</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Tổng Kết Buổi Sinh Hoạt Lớp
            </h2>
            <p className="text-xs text-slate-400">
              Xuất tóm tắt chủ đề và từ vựng nhanh để Leader chia sẻ vào Zalo/Facebook nhóm lớp.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white glass-button transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body - scrollable */}
        <div className="relative z-10 my-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Room Summary Header Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/40 border border-purple-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-extrabold text-sm text-white">{room.title}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {room.levelLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{todayStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Host: {room.leaderName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{participantsCount} học viên tham gia</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Chủ đề thảo luận:</span>
              <p className="text-xs text-indigo-300 font-semibold italic">"{room.topic}"</p>
            </div>
          </div>

          {/* Vocab List Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Từ vựng & Mẫu câu đã ghim ({vocabList.length})</span>
              </span>
              <span className="text-[10px] text-slate-500">Được Leader & thành viên thêm</span>
            </div>

            {vocabList.length === 0 ? (
              <p className="text-slate-400 italic p-3 text-center bg-slate-900/40 rounded-xl border border-white/5">
                Chưa có từ vựng nào được ghim trong buổi học này.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {vocabList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-100">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl glass-button text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>

          <button
            onClick={handleCopyRecap}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Đã Sao Chép Thành Công!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>📋 Sao Chép Báo Cáo Gửi Zalo/FB</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
