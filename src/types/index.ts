export interface UserProfile {
  name: string;
  avatarText: string;
  level: number;
  xp: number;
  maxXp: number;
  personalStreak: number;
  squadStreak: number;
  isPro: boolean;
  todayMinutes: number;
  goalMinutes: number;
}

export interface DayRecord {
  day: number;
  hours: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity for heatmap
  note?: string;
  completed: boolean;
  isToday?: boolean;
}

export interface SquadMember {
  id: string;
  name: string;
  avatarText: string;
  status: string;
  isOnline: boolean;
  streak: number;
  isSelf?: boolean;
  needsNudge?: boolean;
}

export interface StudyRoom {
  id: string;
  title: string;
  tag: 'silent' | 'tech' | 'language' | 'vip' | 'general';
  tagLabel: string;
  code: string;
  membersCount: number;
  maxMembers: number;
  isVip?: boolean;
  activeAvatars: string[];
  currentPomodoro?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatarText: string;
  bgColor: string;
  borderColor: string;
  isCamOn: boolean;
  isMuted: boolean;
  mood: string;
  statusText: string;
  isSelf?: boolean;
  isPro?: boolean;
  hasAudioWave?: boolean;
}

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  youtubeId: string;
  thumbnailUrl: string;
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
  size: number;
}
