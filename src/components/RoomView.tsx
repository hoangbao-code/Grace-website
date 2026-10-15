import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Sliders,
  Maximize2,
  Minimize2,
  Trash2,
  Send,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  ListTodo,
} from 'lucide-react';
import { ChatMessage, Participant, StudyRoom, TodoItem, UserProfile } from '../types';
import { audioEngine } from '../services/audioService';

interface RoomViewProps {
  room: StudyRoom;
  user: UserProfile;
  participants: Participant[];
  todos: TodoItem[];
  chatMessages: ChatMessage[];
  onBackToLobby: () => void;
  onOpenAudioHub: () => void;
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onSendChatMessage: (text: string) => void;
  onSendReactionEmoji: (emoji: string) => void;
  onAddXp: (amount: number) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber' | 'rose') => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  user,
  participants,
  todos,
  chatMessages,
  onBackToLobby,
  onOpenAudioHub,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onSendChatMessage,
  onSendReactionEmoji,
  onAddXp,
  onShowToast,
}) => {
  // Pomodoro State
  const [pomoTimeLeft, setPomoTimeLeft] = useState<number>(50 * 60); // 50m
  const [pomoIsRunning, setPomoIsRunning] = useState<boolean>(true);
  const [pomoPhase, setPomoPhase] = useState<'focus' | 'break'>('focus');

  // Media Controls
  const [isMicMuted, setIsMicMuted] = useState<boolean>(true);
  const [isCamOn, setIsCamOn] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat' | 'tips'>('tasks');
  const [newTodoInput, setNewTodoInput] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Video Ref for actual webcam
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Pomodoro Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pomoIsRunning && pomoTimeLeft > 0) {
      timer = setInterval(() => {
        setPomoTimeLeft((prev) => {
          // Increment XP every minute during focus
          if (pomoPhase === 'focus' && prev % 60 === 0) {
            onAddXp(2);
          }
          if (prev <= 1) {
            // Switch phase
            if (pomoPhase === 'focus') {
              setPomoPhase('break');
              audioEngine.playTaskVictory();
              onShowToast('🎉 Hoàn thành ca tập trung 50 phút! Giải lao 10 phút nhé.', 'emerald');
              return 10 * 60;
            } else {
              setPomoPhase('focus');
              audioEngine.playPopSound();
              onShowToast('🔥 Bắt đầu ca tập trung mới 50 phút!', 'indigo');
              return 50 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomoIsRunning, pomoPhase, onAddXp, onShowToast]);

  // Webcam Handler
  const toggleCamera = async () => {
    if (isCamOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCamOn(false);
      onShowToast('Đã tắt camera, chuyển về Avatar 2D', 'indigo');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCamOn(true);
        onShowToast('Đã bật camera máy tính thành công!', 'emerald');
      } catch (err) {
        onShowToast('Không thể mở camera (kiểm tra quyền cấp phép camera)', 'rose');
      }
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Copy room code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    onShowToast(`Đã sao chép mã phòng: ${room.code}`, 'emerald');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoInput.trim()) return;
    onAddTodo(newTodoInput.trim());
    setNewTodoInput('');
    onShowToast('Đã thêm mục tiêu học tập mới', 'indigo');
  };

  const handleSendChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const toggleZen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsZenMode(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsZenMode(false);
    }
  };

  const completedTodosCount = todos.filter((t) => t.completed).length;
  const todoProgress = todos.length > 0 ? Math.round((completedTodosCount / todos.length) * 100) : 0;

  return (
    <main className="flex-1 flex flex-col w-full h-[calc(100vh-65px)] overflow-hidden">
      {/* Room Header Strip */}
      <section className="glass-panel border-b border-white/10 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4 z-20 flex-shrink-0">
        {/* Left: Room Meta */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLobby}
            className="p-1.5 rounded-lg glass-button text-slate-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
            title="Quay lại sảnh"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Rời sảnh</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                {room.title}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {room.tagLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>
                Mã phòng: <strong className="text-slate-200">{room.code}</strong>
              </span>
              <button
                onClick={handleCopyCode}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
                title="Copy mã mời"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Synchronized Pomodoro Bar */}
        <div className="flex items-center gap-3 bg-slate-950/70 px-4 py-1.5 rounded-xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-base animate-pulse">
              {pomoPhase === 'focus' ? '🔥' : '☕'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  {pomoPhase === 'focus' ? 'Ca Tập Trung' : 'Nghỉ Giải Lao'}
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline">
                  • {pomoPhase === 'focus' ? 'Mục tiêu 50m' : '10m'}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider">
                {formatTime(pomoTimeLeft)}
              </div>
            </div>
          </div>

          {/* Pomodoro Controls */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            <button
              onClick={() => setPomoIsRunning(!pomoIsRunning)}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
              title={pomoIsRunning ? 'Tạm dừng' : 'Bắt đầu'}
            >
              {pomoIsRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => {
                if (pomoPhase === 'focus') {
                  setPomoPhase('break');
                  setPomoTimeLeft(10 * 60);
                } else {
                  setPomoPhase('focus');
                  setPomoTimeLeft(50 * 60);
                }
              }}
              className="p-1.5 rounded-lg glass-button text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Chuyển giai đoạn"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPomoTimeLeft(pomoPhase === 'focus' ? 50 * 60 : 10 * 60)}
              className="p-1.5 rounded-lg glass-button text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Đặt lại thời gian"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Action: Audio Hub & Stats */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAudioHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Hòa Âm</span>
          </button>
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+2 XP/m</span>
          </div>
        </div>
      </section>

      {/* Main Room Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Study Space / Participant Video Grid */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto space-y-4">
          {/* Participant Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
            {/* User Participant Card (Self) */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group min-h-[200px] border border-violet-500/40">
              {/* Webcam view if on, else 2D avatar */}
              {isCamOn ? (
                <div className="absolute inset-0 bg-black z-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-600/80 text-white text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>LIVE CAM</span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 to-slate-900/60 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-1 shadow-2xl">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-extrabold text-white">
                      {user.avatarText}
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay Top: Status & Mood */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{user.isPro ? '👑 VIP PRO' : '🎯 Đang học'}</span>
                </span>
                <span className="text-xs bg-black/60 px-2 py-0.5 rounded-full text-slate-300">
                  {isMicMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                </span>
              </div>

              {/* Overlay Bottom: Name & Soundwave */}
              <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">{user.name}</span>
                    <span className="text-[10px] text-indigo-400 font-semibold">(Bạn)</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Đang code React 19</p>
                </div>

                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-emerald-400 rounded-full animate-soundwave"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-soundwave [animation-delay:0.2s]"></span>
                  <span className="w-1 bg-emerald-400 rounded-full animate-soundwave [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>

            {/* Other Room Participants */}
            {participants
              .filter((p) => !p.isSelf)
              .map((p) => (
                <div
                  key={p.id}
                  className={`glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[200px] border ${
                    p.isPro ? 'pro-rainbow-glow border-amber-400' : p.borderColor
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-slate-950/80 flex items-center justify-center pointer-events-none">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${p.bgColor} p-1 shadow-xl`}>
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-bold text-white">
                        {p.avatarText}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                      {p.mood}
                    </span>
                    <span className="text-xs bg-black/60 p-1 rounded-full text-slate-400">
                      <MicOff className="w-3 h-3 text-slate-500" />
                    </span>
                  </div>

                  <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      <p className="text-[10px] text-slate-400">{p.statusText}</p>
                    </div>
                    {p.isPro && <span className="text-xs">👑</span>}
                  </div>
                </div>
              ))}
          </div>

          {/* Floating Emoji Bar */}
          <div className="glass-panel p-2.5 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-xs text-slate-400 font-semibold px-2 whitespace-nowrap hidden sm:inline">
              Thả cảm xúc:
            </span>
            <div className="flex items-center gap-2">
              {['❤️', '🔥', '☕', '💡', '👏', '😴'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSendReactionEmoji(emoji)}
                  className="w-9 h-9 rounded-xl glass-button text-base flex items-center justify-center hover:scale-125 transition-transform active:scale-95 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
              <button
                onClick={() => onSendReactionEmoji('👑')}
                className="w-9 h-9 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-base flex items-center justify-center hover:scale-125 transition-transform active:scale-95 cursor-pointer"
                title="VIP Crown"
              >
                👑
              </button>
              <button
                onClick={() => onSendReactionEmoji('⚡')}
                className="w-9 h-9 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-base flex items-center justify-center hover:scale-125 transition-transform active:scale-95 cursor-pointer"
                title="VIP Zap"
              >
                ⚡
              </button>
            </div>

            {/* Bottom Dock Control Buttons */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <button
                onClick={() => {
                  setIsMicMuted(!isMicMuted);
                  onShowToast(isMicMuted ? 'Đã bật micro' : 'Đã tắt micro', 'indigo');
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isMicMuted ? 'glass-button text-slate-400' : 'bg-emerald-600 text-white'
                }`}
                title="Micro"
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isCamOn ? 'bg-indigo-600 text-white shadow-lg' : 'glass-button text-slate-400'
                }`}
                title="Camera"
              >
                {isCamOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleZen}
                className="p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Zen Mode (Toàn màn hình)"
              >
                {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Room Sidebar (Tabs: Tasks / Chat / Tips) */}
        <aside className="w-80 lg:w-96 glass-panel border-l border-white/10 flex flex-col h-full flex-shrink-0">
          {/* Tab Selector */}
          <div className="p-3 border-b border-white/10 flex items-center gap-1 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tasks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Mục tiêu</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Phòng Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tips' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mẹo Học</span>
            </button>
          </div>

          {/* Tab Content: Tasks */}
          {activeTab === 'tasks' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-white">Nhiệm vụ ca học này</span>
                <span className="text-emerald-400 font-semibold">{completedTodosCount}/{todos.length} xong</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${todoProgress}%` }}
                ></div>
              </div>

              {/* Task list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      todo.completed
                        ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400 line-through'
                        : 'bg-slate-900/60 border-white/5 text-slate-200 hover:border-white/15'
                    }`}
                  >
                    <div
                      onClick={() => onToggleTodo(todo.id)}
                      className="flex items-center gap-2.5 flex-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        readOnly
                        className="accent-emerald-500 rounded cursor-pointer w-4 h-4"
                      />
                      <span>{todo.text}</span>
                    </div>
                    <button
                      onClick={() => onDeleteTodo(todo.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddTodoSubmit} className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newTodoInput}
                  onChange={(e) => setNewTodoInput(e.target.value)}
                  placeholder="+ Thêm việc cần hoàn thành..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Thêm
                </button>
              </form>
            </div>
          )}

          {/* Tab Content: Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl space-y-1 text-xs ${
                      msg.isSystem
                        ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-center text-[11px]'
                        : 'bg-slate-900/70 border border-white/5'
                    }`}
                  >
                    {!msg.isSystem && (
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-300">{msg.sender}</span>
                        <span className="text-slate-500">{msg.time}</span>
                      </div>
                    )}
                    <p className="text-slate-200 leading-snug">{msg.text}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatSubmit} className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Gửi lời động viên hoặc hỏi bài..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab Content: Tips */}
          {activeTab === 'tips' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                <h4 className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                  <Flame className="w-4 h-4" /> Quy tắc 50/10 Deep Work
                </h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  50 phút tập trung cao độ, tắt hết thông báo mạng xã hội. 10 phút nghỉ ngơi: đứng dậy, uống nước và vươn vai.
                </p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Quy tắc 2 Phút
                </h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Nếu một việc chỉ tốn dưới 2 phút để hoàn thành (như trả lời 1 tin nhắn khẩn, dọn bàn học), hãy làm ngay lập tức.
                </p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                <h4 className="font-bold text-indigo-300 flex items-center gap-1 mb-1">
                  <span>🎧</span> Sóng Não Alpha 10Hz
                </h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Bật hòa âm sóng Alpha trong Trạm Hòa Âm để đưa não bộ vào trạng thái tỉnh táo, thư giãn và tiếp thu nhanh x2 lần.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};
