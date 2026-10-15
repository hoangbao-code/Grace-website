import { ClubUser, EnglishRoom } from '../types';

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
  streakDays: 0,
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
  streakDays: 0,
};

// Official Staff only - Không có học viên ảo
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
    joinDate: '15/10/2026',
    streakDays: 0,
  },
];

// Web mới tinh - Hoàn toàn không mock phòng học sẵn
export const INITIAL_ROOMS: EnglishRoom[] = [];
