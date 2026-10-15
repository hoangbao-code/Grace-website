import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { StudyRoom } from '../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (newRoom: StudyRoom) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onShowToast,
}) => {
  const [title, setTitle] = useState<string>('');
  const [tag, setTag] = useState<'silent' | 'tech' | 'language' | 'vip' | 'general'>('tech');
  const [pomoTime, setPomoTime] = useState<string>('50');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagLabels: Record<string, string> = {
      silent: 'Im lặng',
      tech: 'Lập trình',
      language: 'Ngoại ngữ',
      vip: 'VIP Lounge',
      general: 'Tự do',
    };

    const newRoom: StudyRoom = {
      id: `room-${Date.now()}`,
      title: title.trim(),
      tag,
      tagLabel: tagLabels[tag] || 'Học tập',
      code: `#MST-${Math.floor(1000 + Math.random() * 9000)}`,
      membersCount: 1,
      maxMembers: 20,
      activeAvatars: ['GB'],
      currentPomodoro: `${pomoTime}:00 (Mới tạo)`,
    };

    onCreateRoom(newRoom);
    onShowToast(`Phòng "${newRoom.title}" đã được tạo thành công!`, 'emerald');
    setTitle('');
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Tạo Phòng Học Trực Tiếp Mới</h3>
            <p className="text-xs text-slate-400">Thiết lập không gian học tập cùng đồng đội.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Tên phòng học:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cày Đồ Án Cuối Kỳ, Luyện Thuật Toán..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Chủ đề phòng:</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value as 'silent' | 'tech' | 'language' | 'vip' | 'general')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="tech">💻 Lập trình & Công nghệ</option>
              <option value="silent">🤫 Phòng im lặng tuyệt đối (Deep Work)</option>
              <option value="language">🗣️ Luyện Ngoại Ngữ & Giao tiếp</option>
              <option value="general">☕ Tự do & Thư giãn</option>
              <option value="vip">👑 VIP Dragon Lounge</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Thời lượng Pomodoro mặc định:</label>
            <select
              value={pomoTime}
              onChange={(e) => setPomoTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="50">50 Phút tập trung + 10 Phút nghỉ (Chuẩn Deep Work)</option>
              <option value="25">25 Phút tập trung + 5 Phút nghỉ (Pomodoro cổ điển)</option>
              <option value="90">90 Phút tập trung (Chu kỳ Ultradian)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Xác nhận mở phòng học ngay</span>
          </button>
        </form>
      </div>
    </div>
  );
};
