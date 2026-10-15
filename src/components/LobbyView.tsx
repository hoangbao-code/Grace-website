import React, { useState } from 'react';
import {
  Video,
  PlusCircle,
  BookOpen,
  ArrowRight,
  Flame,
  Clock,
} from 'lucide-react';
import { ClubUser, EnglishLevel, EnglishRoom } from '../types';

interface LobbyViewProps {
  currentUser: ClubUser;
  rooms: EnglishRoom[];
  onJoinRoom: (room: EnglishRoom) => void;
  onCreateRoomModal: () => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber' | 'rose') => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  currentUser,
  rooms,
  onJoinRoom,
  onCreateRoomModal,
  onShowToast,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | 'all'>('all');

  const filteredRooms = rooms.filter((r) => {
    if (selectedLevel === 'all') return true;
    return r.level === selectedLevel;
  });

  const handleCreateRoomClick = () => {
    if (currentUser.role === 'student') {
      onShowToast(
        'Quyền hạn bị giới hạn: Chỉ có Leader (Cô giáo / Chủ nhiệm CLB) mới có quyền mở phòng học cho lớp!',
        'amber'
      );
      return;
    }
    onCreateRoomModal();
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-8">
      {/* English Club Welcome Banner */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-indigo-500/30 shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span className="animate-pulse">✨</span>
              <span>GRACESPEAK CLUB • KHÔNG GIAN LUYỆN NÓI TIẾNG ANH PHẢN XẠ THỜI GIAN THỰC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Chào mừng,{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                {currentUser.name}
              </span>
              ! 🎯
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn có thể tự do tham gia vào bất kỳ phòng học nào bên dưới do Cô giáo và các Leader điều phối.
              Mỗi phòng đều có chủ đề phản xạ và từ vựng riêng biệt.
            </p>
          </div>

          {/* Action: Open Room button (Strictly for Leader/Admin) */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {currentUser.role !== 'student' ? (
              <button
                onClick={onCreateRoomModal}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>+ Leader Mở Phòng Mới</span>
              </button>
            ) : (
              <button
                onClick={handleCreateRoomClick}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl glass-button text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
                title="Chỉ Leader mới có quyền mở phòng"
              >
                <PlusCircle className="w-4 h-4 text-slate-500" />
                <span>Leader Mở Phòng (Khóa với học viên)</span>
              </button>
            )}

            {filteredRooms[0] && (
              <button
                onClick={() => onJoinRoom(filteredRooms[0])}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>Vào Phòng Học Nhanh</span>
              </button>
            )}
          </div>
        </div>

        {/* Club Quick Summary Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Trạng thái tài khoản</span>
            <p className="text-base font-bold text-white mt-1 uppercase">
              {currentUser.role === 'admin'
                ? '👑 Quản Trị Viên'
                : currentUser.role === 'leader'
                ? '⭐ Leader / Host'
                : '🎓 Học Viên CLB'}
            </p>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Học phí CLB</span>
            <p className="text-base font-bold text-emerald-400 mt-1">
              {currentUser.tuitionStatus === 'paid'
                ? 'Đã Hoàn Thành'
                : currentUser.tuitionStatus === 'trial'
                ? 'Dùng Thử 3 Ngày'
                : 'Chưa Đóng Phí'}
            </p>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Phòng học đang mở</span>
            <p className="text-base font-bold text-amber-300 mt-1">
              {rooms.filter((r) => r.isLive).length} phòng trực tiếp
            </p>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Chuỗi sinh hoạt CLB</span>
            <p className="text-base font-bold text-orange-400 mt-1 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>{currentUser.streakDays} ngày liên tiếp</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3 LEVEL ZONES TABS HEADER */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Phân Cấp Phòng Theo Cấp Độ</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                {rooms.length} phòng học
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bạn có thể tự do bấm chọn bất kỳ phòng học nào phù hợp với trình độ và nhu cầu của bạn.
            </p>
          </div>

          {/* 3 Level Filter Buttons */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                selectedLevel === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              Tất cả phòng ({rooms.length})
            </button>
            <button
              onClick={() => setSelectedLevel('newbie')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedLevel === 'newbie'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-emerald-400 hover:text-white border border-emerald-500/30'
              }`}
            >
              <span>🌱</span>
              <span>Phòng Newbie (A1-A2)</span>
            </button>
            <button
              onClick={() => setSelectedLevel('intermediate')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedLevel === 'intermediate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-blue-400 hover:text-white border border-blue-500/30'
              }`}
            >
              <span>🌿</span>
              <span>Phòng Intermediate (B1-B2)</span>
            </button>
            <button
              onClick={() => setSelectedLevel('advance')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedLevel === 'advance'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-purple-400 hover:text-white border border-purple-500/30'
              }`}
            >
              <span>🌳</span>
              <span>Phòng Advance (C1-C2)</span>
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-4 border border-white/10 hover:border-indigo-500/40 transition-all hover:-translate-y-1 relative overflow-hidden group shadow-xl"
            >
              <div className="space-y-3">
                {/* Level badge & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold border uppercase ${
                      room.level === 'newbie'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : room.level === 'intermediate'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {room.levelLabel}
                  </span>

                  {room.isLive ? (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Đang diễn ra</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{room.scheduledTime || 'Sắp bắt đầu'}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {room.title}
                </h3>

                {/* Host Leader Information */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                    {room.leaderAvatar}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Leader Chủ Trì (Host):
                    </span>
                    <p className="text-xs font-semibold text-slate-200 truncate">{room.leaderName}</p>
                  </div>
                </div>

                {/* Topic of the session */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-400" />
                    <span>Chủ đề thảo luận hôm nay:</span>
                  </span>
                  <p className="text-xs text-slate-300 italic bg-black/30 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                    "{room.topic}"
                  </p>
                </div>
              </div>

              {/* Footer: Member avatars & Join button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  {room.activeAvatars.map((av, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300"
                    >
                      {av}
                    </div>
                  ))}
                  <span className="text-[10px] text-slate-400 pl-3">
                    {room.membersCount}/{room.maxMembers} bạn
                  </span>
                </div>

                <button
                  onClick={() => onJoinRoom(room)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
                >
                  <span>Vào Lớp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
