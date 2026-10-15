import React, { useState } from 'react';
import { X, Sparkles, Trophy, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: { id: string; name: string; avatarText: string }[];
  onWinnerSelected: (winner: { id: string; name: string; avatarText: string }) => void;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  participants,
  onWinnerSelected,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [winner, setWinner] = useState<{ id: string; name: string; avatarText: string } | null>(null);

  if (!isOpen) return null;

  const segmentColors = [
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#06B6D4', // Cyan
  ];

  const handleSpin = () => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    // Pick random winner index
    const randomIndex = Math.floor(Math.random() * participants.length);
    const chosenWinner = participants[randomIndex];

    // Compute angle
    const segmentAngle = 360 / participants.length;
    // Rotate 5 full turns (1800deg) + offset to align top pointer
    // Pointer is at the top (270deg / -90deg)
    const extraRounds = 360 * 6; // 6 rounds
    const targetAngle = extraRounds + (360 - (randomIndex * segmentAngle + segmentAngle / 2));

    const finalAngle = rotation + targetAngle;
    setRotation(finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(chosenWinner);
      onWinnerSelected(chosenWinner);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#06B6D4'],
      });
    }, 4200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VÒNG QUAY MAY MẮN • CHỌN NGƯỜI LUYỆN NÓI</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Ai Là Người Tiếp Theo Bật Mic?
          </h3>
          <p className="text-xs text-slate-400">
            Quay số ngẫu nhiên để chọn học viên may mắn trả lời câu hỏi của Host
          </p>
        </div>

        {/* The Wheel */}
        <div className="relative flex items-center justify-center my-4">
          {/* Top Pointer Indicator */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 filter drop-shadow-[0_4px_8px_rgba(245,158,11,0.8)]" />

          {/* Rotating Wheel Container */}
          <div
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full relative p-2 shadow-[0_0_40px_rgba(99,102,241,0.3)] border-4 border-amber-400/40 bg-slate-950 overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,0.85,0.1,1)]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* SVG Wheel segments */}
            <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
              {participants.map((p, idx) => {
                const total = participants.length;
                const angle = 360 / total;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                // SVG Arc coordinates
                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                const largeArc = angle > 180 ? 1 : 0;

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
                const textAngle = startAngle + angle / 2;

                return (
                  <g key={p.id}>
                    <path
                      d={pathData}
                      fill={segmentColors[idx % segmentColors.length]}
                      stroke="#0B0F19"
                      strokeWidth="1"
                    />
                    {/* Text Label on segment */}
                    <text
                      x="50"
                      y="18"
                      fill="#FFFFFF"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${textAngle}, 50, 50)`}
                      className="select-none uppercase tracking-tighter"
                    >
                      {p.name.split(' ').slice(-1)[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950 border-4 border-amber-400 flex items-center justify-center z-10 shadow-xl">
              <span className="text-base font-extrabold text-amber-400">🎲</span>
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && !isSpinning && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/40 text-center space-y-1 animate-bounce">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Người Được Chọn Tỏa Sáng</span>
            </div>
            <p className="text-lg font-black text-white">
              🎉 {winner.name} ({winner.avatarText}) 🎉
            </p>
            <p className="text-xs text-slate-300">
              Hãy mở micro và bắt đầu câu trả lời phản xạ của bạn!
            </p>
          </div>
        )}

        {/* Spin Action Button */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-xl flex items-center gap-2 cursor-pointer ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/30 hover:scale-105 active:scale-95'
            }`}
          >
            <span>{isSpinning ? 'Đang Quay Tít Mù... 🌀' : 'BẮT ĐẦU QUAY 🎲'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
