import { ClubUser, EnglishRoom, LeaderboardUser } from '../types';

export const ADMIN_EMAILS = [
  'dinhthilieu001011969@gmail.com',
  'hoangbao.code@gmail.com',
  'giabao.admin@graceclub.edu.vn',
];

export const INITIAL_ADMIN_USER: ClubUser = {
  id: 'user-admin',
  name: 'Hoàng Xuân Gia Bảo',
  email: 'dinhthilieu001011969@gmail.com',
  role: 'admin',
  tuitionStatus: 'paid',
  avatarText: 'GB',
  phone: '0354084364',
  joinDate: '15/10/2026',
  streakDays: 19,
};

// Default visitor state
export const DEFAULT_GUEST_USER: ClubUser = {
  id: 'guest-user',
  name: 'Khách Tham Quan',
  email: 'khach@graceclub.edu.vn',
  role: 'student',
  tuitionStatus: 'trial',
  avatarText: 'K',
  joinDate: 'Hôm nay',
  streakDays: 1,
};

// Official Staff only - Zero test users
export const INITIAL_USERS: ClubUser[] = [
  INITIAL_ADMIN_USER,
  {
    id: 'user-leader-1',
    name: 'Cô Hoàng Lan Anh',
    email: 'lananh.teacher@graceclub.edu.vn',
    role: 'leader',
    tuitionStatus: 'paid',
    avatarText: 'LA',
    phone: '0912345678',
    joinDate: '10/10/2026',
    streakDays: 32,
  },
];

