import React, { useState, useEffect } from 'react';
import { X, BookOpen, Save, Calendar } from 'lucide-react';
import { audioEngine } from '../services/audioService';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  onSaveNote: (day: number, note: string) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  day,
  onSaveNote,
  onShowToast,
}) => {
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`mastery_journal_day_${day}`) || '';
      setNote(saved);
    }
  }, [isOpen, day]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem(`mastery_journal_day_${day}`, note);
    onSaveNote(day, note);
    audioEngine.playTaskVictory();
    onShowToast(`Đã lưu nhật ký phản tư Ngày ${day}!`, 'emerald');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-2 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Nhật Ký Phản Tư: Ngày {day}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> D{day}
              </span>
            </div>
            <p className="text-xs text-slate-400">Ghi lại bài học đắt giá, khó khăn và cảm xúc trong ngày.</p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={6}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Hôm nay bạn đã hoàn thành những gì? Có điều gì làm bạn xao nhãng không? Kế hoạch cho ngày mai là gì?..."
            className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          ></textarea>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Nhật Ký Phản Tư</span>
          </button>
        </div>
      </div>
    </div>
  );
};
