import React, { useState } from 'react';
import type { ColorSwatch, VideoSourceOption } from '../types/optics';
import { Play, Pause, Volume2, VolumeX, Upload, Link as LinkIcon, Film, Check, Copy, Palette } from 'lucide-react';

interface VideoControlsBarProps {
  videoSources: VideoSourceOption[];
  activeVideoId: string;
  onSelectVideo: (id: string) => void;
  onUploadFile: (file: File) => void;
  onCustomUrl: (url: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  extractedPalette: ColorSwatch[];
  copiedHex: string | null;
  onCopyHex: (hex: string) => void;
}

export const VideoControlsBar: React.FC<VideoControlsBarProps> = ({
  videoSources,
  activeVideoId,
  onSelectVideo,
  onUploadFile,
  onCustomUrl,
  isPlaying,
  onTogglePlay,
  isMuted,
  onToggleMute,
  extractedPalette,
  copiedHex,
  onCopyHex,
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [clickedSwatchIdx, setClickedSwatchIdx] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onCustomUrl(inputUrl.trim());
      setShowUrlInput(false);
      setInputUrl('');
    }
  };

  const handleSwatchClick = (hex: string, idx: number) => {
    onCopyHex(hex);
    setClickedSwatchIdx(idx);
    setTimeout(() => setClickedSwatchIdx(null), 450);
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[min(94%,1040px)] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="rounded-2xl p-4 bg-zinc-950/85 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col gap-3 transition-all duration-300">
        
        {/* Top Control Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          {/* Playback Controls & Video Picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onTogglePlay}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={onToggleMute}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono transition-all duration-200 border border-white/10 hover:border-white/25 hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Built-in Video Presets */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              {videoSources.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onSelectVideo(v.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 ${
                    activeVideoId === v.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Film size={12} className={activeVideoId === v.id ? 'animate-pulse' : ''} />
                  <span>{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Video File Upload & URL buttons */}
          <div className="flex items-center gap-2">
            <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-2 border border-white/15 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95">
              <Upload size={14} className="text-cyan-400" />
              <span>Upload Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-2 border border-white/15 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            >
              <LinkIcon size={14} className="text-purple-400" />
              <span>Video URL</span>
            </button>
          </div>
        </div>

        {/* Video URL Input Box */}
        {showUrlInput && (
          <form onSubmit={handleUrlSubmit} className="flex gap-2 animate-fade-in">
            <input
              type="url"
              placeholder="Paste video URL (e.g. https://example.com/video.mp4)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-black border border-white/20 text-xs font-mono text-white outline-none focus:border-amber-400 transition-colors duration-200"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold font-mono text-xs transition-all duration-200 hover:bg-amber-400 hover:scale-105 active:scale-95"
            >
              Load Video
            </button>
          </form>
        )}

        {/* Live Extracted Refracted Video Palette Swatches */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 shrink-0">
            <Palette size={16} className="text-amber-400 animate-float" />
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              Real-Time Refracted Video Palette:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 w-full justify-end">
            {extractedPalette.map((swatch, idx) => {
              const isCopied = copiedHex === swatch.hex;
              return (
                <button
                  key={idx}
                  onClick={() => handleSwatchClick(swatch.hex, idx)}
                  className={`group relative flex-1 max-w-[130px] h-10 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none border border-white/25 overflow-hidden flex flex-col justify-between p-1.5 shadow-md ${
                    clickedSwatchIdx === idx ? 'animate-ping-once' : ''
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-mono font-bold text-black/80 bg-white/80 rounded px-1">
                      {swatch.wavelengthNm}nm
                    </span>
                    {isCopied ? (
                      <Check size={12} className="text-emerald-950 font-bold bg-white rounded-full p-0.5" />
                    ) : (
                      <Copy size={11} className="text-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-950 tracking-wider truncate w-full text-left bg-white/75 backdrop-blur-sm px-1 rounded">
                    {isCopied ? 'COPIED!' : swatch.hex}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
