import React from 'react';
import { Sparkles } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-950/90 border-indigo-500/40 text-indigo-200',
    emerald: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
    amber: 'bg-amber-950/90 border-amber-500/40 text-amber-200',
    rose: 'bg-rose-950/90 border-rose-500/40 text-rose-200',
    slate: 'bg-slate-900/90 border-slate-600/40 text-slate-200',
  };

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300 pointer-events-auto animate-bounce-short ${
            colorClasses[toast.type || 'indigo']
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
