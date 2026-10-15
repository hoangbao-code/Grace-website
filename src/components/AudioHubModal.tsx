import React, { useState } from 'react';
import { X, Sliders, Play, Volume2, CloudRain, Wind, Waves, Radio } from 'lucide-react';
import { MusicTrack } from '../types';
import { audioEngine } from '../services/audioService';

interface AudioHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: MusicTrack | null;
  musicTracks: MusicTrack[];
  masterVolume: number;
  onSetMasterVolume: (vol: number) => void;
  onPlayTrack: (track: MusicTrack) => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const AudioHubModal: React.FC<AudioHubModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  musicTracks,
  masterVolume,
  onSetMasterVolume,
  onPlayTrack,
  onShowToast,
}) => {
  const [youtubeInput, setYoutubeInput] = useState<string>('');
  const [rainVol, setRainVol] = useState<number>(0);
  const [brownVol, setBrownVol] = useState<number>(0);
  const [alphaVol, setAlphaVol] = useState<number>(0);

  if (!isOpen) return null;

  const handleRainChange = (val: number) => {
    setRainVol(val);
    audioEngine.setRainVolume(val);
  };

  const handleBrownChange = (val: number) => {
    setBrownVol(val);
    audioEngine.setBrownNoiseVolume(val);
  };

  const handleAlphaChange = (val: number) => {
    setAlphaVol(val);
    audioEngine.setAlphaWavesVolume(val);
  };

  // Extract YouTube ID from link
  const handlePlayCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeInput.trim()) return;

    let videoId = youtubeInput.trim();
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1].split('&')[0];
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1].split('?')[0];
    }

    const customTrack: MusicTrack = {
      id: `custom-${Date.now()}`,
      title: 'Tự chọn theo link YouTube',
      artist: 'Người dùng phát',
      duration: 'Custom',
      category: 'custom',
      youtubeId: videoId,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    };

    onPlayTrack(customTrack);
    setYoutubeInput('');
    onShowToast('Đang kết nối luồng phát video YouTube...', 'emerald');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Trạm Hòa Âm & Kho Nhạc Tập Trung</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  WEB AUDIO SYNTH
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Phát video YouTube kết hợp tiếng ồn trắng và sóng não Alpha để tối ưu tập trung.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top: YouTube Player Frame & Link Paste */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Player */}
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden border border-white/10 relative shadow-2xl">
              {currentTrack ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1`}
                  title={currentTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                  <Radio className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
                  <span>Chưa phát bài hát nào. Chọn bài bên dưới hoặc dán link YouTube.</span>
                </div>
              )}
            </div>

            {/* Paste Link Form */}
            <form onSubmit={handlePlayCustomUrl} className="flex gap-2">
              <input
                type="text"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder="Dán link YouTube (VD: https://youtube.com/watch?v=...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Phát
              </button>
            </form>
          </div>

          {/* Ambient Soundscape Synthesizer Mixer */}
          <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-white/5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Bộ Trộn Âm Thanh Thiên Nhiên (Ambient Synthesizer)</span>
            </h4>

            {/* Rain */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <span>Tiếng Mưa Rơi (Pink Noise)</span>
                </span>
                <span className="font-mono text-slate-400 text-[11px]">{rainVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainVol}
                onChange={(e) => handleRainChange(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Brown Noise */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Wind className="w-4 h-4 text-amber-400" />
                  <span>Brown Noise (Trầm sâu, lọc tạp âm)</span>
                </span>
                <span className="font-mono text-slate-400 text-[11px]">{brownVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={brownVol}
                onChange={(e) => handleBrownChange(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Alpha Waves 10Hz */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Waves className="w-4 h-4 text-purple-400" />
                  <span>Sóng Não Alpha 10Hz (Binaural Beats)</span>
                </span>
                <span className="font-mono text-slate-400 text-[11px]">{alphaVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={alphaVol}
                onChange={(e) => handleAlphaChange(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Master Volume */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-white font-bold">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Tổng âm lượng hệ thống</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">{masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => onSetMasterVolume(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Curated Fast Playlist Track Select */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Gợi ý nhạc học tập nhanh
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {musicTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  currentTrack?.id === track.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{track.title}</p>
                    <span className="text-[10px] text-slate-400">{track.artist}</span>
                  </div>
                </div>
                <Play className="w-4 h-4 flex-shrink-0 text-emerald-400 fill-current" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