// Official Rooms only - Zero test/mock rooms
export const INITIAL_ROOMS: EnglishRoom[] = [
  // 1. PHÂN CẤP PHÒNG: NEWBIE (A1-A2)
  {
    id: 'room-nb-1',
    title: 'Phát âm chuẩn 44 âm IPA & Ngữ điệu tự nhiên',
    level: 'newbie',
    levelLabel: '🌱 Cấp Độ Newbie (A1-A2)',
    leaderId: 'user-leader-1',
    leaderName: 'Cô Hoàng Lan Anh',
    leaderAvatar: 'LA',
    topic: 'Luyện cặp âm khó /i:/ vs /ɪ/, /θ/ vs /ð/ & Kỹ thuật nối âm',
    code: '#ENG-NB101',
    membersCount: 8,
    maxMembers: 20,
    isLive: true,
    scheduledTime: 'Đang diễn ra trực tiếp',
    activeAvatars: ['LA', 'GB'],
    vocabList: [
      'Pronunciation /prəˌnʌn.siˈeɪ.ʃən/: Phát âm',
      'Vowel /ˈvaʊ.əl/: Nguyên âm',
      'Consonant /ˈkɒn.sə.nənt/: Phụ âm',
      'Intonation /ˌɪn.təˈneɪ.ʃən/: Ngữ điệu câu',
    ],
  },
  {
    id: 'room-nb-2',
    title: 'Từ vựng & Mẫu câu phản xạ Giao Tiếp Đời Sống',
    level: 'newbie',
    levelLabel: '🌱 Cấp Độ Newbie (A1-A2)',
    leaderId: 'user-leader-1',
    leaderName: 'Cô Hoàng Lan Anh',
    leaderAvatar: 'LA',
    topic: 'Cách gọi món tại nhà hàng, hỏi đường và mua sắm cơ bản',
    code: '#ENG-NB102',
    membersCount: 5,
    maxMembers: 15,
    isLive: false,
    scheduledTime: '20:00 Tối nay',
    activeAvatars: ['LA'],
    vocabList: [
      'Order /ˈɔː.dər/: Đặt món',
      'Receipt /rɪˈsiːt/: Hóa đơn',
      'Where is the nearest station?: Ga gần nhất ở đâu?',
    ],
  },

  // 2. PHÂN CẤP PHÒNG: INTERMEDIATE (B1-B2)
  {
    id: 'room-it-1',
    title: 'Daily Topic Talk: "Travel Experiences & Dream Destinations"',
    level: 'intermediate',
    levelLabel: '🌿 Cấp Độ Intermediate (B1-B2)',
    leaderId: 'user-leader-1',
    leaderName: 'Cô Hoàng Lan Anh',
    leaderAvatar: 'LA',
    topic: 'Thảo luận chia sẻ chuyến đi đáng nhớ nhất & Trải nghiệm giao thoa văn hóa',
    code: '#ENG-IT201',
    membersCount: 12,
    maxMembers: 25,
    isLive: true,
    scheduledTime: 'Đang diễn ra trực tiếp',
    activeAvatars: ['GB', 'LA'],
    vocabList: [
      'Breathtaking /ˈbreθˌteɪ.kɪŋ/: Đẹp ngoạn mục',
      'Local delicacy /ˈdel.ɪ.kə.si/: Đặc sản địa phương',
      'Culture shock: Sốc văn hóa',
      'Off the beaten track: Nơi hoang sơ ít người biết',
    ],
  },

  // 3. PHÂN CẤP PHÒNG: ADVANCE (C1-C2)
  {
    id: 'room-ad-1',
    title: 'Luyện Nói IELTS Speaking 7.5+ & Tranh Biện Học Thuật',
    level: 'advance',
    levelLabel: '🌳 Cấp Độ Advance (C1-C2)',
    leaderId: 'user-admin',
    leaderName: 'Hoàng Xuân Gia Bảo (Admin)',
    leaderAvatar: 'GB',
    topic: 'Chủ đề tranh biện: "Will Artificial Intelligence replace human educators?"',
    code: '#ENG-AD301',
    membersCount: 7,
    maxMembers: 12,
    isLive: true,
    scheduledTime: 'Đang diễn ra trực tiếp',
    activeAvatars: ['GB', 'LA'],
    vocabList: [
      'Indispensable /ˌɪn.dɪˈspen.sə.bəl/: Không thể thiếu',
      'Paradigm shift: Bước ngoặt tư duy',
      'Empathetic connection: Sự kết nối thấu cảm',
      'Counter-argument: Luận điểm phản bác',
    ],
  },

  // 4. KHÔNG GIAN TỰ HỌC & LUYỆN NÓI TỰ DO 24/7 (STUDY WITH ME & ICE-BREAKING)
  {
    id: 'room-lounge-247',
    title: '☕ Fluently Open Lounge 24/7 — Phòng Tự Học & Luyện Nói Tự Do (Study With Me)',
    level: 'intermediate',
    levelLabel: '☕ Open Lounge 24/7 (Tự Do)',
    leaderId: 'system-bot',
    leaderName: 'Fluently Lounge Host (Tự Động 24/7)',
    leaderAvatar: '☕',
    topic: 'Không gian mở 24/7: Bật camera tự học bài, ghép cặp luyện nói tiếng Anh tự do, ice-breaking kết bạn không cần giáo viên!',
    code: '#LOUNGE-247',
    membersCount: 14,
    maxMembers: 50,
    isLive: true,
    scheduledTime: 'Mở cửa 24/7 liên tục',
    activeAvatars: ['GB', 'LA', 'TU', 'MI'],
    vocabList: [
      'Ice-breaker: Câu chuyện bắt đầu làm quen',
      'What are you working on today?: Hôm nay bạn đang làm bài gì thế?',
      'Care for a 10-minute quick talk?: Bạn có muốn trò chuyện nhanh 10 phút không?',
      'Practice makes perfect: Luyện tập tạo nên sự hoàn hảo',
    ],
  },
];

// BẢNG VÀNG VINH DANH TUẦN (WEEKLY FLUENCY STARS)
export const LEADERBOARD_TOP_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Cô Hoàng Lan Anh',
    avatarText: 'LA',
    roleTitle: 'Leader CLB / Giảng viên',
    exp: 3450,
    badgeTitle: 'Bậc Thầy Giao Tiếp',
    badgeLevel: 'Master of Fluency',
    streakDays: 32,
  },
  {
    rank: 2,
    name: 'Hoàng Xuân Gia Bảo',
    avatarText: 'GB',
    roleTitle: 'Admin & Founder',
    exp: 2980,
    badgeTitle: 'Người Nói Tự Tin',
    badgeLevel: 'Confident Speaker',
    streakDays: 19,
  },
  {
    rank: 3,
    name: 'Nguyễn Minh Tuấn',
    avatarText: 'MT',
    roleTitle: 'Học viên Tích Cực',
    exp: 2150,
    badgeTitle: 'Chiến Thần Khám Phá',
    badgeLevel: 'Explorer',
    streakDays: 14,
  },
];
