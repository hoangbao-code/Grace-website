import { DayRecord, MusicTrack, Participant, SquadMember, StudyRoom, TodoItem, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Hoàng Xuân Gia Bảo',
  avatarText: 'GB',
  level: 7,
  xp: 1420,
  maxXp: 2000,
  personalStreak: 18,
  squadStreak: 12,
  isPro: false,
  todayMinutes: 165, // 2h 45m
  goalMinutes: 240,  // 4h
};

export const INITIAL_SQUAD: SquadMember[] = [
  {
    id: 'squad-1',
    name: 'Hoàng Xuân Gia Bảo',
    avatarText: 'GB',
    status: 'Đang học WebRTC & Pomodoro',
    isOnline: true,
    streak: 18,
    isSelf: true,
  },
  {
    id: 'squad-2',
    name: 'Nguyễn Minh Trí',
    avatarText: 'MT',
    status: 'Luyện Graph & Dijkstra • Phòng 1',
    isOnline: true,
    streak: 15,
  },
  {
    id: 'squad-3',
    name: 'Lê Lan Anh',
    avatarText: 'LA',
    status: 'Giải lao 5 phút • Uống nước',
    isOnline: true,
    streak: 12,
  },
  {
    id: 'squad-4',
    name: 'Trần Quốc Huy',
    avatarText: 'QH',
    status: '⚠️ Chưa điểm danh hôm nay!',
    isOnline: false,
    streak: 8,
    needsNudge: true,
  },
];

export const INITIAL_ROOMS: StudyRoom[] = [
  {
    id: 'room-1',
    title: 'Thư viện đêm khuya • Deep Work',
    tag: 'silent',
    tagLabel: 'Im lặng',
    code: '#MST-8420',
    membersCount: 14,
    maxMembers: 25,
    activeAvatars: ['GB', 'MT', 'LA', 'QH', 'VN'],
    currentPomodoro: '48:20 (Ca tập trung)',
  },
  {
    id: 'room-2',
    title: 'Lập trình Frontend & Thuật toán',
    tag: 'tech',
    tagLabel: 'Lập trình',
    code: '#DEV-2048',
    membersCount: 8,
    maxMembers: 16,
    activeAvatars: ['JS', 'TS', 'PY', 'AI'],
    currentPomodoro: '25:00 (Nghỉ ngắn)',
  },
  {
    id: 'room-3',
    title: 'Luyện nghe IELTS 8.0 & Từ vựng C1',
    tag: 'language',
    tagLabel: 'Ngoại ngữ',
    code: '#ENG-9900',
    membersCount: 6,
    maxMembers: 12,
    activeAvatars: ['EN', 'UK', 'US'],
    currentPomodoro: '38:15 (Ca tập trung)',
  },
  {
    id: 'room-4',
    title: 'VIP Dragon Lounge • Đỉnh cao kỷ luật',
    tag: 'vip',
    tagLabel: 'VIP Lounge',
    code: '#VIP-7777',
    membersCount: 3,
    maxMembers: 6,
    isVip: true,
    activeAvatars: ['👑', '⚡', '🔥'],
    currentPomodoro: '50:00 (Bắt đầu)',
  },
  {
    id: 'room-5',
    title: 'Góc học bài Chill cùng Lofi Beats',
    tag: 'general',
    tagLabel: 'Chill & Relax',
    code: '#LOFI-101',
    membersCount: 12,
    maxMembers: 30,
    activeAvatars: ['☕', '🍃', '🎧'],
    currentPomodoro: '45:00 (Ca tập trung)',
  },
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'p-1',
    name: 'Hoàng Xuân Gia Bảo',
    avatarText: 'GB',
    bgColor: 'from-violet-600 to-indigo-600',
    borderColor: 'border-violet-500/40',
    isCamOn: false,
    isMuted: true,
    mood: '🎯 Tập trung cao độ',
    statusText: 'Đang code React 19',
    isSelf: true,
    hasAudioWave: true,
  },
  {
    id: 'p-2',
    name: 'Nguyễn Minh Trí',
    avatarText: 'MT',
    bgColor: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/30',
    isCamOn: false,
    isMuted: true,
    mood: '⚡ Cày LeetCode',
    statusText: 'Graph BFS/DFS',
  },
  {
    id: 'p-3',
    name: 'Lê Lan Anh',
    avatarText: 'LA',
    bgColor: 'from-pink-600 to-rose-600',
    borderColor: 'border-pink-500/30',
    isCamOn: false,
    isMuted: true,
    mood: '📖 Ôn thi cuối kỳ',
    statusText: 'Giải tích 2',
  },
  {
    id: 'p-4',
    name: 'Alexandre Dragon',
    avatarText: 'AD',
    bgColor: 'from-amber-600 to-purple-600',
    borderColor: 'border-amber-400',
    isCamOn: false,
    isMuted: true,
    mood: '👑 VIP Mastery',
    statusText: 'Research LLM',
    isPro: true,
  },
];

