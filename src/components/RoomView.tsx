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
  Crown,
  PartyPopper,
  Gift,
  Trophy,
  FileText,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, ClubUser, EnglishRoom, FloatingEmoji, RoomParticipant } from '../types';
import { audioEngine } from '../services/audioService';
import { LuckyWheelModal } from './LuckyWheelModal';
import { SessionRecapModal } from './SessionRecapModal';

interface RoomViewProps {
  room: EnglishRoom;
  currentUser: ClubUser;
  chatMessages: ChatMessage[];
  onBackToLobby: () => void;
  onSendChatMessage: (text: string) => void;
  onClaimStreak?: () => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber' | 'rose') => void;
}

interface ActiveSpeechBubble {
  targetId: string;
  senderName: string;
  text: string;
  id: number;
}

interface FlyingHeart {
  id: number;
  x: number;
  y: number;
  color: string;
  scale: number;
  emoji: string;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  currentUser,
  chatMessages,
  onBackToLobby,
  onSendChatMessage,
  onClaimStreak,
  onShowToast,
}) => {
  // Media states
  const [isMicMuted, setIsMicMuted] = useState<boolean>(true);
  const [isCamOn, setIsCamOn] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'vocab' | 'chat' | 'topic'>('vocab');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');

  // Floating Emojis Animation
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Tap-to-Heart on Camera & Combo Counter
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboTargetId, setComboTargetId] = useState<string | null>(null);
  const [flyingHearts, setFlyingHearts] = useState<FlyingHeart[]>([]);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TÍNH NĂNG: Lucky Wheel
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState<boolean>(false);
  const [luckySpotlightId, setLuckySpotlightId] = useState<string | null>(null);

  // TÍNH NĂNG 6: Comic Speech Bubbles
  const [activeSpeechBubbles, setActiveSpeechBubbles] = useState<ActiveSpeechBubble[]>([]);

  // TÍNH NĂNG 5: Session Recap Exporter Modal
  const [isRecapModalOpen, setIsRecapModalOpen] = useState<boolean>(false);

  // Host Leader specific controls
  const isLeaderOrAdmin = currentUser.role === 'admin' || currentUser.id === room.leaderId;
  const isUserRoomLeader = currentUser.id === room.leaderId;
  const [newVocabInput, setNewVocabInput] = useState<string>('');
  const [vocabList, setVocabList] = useState<string[]>(room.vocabList || []);

  // WebRTC Video Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Other participants in room - Web mới: Chỉ có Leader nếu phòng do Leader khác tạo
  const [participants] = useState<RoomParticipant[]>(
    currentUser.id !== room.leaderId
      ? [
          {
            id: 'p-1',
            name: room.leaderName,
            avatarText: room.leaderAvatar,
            role: 'leader',
            isCamOn: true,
            isMuted: false,
            isHandRaised: false,
          },
        ]
      : []
  );

  // Tự động gắn luồng camera vào video element mỗi khi isCamOn = true
  useEffect(() => {
    if (isCamOn && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch((err) => {
        console.warn('Auto-play video error:', err);
      });
    }
  }, [isCamOn]);

  // Giải phóng camera và timer khi rời phòng học
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
      }
    };
  }, []);

  // Webcam Toggle với cơ chế Fallback và gán stream an toàn
  const toggleCamera = async () => {
    if (isCamOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCamOn(false);
      onShowToast('Đã tắt camera', 'indigo');
    } else {
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
            },
            audio: false,
          });
        } catch {
          // Fallback nếu máy/trình duyệt không hỗ trợ constraint độ phân giải cao
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        streamRef.current = stream;
        setIsCamOn(true);

        // Gán ngay lập tức nếu video element đã có sẵn trong DOM
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }

        onShowToast('Đã bật camera phát biểu!', 'emerald');
      } catch (err: any) {
        console.error('Webcam error:', err);
        let errorMsg = 'Không thể mở camera (vui lòng cấp quyền truy cập)';
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg = 'Trình duyệt bị từ chối quyền truy cập camera. Vui lòng cho phép quyền Camera trên thanh địa chỉ!';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMsg = 'Không tìm thấy thiết bị webcam trên máy tính!';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMsg = 'Webcam đang bị ứng dụng khác (Zoom, Google Meet, Teams, v.v.) chiếm dụng!';
        }
        onShowToast(errorMsg, 'rose');
      }
    }
  };

  // Raise hand
  const toggleHandRaise = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    audioEngine.playPopSound();
    if (next) {
      triggerFloatingEmoji('✋');
      onShowToast('✋ Đã giơ tay phát biểu!', 'amber');
    } else {
      onShowToast('Đã hạ tay.', 'slate');
    }
  };

  // Floating Emoji Burst Trigger
  const triggerFloatingEmoji = (emoji: string) => {
    audioEngine.playPopSound();
    const count = 4;
    const newItems: FloatingEmoji[] = [];
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < count; i++) {
      newItems.push({
        id: Date.now() + i,
        emoji,
        x: Math.random() * (screenWidth * 0.6) + 50,
        y: screenHeight - 140 + Math.random() * 30,
      });
    }

    setFloatingEmojis((prev) => [...prev, ...newItems]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 2000);
  };

  // Applause with Confetti
  const triggerApplause = () => {
    audioEngine.playTaskVictory();
    triggerFloatingEmoji('👏');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
    onShowToast('👏 Cả lớp cùng vỗ tay tán thưởng!', 'amber');
  };

  // Tap-to-Heart & Combo System
  const handleCardTap = (targetId: string, clientX?: number, clientY?: number) => {
    const isSameTarget = comboTargetId === targetId;
    const newCombo = isSameTarget ? comboCount + 1 : 1;

    setComboTargetId(targetId);
    setComboCount(newCombo);

    // Pleasant pop sound with slight pitch climb
    audioEngine.playComboPop(newCombo);

    // Heart particles originating from tap location
    const posX = clientX ?? window.innerWidth / 2 + (Math.random() * 40 - 20);
    const posY = clientY ?? window.innerHeight / 2 + (Math.random() * 30 - 15);

    const colors = ['#ec4899', '#f43f5e', '#a855f7', '#06b6d4', '#eab308'];
    const emojis = ['💖', '❤️', '🔥', '✨', '💕'];
    const newHeart: FlyingHeart = {
      id: Date.now() + Math.random(),
      x: posX,
      y: posY,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.9 + Math.min(newCombo * 0.03, 1.25),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };

    setFlyingHearts((prev) => [...prev.slice(-40), newHeart]);
    setTimeout(() => {
      setFlyingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1100);

    // Reset combo after 1.8s silence
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setComboCount(0);
      setComboTargetId(null);
    }, 1800);
  };

  // TÍNH NĂNG 6: Trigger Comic Speech Bubble
  const triggerSpeechBubble = (targetId: string, senderName: string, text: string) => {
    const newBubble: ActiveSpeechBubble = {
      targetId,
      senderName,
      text,
      id: Date.now() + Math.random(),
    };

    setActiveSpeechBubbles((prev) => [
      ...prev.filter((b) => b.targetId !== targetId),
      newBubble,
    ]);

    setTimeout(() => {
      setActiveSpeechBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, 4500);
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
    triggerFloatingEmoji('📝');
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
    const text = chatInput.trim();
    onSendChatMessage(text);
    triggerSpeechBubble('self', currentUser.name, text);
    setChatInput('');
  };

  // Quick speech phrase
  const handleQuickSpeech = (phrase: string) => {
    onSendChatMessage(phrase);
    triggerSpeechBubble('self', currentUser.name, phrase);
    triggerFloatingEmoji('💬');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // All wheel participants (không bị trùng lặp nếu người dùng chính là Leader)
  const wheelParticipants = isUserRoomLeader
    ? [
        { id: 'leader', name: room.leaderName, avatarText: room.leaderAvatar },
        ...participants.filter((p) => p.role !== 'leader'),
      ]
    : [
        { id: 'leader', name: room.leaderName, avatarText: room.leaderAvatar },
        { id: 'self', name: currentUser.name, avatarText: currentUser.avatarText },
        ...participants.filter((p) => p.role !== 'leader'),
      ];

  // Helper to render Comic Speech Bubble over Camera
  const renderSpeechBubbleOverlay = (targetId: string) => {
    const bubble = activeSpeechBubbles.find((b) => b.targetId === targetId);
    if (!bubble) return null;

    return (
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 w-max max-w-[85%] pointer-events-none animate-bubble-pop">
        <div className="relative bg-white text-slate-950 px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-indigo-600 font-extrabold text-xs leading-snug">
          <span>💬 {bubble.text}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col w-full h-[calc(100vh-65px)] overflow-hidden relative">
      {/* Tap Flying Hearts Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {flyingHearts.map((h) => (
          <span
            key={h.id}
            className="absolute select-none animate-float-heart-live"
            style={{
              left: `${h.x}px`,
              top: `${h.y}px`,
              fontSize: `${26 * h.scale}px`,
              filter: `drop-shadow(0 0 12px ${h.color})`,
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      {/* Floating Emojis Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((item) => (
          <span
            key={item.id}
            className="absolute select-none text-3xl animate-float-up"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              animation: 'floatUp 1.8s ease-out forwards',
            }}
          >
            {item.emoji}
          </span>
        ))}
        <style>{`
          @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0px) scale(0.8); }
            50% { transform: translateY(-90px) scale(1.4) rotate(15deg); }
            100% { opacity: 0; transform: translateY(-180px) scale(1.7) rotate(-15deg); }
          }
        `}</style>
      </div>

      {/* Room Header Strip */}
      <section className="glass-panel border-b border-white/10 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4 z-20 flex-shrink-0">
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
              <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {room.title}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                {room.level}
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

        {/* Center: Topic summary */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/70 px-4 py-1.5 rounded-xl border border-white/10">
          <span className="text-xs text-slate-400 font-semibold">Chủ đề:</span>
          <span className="text-xs text-white font-bold max-w-xs truncate">{room.topic}</span>
        </div>

        {/* Right: Leader Controls & Raise Hand */}
        <div className="flex items-center gap-2">
          {isLeaderOrAdmin && (
            <>
              <button
                onClick={() => setIsRecapModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer shadow-lg"
                title="Xuất bản tóm tắt buổi học để gửi Zalo/Facebook nhóm lớp"
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Xuất Recap Buổi</span>
              </button>

              <button
                onClick={handleHostMuteAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tắt Mic Cả Lớp</span>
              </button>
            </>
          )}

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
        {/* Left: Video Grid */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 flex-1">
            {/* 1. Host Leader Video Card */}
            <div
              onClick={(e) => handleCardTap('leader', e.clientX, e.clientY)}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-between relative min-h-[220px] shadow-xl bg-gradient-to-br from-amber-950/20 to-slate-950 group transition-all overflow-hidden cursor-pointer select-none ${
                luckySpotlightId === 'leader' || (isUserRoomLeader && luckySpotlightId === 'self')
                  ? 'animate-lucky-spotlight border-4 border-amber-400 scale-[1.02]'
                  : 'border-2 border-amber-500/50'
              }`}
            >
              {/* Bouncing Combo Multiplier Badge */}
              {comboCount > 1 &&
                (comboTargetId === 'leader' || (isUserRoomLeader && comboTargetId === 'self')) && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 animate-combo-bounce pointer-events-none">
                    <div className="px-3.5 py-1 rounded-full font-black text-xs tracking-wider uppercase shadow-2xl flex items-center gap-1.5 border-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-300 shadow-pink-500/50">
                      <span className="text-base animate-bounce">💖</span>
                      <span>COMBO x{comboCount}</span>
                    </div>
                  </div>
                )}

              {/* Comic Speech Bubble */}
              {renderSpeechBubbleOverlay('leader')}
              {isUserRoomLeader && renderSpeechBubbleOverlay('self')}

              {/* Lucky Spotlight Banner */}
              {(luckySpotlightId === 'leader' || (isUserRoomLeader && luckySpotlightId === 'self')) && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xl animate-bounce flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  <span>NGƯỜI ĐƯỢC CHỌN TỎA SÁNG ⭐</span>
                </div>
              )}

              {/* Video Feed / Avatar for Host */}
              {isUserRoomLeader && isCamOn ? (
                <div className="absolute inset-0 bg-black z-0 rounded-2xl overflow-hidden pointer-events-none">
                  <video
                    ref={(node) => {
                      videoRef.current = node;
                      if (node && streamRef.current && node.srcObject !== streamRef.current) {
                        node.srcObject = streamRef.current;
                        node.play().catch(() => {});
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-lg z-10 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                    <span>HOST CAM LIVE</span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-1 shadow-2xl">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-extrabold text-white">
                      {room.leaderAvatar}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Controls on Video Card */}
              <div className="relative z-20 flex items-center justify-between">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold flex items-center gap-1 shadow-md">
                  <Crown className="w-3 h-3 fill-current" />
                  <span>{isUserRoomLeader ? 'BẠN (LEADER HOST)' : 'LEADER (HOST)'}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {isUserRoomLeader && isHandRaised && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 animate-bounce">
                      <Hand className="w-3 h-3" />
                      <span>Giơ Tay</span>
                    </span>
                  )}

                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isUserRoomLeader
                        ? isMicMuted
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-black/60 text-emerald-400'
                    }`}
                  >
                    {isUserRoomLeader ? (
                      isMicMuted ? (
                        <MicOff className="w-3.5 h-3.5" />
                      ) : (
                        <Mic className="w-3.5 h-3.5" />
                      )
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Bottom Info Strip */}
              <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{room.leaderName}</span>
                    {isUserRoomLeader && <span className="text-amber-300 text-[11px] font-medium">(Bạn)</span>}
                  </p>
                  <p className="text-[10px] text-amber-300">Chạm để thả tim 💖</p>
                </div>
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-amber-400 rounded-full animate-soundwave"></span>
                  <span className="w-1 bg-amber-400 rounded-full animate-soundwave [animation-delay:0.2s]"></span>
                  <span className="w-1 bg-amber-400 rounded-full animate-soundwave [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>

            {/* 2. Current User Card (Self) - Chỉ hiển thị nếu người dùng KHÔNG PHẢI là chủ phòng (Leader) */}
            {!isUserRoomLeader && (
              <div
                onClick={(e) => handleCardTap('self', e.clientX, e.clientY)}
                className={`glass-panel rounded-2xl p-4 flex flex-col justify-between relative min-h-[220px] group transition-all overflow-hidden cursor-pointer select-none ${
                  luckySpotlightId === 'self'
                    ? 'animate-lucky-spotlight border-4 border-amber-400 scale-[1.02]'
                    : 'border border-violet-500/40'
                }`}
              >
                {/* Bouncing Combo Multiplier Badge */}
                {comboCount > 1 && comboTargetId === 'self' && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 animate-combo-bounce pointer-events-none">
                    <div className="px-3.5 py-1 rounded-full font-black text-xs tracking-wider uppercase shadow-2xl flex items-center gap-1.5 border-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-300 shadow-pink-500/50">
                      <span className="text-base animate-bounce">💖</span>
                      <span>COMBO x{comboCount}</span>
                    </div>
                  </div>
                )}

                {/* Comic Speech Bubble */}
                {renderSpeechBubbleOverlay('self')}

                {/* Lucky Spotlight Banner */}
                {luckySpotlightId === 'self' && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xl animate-bounce flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>BẠN LÀ NGƯỜI ĐƯỢC CHỌN TỎA SÁNG ⭐</span>
                  </div>
                )}

                {/* Video Feed / Avatar */}
                {isCamOn ? (
                  <div className="absolute inset-0 bg-black z-0 rounded-2xl overflow-hidden pointer-events-none">
                    <video
                      ref={(node) => {
                        videoRef.current = node;
                        if (node && streamRef.current && node.srcObject !== streamRef.current) {
                          node.srcObject = streamRef.current;
                          node.play().catch(() => {});
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-600/80 text-white text-[10px] font-bold z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      <span>WEBCAM LIVE</span>
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

                {/* Top Controls on Video Card */}
                <div className="relative z-20 flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 font-semibold border border-white/10">
                    {currentUser.role === 'admin' ? '👑 Admin Bảo' : '🎓 Bạn'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isHandRaised && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 animate-bounce">
                        <Hand className="w-3 h-3" />
                        <span>Đang Giơ Tay</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Info Strip */}
                <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{currentUser.name} (Bạn)</span>
                    <p className="text-[10px] text-slate-400">Chạm để thả tim 💖</p>
                  </div>
                  {isMicMuted ? (
                    <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </div>
            )}

            {/* 3. Other Students */}
            {participants
              .filter((p) => p.role !== 'leader')
              .map((p) => (
                <div
                  key={p.id}
                  onClick={(e) => handleCardTap(p.id, e.clientX, e.clientY)}
                  className={`glass-panel rounded-2xl p-4 flex flex-col justify-between relative min-h-[220px] group transition-all cursor-pointer select-none ${
                    luckySpotlightId === p.id
                      ? 'animate-lucky-spotlight border-4 border-amber-400 scale-[1.02]'
                      : 'border border-white/10'
                  }`}
                >
                  {/* Bouncing Combo Multiplier Badge */}
                  {comboCount > 1 && comboTargetId === p.id && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 animate-combo-bounce pointer-events-none">
                      <div className="px-3.5 py-1 rounded-full font-black text-xs tracking-wider uppercase shadow-2xl flex items-center gap-1.5 border-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-300 shadow-pink-500/50">
                        <span className="text-base animate-bounce">💖</span>
                        <span>COMBO x{comboCount}</span>
                      </div>
                    </div>
                  )}

                  {/* Comic Speech Bubble */}
                  {renderSpeechBubbleOverlay(p.id)}

                  {/* Lucky Spotlight Banner */}
                  {luckySpotlightId === p.id && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xl animate-bounce flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>NGƯỜI ĐƯỢC CHỌN TỎA SÁNG ⭐</span>
                    </div>
                  )}

                  {/* Avatar Center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-18 h-18 rounded-2xl bg-slate-800 text-slate-300 p-1 flex items-center justify-center text-xl font-bold border border-white/10">
                      {p.avatarText}
                    </div>
                  </div>

                  {/* Top Controls on Video Card */}
                  <div className="relative z-20 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-slate-300">
                      Học viên
                    </span>

                    <div className="flex items-center gap-1.5">
                      {p.isHandRaised && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-1">
                          <Hand className="w-3 h-3" />
                          <span>Giơ tay</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Info Strip */}
                  <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">Chạm để thả tim 💖</p>
                    </div>
                    <MicOff className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              ))}
          </div>

          {/* Animated Reaction Bar & Controls Dock */}
          <div className="glass-panel p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            {/* Reaction Emoji & Lucky Wheel Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* Thả Tim Nhanh */}
              <button
                onClick={(e) => {
                  handleCardTap('leader', e.clientX, e.clientY);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-black flex items-center gap-1.5 transition-all active:scale-90 cursor-pointer shadow-lg shadow-pink-500/25 flex-shrink-0"
                title="Bấm liên tục để bắn tim thả ga!"
              >
                <span className="text-sm animate-bounce">💖</span>
                <span>Thả Tim {comboCount > 1 ? `x${comboCount}` : ''}</span>
              </button>

              <span className="text-xs text-slate-400 font-semibold px-1 whitespace-nowrap hidden sm:inline">
                Cảm xúc:
              </span>
              {['👏', '🔥', '❤️', '💡', '💯', '🇬🇧'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerFloatingEmoji(emoji)}
                  className="w-9 h-9 rounded-xl glass-button text-base flex items-center justify-center hover:scale-125 transition-transform active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {emoji}
                </button>
              ))}

              <button
                onClick={triggerApplause}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer flex-shrink-0"
                title="Bắn pháo hoa tán thưởng bài phát biểu"
              >
                <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                <span>Vỗ Tay</span>
              </button>

              {/* TÍNH NĂNG 3: Vòng Quay May Mắn Button */}
              <button
                onClick={() => setIsLuckyWheelOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20 flex-shrink-0"
                title="Quay số chọn người tiếp theo mở mic"
              >
                <span className="text-sm">🎡</span>
                <span>Vòng Quay</span>
              </button>

              {/* TÍNH NĂNG STREAK: Nhận Streak Buổi Học */}
              {onClaimStreak && (
                <button
                  onClick={onClaimStreak}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-orange-500/25 flex-shrink-0"
                  title="Hoàn thành buổi học hôm nay và thắp sáng ngọn lửa Streak!"
                >
                  <span className="text-sm">🔥</span>
                  <span>Nhận Streak</span>
                </button>
              )}
            </div>


            {/* Mic / Cam / Leave Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMicMuted(!isMicMuted);
                  onShowToast(isMicMuted ? 'Đã bật micro phát biểu' : 'Đã tắt micro', 'indigo');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMicMuted ? 'glass-button text-slate-400' : 'bg-emerald-600 text-white shadow-lg'
                }`}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMicMuted ? 'Bật Mic' : 'Tắt Mic'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCamOn ? 'bg-indigo-600 text-white shadow-lg' : 'glass-button text-slate-400'
                }`}
              >
                {isCamOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span>{isCamOn ? 'Tắt Cam' : 'Bật Cam'}</span>
              </button>

              <button
                onClick={onBackToLobby}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Rời Lớp
              </button>
            </div>
          </div>
        </div>

        {/* Right: English Room Sidebar (Vocab Board / Chat / Topic Guide) */}
        <aside className="w-80 lg:w-96 glass-panel border-l border-white/10 flex flex-col h-full flex-shrink-0">
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
                <span className="font-bold text-white">📝 Từ Vựng Được Cô Ghim:</span>
                <span className="text-amber-400 font-mono text-[11px]">{vocabList.length} từ</span>
              </div>

              {isLeaderOrAdmin && (
                <form onSubmit={handleAddVocab} className="mb-3 flex gap-2">
                  <input
                    type="text"
                    value={newVocabInput}
                    onChange={(e) => setNewVocabInput(e.target.value)}
                    placeholder="Cô ghim từ mới (VD: Fluency: Độ trôi chảy)..."
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

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {vocabList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start justify-between gap-2 text-xs group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-bold text-indigo-300">{item.split(':')[0]}</p>
                      {item.split(':')[1] && (
                        <p className="text-slate-300 text-[11px]">{item.split(':')[1]}</p>
                      )}
                    </div>
                    {isLeaderOrAdmin && (
                      <button
                        onClick={() => {
                          setVocabList((prev) => prev.filter((_, i) => i !== idx));
                          onShowToast('Đã xóa từ vựng khỏi bảng ghim!', 'slate');
                        }}
                        className="opacity-60 hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer flex-shrink-0"
                        title="Xóa từ vựng này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Recap Exporter Button */}
              <div className="pt-3 border-t border-white/10 mt-2">
                <button
                  onClick={() => setIsRecapModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>📋 Xuất Tóm Tắt Buổi Học (Recap)</span>
                </button>
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

              {/* TÍNH NĂNG 6: Quick Comic Speech Phrases */}
              <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-300 border-t border-white/5">
                <span className="text-slate-500 font-semibold whitespace-nowrap">Bong bóng nói:</span>
                <button
                  onClick={() => handleQuickSpeech('Hello everyone! 👋')}
                  className="px-2 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 whitespace-nowrap cursor-pointer transition-all"
                >
                  Hello! 👋
                </button>
                <button
                  onClick={() => handleQuickSpeech("I'd like to answer! 🙋‍♂️")}
                  className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 whitespace-nowrap cursor-pointer transition-all"
                >
                  Em trả lời! 🙋‍♂️
                </button>
                <button
                  onClick={() => handleQuickSpeech('Great point! 💯')}
                  className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 whitespace-nowrap cursor-pointer transition-all"
                >
                  Hay quá! 💯
                </button>
              </div>

              <form onSubmit={handleSendChat} className="pt-2 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Gõ tin nhắn để hiện bong bóng thoại..."
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
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <strong>1.</strong> Can you introduce yourself and your English goals?
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <strong>2.</strong> What do you find most challenging when speaking English?
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <strong>3.</strong> How do you practice English every day?
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
        participants={wheelParticipants}
        onWinnerSelected={(winner) => {
          setLuckySpotlightId(winner.id);
          onShowToast(`🎉 ${winner.name} đã được chọn để mở mic luyện nói!`, 'amber');
          setTimeout(() => setLuckySpotlightId(null), 15000);
        }}
      />

      {/* Session Recap Modal */}
      <SessionRecapModal
        isOpen={isRecapModalOpen}
        room={room}
        vocabList={vocabList}
        participantsCount={participants.length + 1}
        onClose={() => setIsRecapModalOpen(false)}
        onShowToast={onShowToast}
      />
    </main>
  );
};
