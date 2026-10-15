import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Hand,
  VolumeX,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Plus,
  Send,
  Sparkles,
  ShieldAlert,
  Crown,
} from 'lucide-react';
import { ChatMessage, ClubUser, EnglishRoom, RoomParticipant } from '../types';
import { audioEngine } from '../services/audioService';

interface RoomViewProps {
  room: EnglishRoom;
  currentUser: ClubUser;
  chatMessages: ChatMessage[];
  onBackToLobby: () => void;
  onSendChatMessage: (text: string) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber' | 'rose') => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  currentUser,
  chatMessages,
  onBackToLobby,
  onSendChatMessage,
  onShowToast,
}) => {
  // Media states
  const [isMicMuted, setIsMicMuted] = useState<boolean>(true);
  const [isCamOn, setIsCamOn] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'vocab' | 'chat' | 'topic'>('vocab');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');

  // Host Leader specific controls
  const isLeaderOrAdmin = currentUser.role === 'admin' || currentUser.id === room.leaderId;
  const [newVocabInput, setNewVocabInput] = useState<string>('');
  const [vocabList, setVocabList] = useState<string[]>(room.vocabList || []);

  // WebRTC Video Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Other participants in room
  const [participants, setParticipants] = useState<RoomParticipant[]>([
    {
      id: 'p-1',
      name: room.leaderName,
      avatarText: room.leaderAvatar,
      role: 'leader',
      isCamOn: true,
      isMuted: false,
      isHandRaised: false,
    },
    {
      id: 'p-2',
      name: 'Trần Quốc Huy',
      avatarText: 'QH',
      role: 'student',
      isCamOn: false,
      isMuted: true,
      isHandRaised: true,
    },
    {
      id: 'p-3',
      name: 'Nguyễn Thu Hà',
      avatarText: 'TH',
      role: 'student',
      isCamOn: false,
      isMuted: true,
      isHandRaised: false,
    },
    {
      id: 'p-4',
      name: 'Phạm Mai Linh',
      avatarText: 'ML',
      role: 'student',
      isCamOn: false,
      isMuted: true,
      isHandRaised: false,
    },
  ]);

  // Webcam Toggle
  const toggleCamera = async () => {
    if (isCamOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCamOn(false);
      onShowToast('Đã tắt camera', 'indigo');
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
        onShowToast('Đã bật camera phát biểu!', 'emerald');
      } catch (err) {
        onShowToast('Không thể mở camera (vui lòng cấp quyền truy cập)', 'rose');
      }
    }
  };

  // Toggle Hand Raise
  const toggleHandRaise = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    audioEngine.playPopSound();
    onShowToast(
      next
        ? '✋ Đã giơ tay! Tên bạn đã được đưa lên danh sách chờ Cô giáo gọi phát biểu.'
        : 'Đã hạ tay phát biểu.',
      next ? 'amber' : 'slate'
    );
  };

  // Host: Mute All Students
  const handleHostMuteAll = () => {
    audioEngine.playPopSound();
    onShowToast('👑 Leader đã tắt mic tất cả học viên để bắt đầu giảng bài!', 'amber');
  };

  // Host: Add new vocabulary to board
  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVocabInput.trim()) return;
    setVocabList((prev) => [newVocabInput.trim(), ...prev]);
    setNewVocabInput('');
    audioEngine.playTaskVictory();
    onShowToast('Đã ghim từ vựng mới lên bảng cho cả lớp!', 'emerald');
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    onShowToast(`Đã sao chép mã phòng: ${room.code}`, 'emerald');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Send chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <main className="flex-1 flex flex-col w-full h-[calc(100vh-65px)] overflow-hidden">
      {/* Room Header Strip */}
      <section className="glass-panel border-b border-white/10 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4 z-20 flex-shrink-0">
        {/* Left: Room Title & Level */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLobby}
            className="p-1.5 rounded-lg glass-button text-slate-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Rời phòng</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {room.title}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {room.levelLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>
                Host Chủ Trì: <strong className="text-amber-300">{room.leaderName}</strong>
              </span>
              <span>•</span>
              <button
                onClick={handleCopyCode}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer font-mono"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{room.code}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Leader Host Badge or Topic */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/70 px-4 py-1.5 rounded-xl border border-white/10">
          <span className="text-xs text-slate-400 font-semibold">Chủ đề:</span>
          <span className="text-xs text-white font-bold max-w-xs truncate">
            {room.topic}
          </span>
        </div>

        {/* Right: Leader Special Host Controls */}
        <div className="flex items-center gap-2">
          {isLeaderOrAdmin && (
            <button
              onClick={handleHostMuteAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
              title="Tắt mic toàn bộ học viên trong phòng"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tắt Mic Cả Lớp</span>
            </button>
          )}

          {/* Student Raise Hand Button */}
          <button
            onClick={toggleHandRaise}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isHandRaised
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400 animate-pulse'
                : 'glass-button text-slate-300 hover:text-white'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>{isHandRaised ? 'Đang Giơ Tay ✋' : 'Giơ Tay Phát Biểu'}</span>
          </button>
        </div>
      </section>

      {/* Main Room Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Video Grid (Host + Students) */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
            {/* Host Leader Video Card (Big Spotlight) */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[220px] border-2 border-amber-500/50 shadow-xl bg-gradient-to-br from-amber-950/20 to-slate-950">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-1 shadow-2xl">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-extrabold text-white">
                    {room.leaderAvatar}
                  </div>
                </div>
              </div>

              {/* Host Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-current" />
                  <span>LEADER CHỦ TRÌ (HOST)</span>
                </span>
                <span className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-emerald-400">
                  <Mic className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Host Info */}
              <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{room.leaderName}</p>
                  <p className="text-[10px] text-amber-300">Đang điều phối buổi thảo luận</p>
                </div>
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-amber-400 rounded-full animate-soundwave"></span>
                  <span className="w-1 bg-amber-400 rounded-full animate-soundwave [animation-delay:0.2s]"></span>
                  <span className="w-1 bg-amber-400 rounded-full animate-soundwave [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>

            {/* Current User Card (Self) */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[220px] border border-violet-500/40">
              {isCamOn ? (
                <div className="absolute inset-0 bg-black z-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-600/80 text-white text-[10px] font-bold">
                    WEBCAM LIVE
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-1 shadow-xl">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-bold text-white">
                      {currentUser.avatarText}
                    </div>
                  </div>
                </div>
              )}

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 font-semibold border border-white/10">
                  {currentUser.role === 'admin' ? '👑 Admin' : '🎓 Bạn'}
                </span>
                {isHandRaised && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 animate-bounce">
                    <Hand className="w-3 h-3" />
                    <span>Đang Giơ Tay</span>
                  </span>
                )}
              </div>

              <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">{currentUser.name} (Bạn)</span>
                  <p className="text-[10px] text-slate-400">Học viên cấp độ {currentUser.level}</p>
                </div>
                {isMicMuted ? (
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
            </div>

            {/* Other Students */}
            {participants
              .filter((p) => p.role !== 'leader')
              .map((p) => (
                <div
                  key={p.id}
                  className="glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[220px] border border-white/10"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-18 h-18 rounded-2xl bg-slate-800 text-slate-300 p-1 flex items-center justify-center text-xl font-bold border border-white/10">
                      {p.avatarText}
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-slate-300">
                      Học viên
                    </span>
                    {p.isHandRaised && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-1">
                        <Hand className="w-3 h-3" />
                        <span>Giơ tay</span>
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">Đang lắng nghe</p>
                    </div>
                    <MicOff className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              ))}
          </div>

          {/* Bottom Call Controls Dock */}
          <div className="glass-panel p-3 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMicMuted(!isMicMuted);
                  onShowToast(isMicMuted ? 'Đã bật micro phát biểu' : 'Đã tắt micro', 'indigo');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isMicMuted ? 'glass-button text-slate-400' : 'bg-emerald-600 text-white shadow-lg'
                }`}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMicMuted ? 'Bật Mic' : 'Tắt Mic'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isCamOn ? 'bg-indigo-600 text-white shadow-lg' : 'glass-button text-slate-400'
                }`}
              >
                {isCamOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span>{isCamOn ? 'Tắt Cam' : 'Bật Camera'}</span>
              </button>

              <button
                onClick={toggleHandRaise}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isHandRaised ? 'bg-amber-500 text-slate-950 font-extrabold' : 'glass-button text-slate-300'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{isHandRaised ? 'Hạ Tay' : 'Giơ Tay ✋'}</span>
              </button>
            </div>

            <button
              onClick={onBackToLobby}
              className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              Rời Lớp Học
            </button>
          </div>
        </div>

        {/* Right: English Room Sidebar (Vocab Board / Chat / Topic Guide) */}
        <aside className="w-80 lg:w-96 glass-panel border-l border-white/10 flex flex-col h-full flex-shrink-0">
          {/* Tabs selector */}
          <div className="p-3 border-b border-white/10 flex items-center gap-1 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('vocab')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'vocab' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bảng Từ Vựng</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Hỏi Đáp Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('topic')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'topic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Chủ Đề</span>
            </button>
          </div>

          {/* TAB 1: VOCABULARY BOARD */}
          {activeTab === 'vocab' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-white flex items-center gap-1">
                  <span>📝 Từ Vựng & Cụm Từ Cô Ghim</span>
                </span>
                <span className="text-amber-400 font-mono text-[11px]">{vocabList.length} từ mới</span>
              </div>

              {/* Host pin new word input */}
              {isLeaderOrAdmin && (
                <form onSubmit={handleAddVocab} className="mb-3 flex gap-2">
                  <input
                    type="text"
                    value={newVocabInput}
                    onChange={(e) => setNewVocabInput(e.target.value)}
                    placeholder="Cô ghim từ mới (VD: Breathtaking: Đẹp)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Vocab items */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {vocabList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-xs"
                  >
                    <p className="font-bold text-indigo-300">{item.split(':')[0]}</p>
                    {item.split(':')[1] && (
                      <p className="text-slate-300 text-[11px]">{item.split(':')[1]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CHAT & QA */}
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
              <form onSubmit={handleSendChat} className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Gõ đáp án hoặc câu hỏi tiếng Anh..."
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

          {/* TAB 3: TOPIC QUESTIONS */}
          {activeTab === 'topic' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Câu Hỏi Gợi Ý Cho Buổi Thảo Luận:</span>
                </h4>
                <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <strong>1.</strong> Can you describe the most memorable trip you have ever had?
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <strong>2.</strong> What is your dream country to visit and why?
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <strong>3.</strong> Have you ever experienced culture shock? How did you feel?
                  </div>
                </div>
              </div>

              <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 text-[11px] text-indigo-300 leading-relaxed">
                💡 <strong>Mẹo luyện phản xạ:</strong> Đừng sợ nói sai ngữ pháp! Cứ mạnh dạn ghép các từ vựng Cô vừa ghim vào câu nói của mình nhé.
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};