export const INITIAL_TODOS: TodoItem[] = [
  { id: 1, text: 'Hoàn thành 1 ca Pomodoro 50 phút', completed: true, createdAt: Date.now() - 3600000 },
  { id: 2, text: 'Đọc 10 trang tài liệu giải thuật chuyên sâu', completed: true, createdAt: Date.now() - 1800000 },
  { id: 3, text: 'Review lại 2 bài PR và refactor code', completed: false, createdAt: Date.now() },
  { id: 4, text: 'Ghi nhật ký phản tư ngày thứ 19', completed: false, createdAt: Date.now() },
];

export const INITIAL_HEATMAP_DAYS: DayRecord[] = Array.from({ length: 100 }, (_, i) => {
  const day = i + 1;
  const isDone = day < 19;
  const isToday = day === 19;
  let level: 0 | 1 | 2 | 3 | 4 = 0;

  if (isDone) {
    if (day % 4 === 0) level = 4; // 5-6 hours
    else if (day % 3 === 0) level = 3; // 3-4 hours
    else if (day % 2 === 0) level = 2; // 2-3 hours
    else level = 1; // 1-2 hours
  } else if (isToday) {
    level = 2;
  }

  const hours = isDone ? (2 + (day % 4) * 1.2) : isToday ? 2.75 : 0;
  return {
    day,
    hours: Math.round(hours * 10) / 10,
    level,
    completed: isDone,
    isToday,
  };
});

export const CURATED_MUSIC: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Lofi Girl — beats to relax/study to',
    artist: 'Lofi Records',
    duration: 'Live 24/7',
    category: 'lofi',
    youtubeId: 'jfKfPfyJRdk',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
  },
  {
    id: 'track-2',
    title: 'Chúng Ta Của Tương Lai (Lofi Chill)',
    artist: 'Sơn Tùng M-TP',
    duration: '4:15',
    category: 'vietnamese',
    youtubeId: 'zoEtcR5EW08',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
  },
  {
    id: 'track-3',
    title: 'Nấu Ăn Cho Em (Acoustic Study)',
    artist: 'Đen Vâu ft. PiaLinh',
    duration: '3:45',
    category: 'vietnamese',
    youtubeId: '4BFlLwF_344',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  },
  {
    id: 'track-4',
    title: 'Synthwave Cyberpunk — Coding Night',
    artist: 'ChillWave Radio',
    duration: 'Live 24/7',
    category: 'synthwave',
    youtubeId: '4xDzrJKXOOY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  },
  {
    id: 'track-5',
    title: 'Studio Ghibli Relaxing Piano',
    artist: 'Joe Hisaishi Cover',
    duration: '3:10:00',
    category: 'anime',
    youtubeId: '1FueZCtJTuA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  },
  {
    id: 'track-6',
    title: 'Brown Noise Deep Sleep & Ultra Focus',
    artist: 'NeuroSound Studio',
    duration: '8:00:00',
    category: 'noise',
    youtubeId: 'RqzGzwTY-6w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80',
  },
];
