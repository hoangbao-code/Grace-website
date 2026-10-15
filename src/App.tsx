import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { LobbyView } from './components/LobbyView';
import { RoomView } from './components/RoomView';
import { AudioHubModal } from './components/AudioHubModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { JournalModal } from './components/JournalModal';
import { FloatingEmojiOverlay } from './components/FloatingEmojiOverlay';
import { ToastContainer } from './components/ToastContainer';
import {
  CURATED_MUSIC,
  INITIAL_HEATMAP_DAYS,
  INITIAL_PARTICIPANTS,
  INITIAL_ROOMS,
  INITIAL_SQUAD,
  INITIAL_TODOS,
  INITIAL_USER,
} from './data/mockData';
import {
  ChatMessage,
  FloatingEmoji,
  MusicTrack,
  SquadMember,
  StudyRoom,
  ToastMessage,
  TodoItem,
  UserProfile,
} from './types';
import { audioEngine } from './services/audioService';

export default function App() {
  // App States
  const [currentView, setCurrentView] = useState<'lobby' | 'room'>('lobby');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [rooms, setRooms] = useState<StudyRoom[]>(INITIAL_ROOMS);
  const [currentRoom, setCurrentRoom] = useState<StudyRoom>(INITIAL_ROOMS[0]);
  const [squadMembers] = useState<SquadMember[]>(INITIAL_SQUAD);
  const [heatmapDays, setHeatmapDays] = useState(INITIAL_HEATMAP_DAYS);
  const [participants] = useState(INITIAL_PARTICIPANTS);
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'Hệ Thống', text: 'Chào mừng bạn đến với 100-Day Mastery Club!', time: '08:00', isSystem: true },
    { id: 2, sender: 'Nguyễn Minh Trí', text: 'Chúc anh em hôm nay cày tập trung 10/10 nhé! 🔥', time: '08:05' },
    { id: 3, sender: 'Lê Lan Anh', text: 'Nhạc Lofi hôm nay nghe cuốn thật sự ☕', time: '08:12' },
  ]);
  const [musicTracks] = useState<MusicTrack[]>(CURATED_MUSIC);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(CURATED_MUSIC[0]);
  const [masterVolume, setMasterVolume] = useState<number>(80);

  // Modals & Overlays
  const [isAudioHubOpen, setIsAudioHubOpen] = useState<boolean>(false);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState<boolean>(false);
  const [journalModalDay, setJournalModalDay] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Toast Helper
  const showToast = (text: string, type: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' = 'indigo') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Add XP Helper
  const addXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const leveledUp = newXp >= prev.maxXp;
      if (leveledUp) {
        audioEngine.playTaskVictory();
        triggerConfetti();
        showToast(`⚡ Chúc mừng bạn đã lên LEVEL ${prev.level + 1}!`, 'amber');
        return {
          ...prev,
          level: prev.level + 1,
          xp: newXp - prev.maxXp,
          maxXp: Math.round(prev.maxXp * 1.3),
        };
      }
      return { ...prev, xp: newXp };
    });
  };

  // Confetti Helper
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Poke Squad Member
  const pokeMember = (member: SquadMember) => {
    audioEngine.playPopSound();
    triggerConfetti();
    showToast(`Đã gửi thông báo réo "${member.name}" vào bàn học!`, 'indigo');
  };

  // Floating Emoji Burst
  const sendReactionEmoji = (emoji: string) => {
    audioEngine.playPopSound();
    const count = 5;
    const newItems: FloatingEmoji[] = [];
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < count; i++) {
      newItems.push({
        id: Date.now() + i,
        emoji,
        x: Math.random() * (screenWidth - 100) + 50,
        y: screenHeight - 120 + Math.random() * 40,
        size: Math.floor(Math.random() * 18) + 24,
      });
    }

    setFloatingEmojis((prev) => [...prev, ...newItems]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 2000);
  };

  // Todo Handlers
  const addTodo = (text: string) => {
    const newItem: TodoItem = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newItem, ...prev]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            audioEngine.playTaskVictory();
            triggerConfetti();
            addXp(50);
            showToast('🎉 Hoàn thành nhiệm vụ! +50 XP', 'emerald');
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    showToast('Đã xóa nhiệm vụ', 'slate');
  };

  // Chat Handlers
  const sendChatMessage = (text: string) => {
    audioEngine.playPopSound();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: user.name,
      text,
      time: timeStr,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated peer encouragement response
    setTimeout(() => {
      const peers = ['Nguyễn Minh Trí', 'Lê Lan Anh'];
      const randomPeer = peers[Math.floor(Math.random() * peers.length)];
      const randomCheers = [
        'Cố lên Bảo ơi! 🔥',
        'Ca này tập trung đỉnh thật sự!',
        'Tuyệt vời, chuẩn bị xong 1 Pomodoro nữa rồi!',
      ];
      const replyMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: randomPeer,
        text: randomCheers[Math.floor(Math.random() * randomCheers.length)],
        time: timeStr,
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 2500);
  };

  // Master Volume Handler
  const handleSetMasterVolume = (vol: number) => {
    setMasterVolume(vol);
    audioEngine.setMasterVolume(vol);
  };

  // Join Room
  const handleJoinRoom = (room: StudyRoom) => {
    setCurrentRoom(room);
    setCurrentView('room');
    showToast(`Đã tham gia phòng "${room.title}"`, 'indigo');
  };

  // Create Room
  const handleCreateRoom = (newRoom: StudyRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
    setCurrentRoom(newRoom);
    setCurrentView('room');
  };

  // Journal Note Save
  const handleSaveJournalNote = (day: number, note: string) => {
    setHeatmapDays((prev) =>
      prev.map((d) => (d.day === day ? { ...d, note, completed: true } : d))
    );
    addXp(20);
  };

  // Activate Pro Trial
  const handleActivatePro = () => {
    setUser((prev) => ({ ...prev, isPro: true }));
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Ambient Glowing Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      {/* Floating Emojis Overlay */}
      <FloatingEmojiOverlay emojis={floatingEmojis} />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSwitchView={setCurrentView}
        user={user}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenAudioHub={() => setIsAudioHubOpen(true)}
      />

      {/* View Switcher: Lobby vs Room */}
      <div className="relative z-10 flex-1 flex flex-col">
        {currentView === 'lobby' ? (
          <LobbyView
            user={user}
            heatmapDays={heatmapDays}
            squadMembers={squadMembers}
            rooms={rooms}
            musicTracks={musicTracks}
            currentTrack={currentTrack}
            masterVolume={masterVolume}
            onSetMasterVolume={handleSetMasterVolume}
            onJoinRoom={handleJoinRoom}
            onCreateRoomModal={() => setIsCreateRoomOpen(true)}
            onOpenJournalModal={(day) => setJournalModalDay(day)}
            onOpenAudioHub={() => setIsAudioHubOpen(true)}
            onPokeMember={pokeMember}
            onPlayTrack={(track) => {
              setCurrentTrack(track);
              showToast(`Đang phát: ${track.title}`, 'emerald');
            }}
            onTriggerConfetti={triggerConfetti}
          />
        ) : (
          <RoomView
            room={currentRoom}
            user={user}
            participants={participants}
            todos={todos}
            chatMessages={chatMessages}
            onBackToLobby={() => setCurrentView('lobby')}
            onOpenAudioHub={() => setIsAudioHubOpen(true)}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onSendChatMessage={sendChatMessage}
            onSendReactionEmoji={sendReactionEmoji}
            onAddXp={addXp}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* Modals */}
      <AudioHubModal
        isOpen={isAudioHubOpen}
        onClose={() => setIsAudioHubOpen(false)}
        currentTrack={currentTrack}
        musicTracks={musicTracks}
        masterVolume={masterVolume}
        onSetMasterVolume={handleSetMasterVolume}
        onPlayTrack={(track) => setCurrentTrack(track)}
        onShowToast={showToast}
      />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isPro={user.isPro}
        onActivatePro={handleActivatePro}
        onShowToast={showToast}
      />

      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        onCreateRoom={handleCreateRoom}
        onShowToast={showToast}
      />

      {journalModalDay !== null && (
        <JournalModal
          isOpen={journalModalDay !== null}
          onClose={() => setJournalModalDay(null)}
          day={journalModalDay}
          onSaveNote={handleSaveJournalNote}
          onShowToast={showToast}
        />
      )}
    </div>
  );
}
