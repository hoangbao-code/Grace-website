import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, BookOpen } from 'lucide-react';
import { ClubUser, EnglishLevel, EnglishRoom } from '../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ClubUser;
  onCreateRoom: (newRoom: EnglishRoom) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateRoom,
  onShowToast,
}) => {
  const [title, setTitle] = useState<string>('');
  const [level, setLevel] = useState<EnglishLevel>('intermediate');
  const [topic, setTopic] = useState<string>('');
  const [vocabInitial, setVocabInitial] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) return;

    const levelLabels: Record<EnglishLevel, string> = {
      newbie: '🌱 Mất Gốc / Nhập Môn (A1-A2)',
      intermediate: '🌿 Biết Một Chút / Giao Tiếp (B1-B2)',
      advance: '🌳 Chuyên Sâu / IELTS (C1-C2)',
    };

    const initialVocabArray = vocabInitial
      ? vocabInitial.split(',').map((w) => w.trim()).filter(Boolean)
      : ['Pronunciation: Phát âm', 'Vocabulary: Từ vựng'];

    const newRoom: EnglishRoom = {
      id: `room-${Date.now()}`,
      title: title.trim(),
      level,
      levelLabel: levelLabels[level],
      leaderId: currentUser.id,
      leaderName: currentUser.name,
      leaderAvatar: currentUser.avatarText,
      topic: topic.trim(),
      code: `#ENG-${Math.floor(100 + Math.random() * 900)}`,
      membersCount: 1,
      maxMembers: 20,
      isLive: true,
      scheduledTime: 'Vừa mở phòng trực tiếp',
      activeAvatars: [currentUser.avatarText],
      vocabList: initialVocabArray,
    };

    onCreateRoom(newRoom);
    onShowToast(`Leader đã mở phòng học "${newRoom.title}" thành công!`, 'emerald');
    setTitle('');
    setTopic('');
    setVocabInitial('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-2 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Leader / Cô Giáo Mở Phòng Luyện Nói</h3>
            <p className="text-xs text-slate-400">
              Host chủ trì: <strong className="text-amber-300">{currentUser.name}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Tên phòng học & mục tiêu:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Luyện phản xạ chủ đề du lịch, Mock Test Part 2..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Phân khu cấp độ tiếng Anh:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as EnglishLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="newbie">🌱 Khu Newbie (Mất gốc / Nhập môn A1-A2)</option>
              <option value="intermediate">🌿 Khu Intermediate (Biết một chút / B1-B2)</option>
              <option value="advance">🌳 Khu Advance (Chuyên sâu / IELTS 7.0+ C1-C2)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Chủ đề thảo luận trong buổi:</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Thảo luận về văn hóa du lịch và ẩm thực bản địa..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">
              Từ vựng chuẩn bị trước cho cả lớp (cách nhau bằng dấu phẩy):
            </label>
            <input
              type="text"
              value={vocabInitial}
              onChange={(e) => setVocabInitial(e.target.value)}
              placeholder="VD: Breathtaking: Đẹp, Local delicacy: Đặc sản..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mở Phòng Trực Tiếp Ngay Bây Giờ</span>
          </button>
        </form>
      </div>
    </div>
  );
};
