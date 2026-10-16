export type UserRole = 'admin' | 'leader' | 'student';
export type EnglishLevel = 'newbie' | 'intermediate' | 'advance';
export type TuitionStatus = 'paid' | 'unpaid' | 'trial';

export interface ClubUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tuitionStatus: TuitionStatus;
  avatarText: string;
  phone?: string;
  joinDate: string;
  streakDays: number;
  lastStreakDate?: string;
}

export interface EnglishRoom {
  id: string;
  title: string;
  level: EnglishLevel;
  levelLabel: string;
  leaderId: string;
  leaderName: string;
  leaderAvatar: string;
  topic: string;
  code: string;
  membersCount: number;
  maxMembers: number;
  isLive: boolean;
  vocabList: string[];
  activeAvatars: string[];
  scheduledTime?: string;
}

export interface RoomParticipant {
  id: string;
  name: string;
  avatarText: string;
  role: UserRole;
  isCamOn: boolean;
  isMuted: boolean;
  isHandRaised: boolean;
}

export interface ChatMessage {
  id: number;
  sender: string;
  role?: UserRole;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface ToastMessage {
  id: number;
  text: string;
  type?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export interface LeaderboardUser {
  rank: 1 | 2 | 3 | number;
  name: string;
  avatarText: string;
  roleTitle: string;
  exp: number;
  badgeTitle: string;
  badgeLevel: 'Seedling' | 'Explorer' | 'Confident Speaker' | 'Master of Fluency';
  streakDays: number;
}
