import React from 'react';
import { FloatingEmoji } from '../types';

interface FloatingEmojiOverlayProps {
  emojis: FloatingEmoji[];
}

export const FloatingEmojiOverlay: React.FC<FloatingEmojiOverlayProps> = ({ emojis }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {emojis.map((item) => (
        <span
          key={item.id}
          className="absolute select-none animate-float"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            fontSize: `${item.size}px`,
            animation: 'floatUp 1.8s ease-out forwards',
          }}
        >
          {item.emoji}
        </span>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(0.8);
          }
          50% {
            transform: translateY(-80px) scale(1.3) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-160px) scale(1.6) rotate(-15deg);
          }
        }
      `}</style>
    </div>
  );
};
