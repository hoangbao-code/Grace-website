import React, { useState } from 'react';
import {
  Play,
  PlusCircle,
  Edit3,
  Search,
  Sliders,
  Maximize2,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  X,
  Link as LinkIcon,
} from 'lucide-react';
import { DayRecord, MusicTrack, SquadMember, StudyRoom, UserProfile } from '../types';

interface LobbyViewProps {
  user: UserProfile;
  heatmapDays: DayRecord[];
  squadMembers: SquadMember[];
  rooms: StudyRoom[];
  musicTracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  masterVolume: number;
  onSetMasterVolume: (vol: number) => void;
  onJoinRoom: (room: StudyRoom) => void;
  onCreateRoomModal: () => void;
  onOpenJournalModal: (day: number) => void;
  onOpenAudioHub: () => void;
  onPokeMember: (member: SquadMember) => void;
  onPlayTrack: (track: MusicTrack) => void;
  onTriggerConfetti: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  user,
  heatmapDays,
  squadMembers,
  rooms,
  musicTracks,
  currentTrack,
  masterVolume,
  onSetMasterVolume,
  onJoinRoom,
  onCreateRoomModal,
  onOpenJournalModal,
  onOpenAudioHub,
  onPokeMember,
  onPlayTrack,
  onTriggerConfetti,
}) => {
  const [roomFilter, setRoomFilter] = useState<'all' | 'silent' | 'tech' | 'language' | 'vip'>('all');
  const [musicCategoryFilter, setMusicCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(masterVolume);

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    if (roomFilter === 'all') return true;
    return r.tag === roomFilter;
  });

  // Filtered music
  const filteredMusic = musicTracks.filter((track) => {
    const matchCategory = musicCategoryFilter === 'all' || track.category === musicCategoryFilter;
    const matchSearch =
      !searchQuery ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onSetMasterVolume(prevVolume || 80);
    } else {
      setPrevVolume(masterVolume);
      setIsMuted(true);
      onSetMasterVolume(0);
    }
  };

  const getHeatmapColor = (level: number, isToday?: boolean) => {
    if (isToday) return 'bg-cyan-400 ring-2 ring-cyan-300 animate-pulse';
    switch (level) {
      case 4:
        return 'bg-emerald-400 shadow-sm shadow-emerald-400/50';
      case 3:
        return 'bg-emerald-600 border border-emerald-400/50';
      case 2:
        return 'bg-emerald-800 border border-emerald-600/40';
      case 1:
        return 'bg-emerald-950 border border-emerald-800/40';
      default:
        return 'bg-slate-900 border border-white/5';
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-8">
      {/* Welcome Hero Banner */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
              <span className="animate-pulse">✨</span>
              <span>Chiến dịch Thử thách 100 Ngày Khổ Luyện • Ngày thứ 19</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Chào buổi sáng,{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                {user.name}
              </span>
              ! 🎯
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bạn đã học <span className="text-emerald-400 font-semibold">2h 45m</span> hôm nay. Chỉ còn 1 ca Pomodoro
              nữa để hoàn thành mục tiêu 4 giờ và giữ chuỗi 19 ngày liên tiếp!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => rooms[0] && onJoinRoom(rooms[0])}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Vào ca học ngay</span>
            </button>
            <button
              onClick={onCreateRoomModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-button text-slate-200 hover:text-white font-semibold text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>+ Tạo phòng mới</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Thời gian học hôm nay</span>
            <p className="text-base font-bold text-white mt-1">
              2h 45m <span className="text-[10px] text-emerald-400 font-normal">/ 4h</span>
            </p>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Tỷ lệ hoàn thành</span>
            <p className="text-base font-bold text-emerald-400 mt-1">
              68.7% <span className="text-[10px] text-slate-400 font-normal">(Sắp đạt)</span>
            </p>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Xếp hạng Biệt đội</span>
            <p className="text-base font-bold text-amber-300 mt-1">
              Top 3% <span className="text-[10px] text-slate-400 font-normal">tuần này</span>
            </p>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400">Hệ số nhân XP</span>
            <p className="text-base font-bold text-purple-400 mt-1">
              x1.5 Boost <span className="text-[10px] text-emerald-400 font-normal">Squad On</span>
            </p>
          </div>
        </div>
      </section>

      {/* BENTO GRID SECTION: Heatmap + Squad Accountability */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BENTO CARD 1: 10x10 Heatmap Grid */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-white">
                    Bản Đồ 100 Ngày Khổ Luyện (10x10 Heatmap)
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    18/100 Ngày
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nhấp vào từng ô để xem chi tiết giờ học hoặc ghi nhật ký phản tư.
                </p>
              </div>

              {/* Legend */}
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>Ít</span>
                <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-white/5"></span>
                <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800/40"></span>
                <span className="w-2.5 h-2.5 rounded bg-emerald-800 border border-emerald-600/50"></span>
                <span className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-400/60"></span>
                <span className="w-2.5 h-2.5 rounded bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                <span>Nhiều</span>
              </div>
            </div>

            {/* The 10x10 Grid */}
            <div className="grid grid-cols-10 gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/5 my-2">
              {heatmapDays.map((d) => (
                <div
                  key={d.day}
                  onClick={() => onOpenJournalModal(d.day)}
                  className={`heatmap-cell aspect-square rounded-md flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all ${getHeatmapColor(
                    d.level,
                    d.isToday
                  )} ${d.isToday ? 'text-slate-950 font-extrabold' : 'text-slate-300 hover:text-white'}`}
                  title={`Ngày ${d.day}: ${d.hours > 0 ? `${d.hours}h học` : 'Chưa học'} - Nhấp để xem nhật ký`}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30"></span>
              <span>
                Ô nhấp nháy <strong className="text-cyan-300">Ngày 19</strong>: Đang diễn ra hôm nay
              </span>
            </div>
            <button
              onClick={() => onOpenJournalModal(19)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Viết nhật ký hôm nay</span>
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: Squad Accountability */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Biệt Đội "Cày Xuyên Đêm"</h3>
                  <p className="text-[11px] text-indigo-300 font-medium">Chuỗi đồng đội: 12 ngày liên tục</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                4/4 Thành viên
              </span>
            </div>

            {/* Squad Members List */}
            <div className="space-y-3">
              {squadMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    member.needsNudge
                      ? 'bg-slate-900/50 border-amber-500/20 hover:border-amber-500/40'
                      : 'bg-slate-900/50 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-white">
                        {member.avatarText}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-slate-950 ${
                          member.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                      ></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{member.name}</span>
                        {member.isSelf && (
                          <span className="text-[10px] text-indigo-400 font-semibold">(Bạn)</span>
                        )}
                      </div>
                      <p
                        className={`text-[10px] ${
                          member.needsNudge
                            ? 'text-rose-400 font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        {member.status}
                      </p>
                    </div>
                  </div>

                  {member.isSelf ? (
                    <span className="text-[11px] font-bold text-orange-400 flex items-center gap-0.5">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {member.streak}
                    </span>
                  ) : member.needsNudge ? (
                    <button
                      onClick={() => onPokeMember(member)}
                      className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-[11px] font-bold text-rose-300 animate-bounce transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                      title="Báo thức đồng đội"
                    >
                      <span>🚨</span>
                      <span>Gọi dậy</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onPokeMember(member)}
                      className="px-2 py-1 rounded-lg bg-violet-500/15 hover:bg-violet-500/30 border border-violet-500/30 text-[11px] font-semibold text-violet-300 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                      title="Nhắc nhở học tập"
                    >
                      <span>👋</span>
                      <span>Réo</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Quy tắc: Cả 4 cùng điểm danh = x1.5 XP</span>
            <button
              onClick={onTriggerConfetti}
              className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>🎉 Cổ vũ đội</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOCUS MUSIC & SPOTIFY/YOUTUBE DISCOVERY SECTION */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-indigo-500/30 shadow-2xl space-y-6">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
              <span className="animate-pulse">🎧</span>
              <span>TRẠM CHỌN NHẠC TẬP TRUNG • YOUTUBE & SPOTIFY ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>🎵 Chọn & Tìm Kiếm Âm Nhạc Học Tập</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                LIVE SEARCH
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Tìm kiếm <strong>bất kỳ bài hát hoặc ca sĩ</strong> bạn yêu thích, phát video kèm hòa âm sóng Alpha 10Hz và tiếng mưa rơi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Master Volume */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-white/10 shadow-inner">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Bật/Tắt tiếng loa"
              >
                {isMuted || masterVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => {
                  setIsMuted(false);
                  onSetMasterVolume(Number(e.target.value));
                }}
                className="w-20 sm:w-24 accent-indigo-500 h-1.5 bg-slate-800 rounded cursor-pointer"
                title="Âm lượng hệ thống"
              />
              <span className="text-xs font-mono font-bold text-slate-200 w-8 text-right">
                {isMuted ? 0 : masterVolume}%
              </span>
            </div>

            <button
              onClick={onOpenAudioHub}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-emerald-300" />
              <span>Mở Trạm Hòa Âm Chi Tiết (Mixer)</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Chips */}
        <div className="space-y-3 bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl relative z-10">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Gõ bài hát hoặc ca sĩ (VD: Sơn Tùng, Đen Vâu, Vũ, Lofi Chill, Adele, EDM, Nhạc Tết...)"
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (filteredMusic[0]) onPlayTrack(filteredMusic[0]);
                }}
                className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Phát ngay</span>
              </button>
              <button
                onClick={onOpenAudioHub}
                className="px-3.5 py-3 rounded-xl glass-button text-slate-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <LinkIcon className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">Dán link YouTube</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap">Gợi ý nhanh:</span>
            {[
              { id: 'all', label: '✨ Tất cả' },
              { id: 'lofi', label: '☕ Lofi 24/7' },
              { id: 'vietnamese', label: '🎶 Nhạc Việt Chill' },
              { id: 'synthwave', label: '⚡ Synthwave' },
              { id: 'anime', label: '🍃 Ghibli Piano' },
              { id: 'noise', label: '🎧 Brown Noise' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setMusicCategoryFilter(chip.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  musicCategoryFilter === chip.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Now Playing Strip */}
        {currentTrack && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-slate-900/80 border border-indigo-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-white/10 relative">
                <img
                  src={currentTrack.thumbnailUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span>ĐANG PHÁT TRỰC TIẾP</span>
                </span>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {currentTrack.title} — {currentTrack.artist}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAudioHub}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-all shadow-md cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Xem Trình Phát</span>
            </button>
          </div>
        )}

        {/* Music Track Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMusic.map((track) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track)}
              className="glass-card p-3 rounded-2xl flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 relative border border-white/10">
                <img
                  src={track.thumbnailUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 text-white fill-current" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {track.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 mt-1 inline-block">
                  {track.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE STUDY ROOMS DIRECTORY SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Phòng Học Trực Tiếp Đang Mở</h2>
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>28 người đang học</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bật webcam hoặc dùng Avatar 2D, nghe âm thanh tập trung Web Audio và cùng giữ chuỗi.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-medium">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'silent', label: '🤫 Im lặng' },
              { id: 'tech', label: '💻 Lập trình' },
              { id: 'language', label: '🗣️ Ngoại ngữ' },
              { id: 'vip', label: '👑 VIP Lounge' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setRoomFilter(chip.id as 'all' | 'silent' | 'tech' | 'language' | 'vip')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  roomFilter === chip.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className={`glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all hover:-translate-y-1 ${
                room.isVip ? 'pro-rainbow-glow border border-amber-500/40' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                      room.isVip
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {room.tagLabel}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{room.code}</span>
                </div>
                <h3 className="text-base font-bold text-white">{room.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{room.currentPomodoro || '48:20 (Ca tập trung)'}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
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
                    {room.membersCount}/{room.maxMembers}
                  </span>
                </div>

                <button
                  onClick={() => onJoinRoom(room)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <span>Tham gia</span>
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
