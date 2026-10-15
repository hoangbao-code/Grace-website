import React, { useState } from 'react';
import {
  Video,
  PlusCircle,
  BookOpen,
  ArrowRight,
  Flame,
  Clock,
  Trophy,
  Award,
  Sparkles,
  Coffee,
  Zap,
} from 'lucide-react';
import { ClubUser, EnglishLevel, EnglishRoom } from '../types';
import { LEADERBOARD_TOP_USERS } from '../data/mockData';

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

  const loungeRoom = rooms.find((r) => r.id === 'room-lounge-247') || rooms[0];

  const userExp =
    currentUser.role === 'admin'
      ? 2980
      : currentUser.role === 'leader'
      ? 3450
      : 1250;

  const userBadge =
    userExp >= 3000
      ? 'Master of Fluency 👑'
      : userExp >= 2500
      ? 'Confident Speaker 🌟'
      : userExp >= 1000
      ? 'Explorer 🚀'
      : 'Seedling 🌱';

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-8">
      {/* English Club Welcome Banner */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-indigo-500/30 shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span className="animate-pulse">✨</span>
              <span>FLUENTLY CLUB • KHÔNG GIAN LUYỆN NÓI TIẾNG ANH PHẢN XẠ THỜI GIAN THỰC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Chào mừng,{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                {currentUser.name}
              </span>
              ! 🎯
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn có thể tự do tham gia vào bất kỳ phòng học nào bên dưới do Cô giáo và các Leader điều phối,
              hoặc ghé thăm phòng <strong>Open Lounge 24/7</strong> để bật cam tự học và luyện phản xạ cùng bạn bè bất kỳ lúc nào!
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

        {/* Club Quick Summary Mini Cards with EXP Gamification */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Cấp bậc & Danh hiệu</span>
            <p className="text-sm font-bold text-amber-300 mt-1 truncate">
              {userBadge}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              ⭐ {userExp.toLocaleString()} EXP
            </span>
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

      {/* FEATURE 6: FLUENTLY OPEN LOUNGE 24/7 HERO BANNER */}
      {loungeRoom && (
        <section className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-cyan-950/70 border border-purple-500/40 shadow-2xl group transition-all">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>☕ KHÔNG GIAN TỰ HỌC 24/7 • STUDY WITH ME</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                  Không Cần Chờ Giáo Viên
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                ☕ Fluently Open Lounge 24/7 — Phòng Luyện Nói & Tự Học Tự Do
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Nơi bạn có thể tự do vào bật camera tự học bài, ghép cặp luyện nói tiếng Anh phản xạ tự nhiên (Small Talk / Ice-breaking)
                và kết nối với bạn bè trong câu lạc bộ suốt 24 giờ mỗi ngày!
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <strong className="text-white">14 bạn</strong> đang tự học & luyện nói
                </span>
                <span>•</span>
                <span className="text-purple-300">Phản xạ tự nhiên & không áp lực</span>
              </div>
            </div>

            <button
              onClick={() => onJoinRoom(loungeRoom)}
              className="w-full lg:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 flex-shrink-0"
            >
              <Coffee className="w-4 h-4" />
              <span>Vào Open Lounge 24/7 Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* FEATURE 4: BẢNG VÀNG VINH DANH TUẦN (WEEKLY FLUENCY STARS & GAMIFICATION) */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Bảng Vàng Vinh Danh Tuần • Weekly Fluency Stars
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Vinh danh Top 3 thành viên tích cực mở mic luyện nói & tham gia sinh hoạt sôi nổi nhất tuần.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Cập nhật bảng xếp hạng hàng tuần</span>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LEADERBOARD_TOP_USERS.map((user) => (
            <div
              key={user.rank}
              className={`p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-4 border transition-all hover:-translate-y-1 ${
                user.rank === 1
                  ? 'bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950 border-amber-500/60 shadow-xl shadow-amber-500/15'
                  : user.rank === 2
                  ? 'bg-gradient-to-b from-slate-800/50 via-slate-900/90 to-slate-950 border-slate-400/50 shadow-lg'
                  : 'bg-gradient-to-b from-amber-900/20 via-slate-900/90 to-slate-950 border-amber-700/50 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Rank Badge */}
                <span
                  className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shadow-lg ${
                    user.rank === 1
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-amber-400/30'
                      : user.rank === 2
                      ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950 shadow-slate-300/30'
                      : 'bg-gradient-to-tr from-amber-700 to-orange-600 text-white shadow-amber-700/30'
                  }`}
                >
                  {user.rank === 1 ? '🥇 1' : user.rank === 2 ? '🥈 2' : '🥉 3'}
                </span>

                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-amber-300 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current text-amber-400" />
                  <span>{user.exp.toLocaleString()} EXP</span>
                </span>
              </div>

              {/* User Identity */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-500 p-0.5 shadow-md flex-shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-sm text-white">
                    {user.avatarText}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-white truncate">{user.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{user.roleTitle}</p>
                </div>
              </div>

              {/* Badge Rank Title */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Danh hiệu:</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold text-[11px]">
                  {user.badgeTitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Fluency Evolution Roadmap Strip */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Hệ Thống Tiến Hóa Danh Hiệu Fluently:</span>
          </span>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5">🌱 Seedling (&lt;1,000 EXP)</span>
            <span>➔</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">🚀 Explorer (1,000+)</span>
            <span>➔</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">🌟 Confident Speaker (2,500+)</span>
            <span>➔</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">👑 Master of Fluency (5,000+)</span>
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
