import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  ArrowLeft
} from 'lucide-react';
import type { Song } from '../types/song';
import { MAJOR_KEYS, convertNashvilleToLetter } from '../utils/nashville';

interface PerformanceModeProps {
  song: Song;
  onExit: () => void;
}

export const PerformanceMode: React.FC<PerformanceModeProps> = ({
  song,
  onExit,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [displayMode, setDisplayMode] = useState<'nashville' | 'letters'>('nashville');
  const [stageKey, setStageKey] = useState<string>(song.key || 'G');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1); // px per tick
  const scrollIntervalRef = useRef<number | null>(null);

  // Auto scroll effect
  useEffect(() => {
    if (isAutoScrolling) {
      scrollIntervalRef.current = window.setInterval(() => {
        window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
      }, 50);
    } else if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  const chordSizeClasses = {
    normal: 'text-2xl sm:text-3xl',
    large: 'text-3xl sm:text-4xl',
    xlarge: 'text-4xl sm:text-5xl',
  };

  const lyricsSizeClasses = {
    normal: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    xlarge: 'text-xl sm:text-2xl',
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] font-sans select-none pb-48 relative">
      
      {/* Background Atmospheric Blur Orbs from Stitch */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#d4af37]/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#393939]/20 blur-[150px] mix-blend-screen" />
      </div>

      {/* Floating Top App Bar matching Stitch */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onExit}
            className="p-2 rounded-full text-[#f2ca50] hover:bg-white/10 transition-colors"
            title="Exit Stage Mode"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-white truncate tracking-tight">
              {song.title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#d0c5af]">
              <span>Key of {stageKey}</span>
              {song.bpm && <span>• {song.bpm} BPM</span>}
            </div>
          </div>
        </div>

        {/* Stage Tools */}
        <div className="flex items-center gap-2">
          {/* Nashville ↔ Letters Toggle */}
          <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setDisplayMode('nashville')}
              className={`px-3 py-1 rounded-full transition-all font-bold ${
                displayMode === 'nashville'
                  ? 'bg-[#f2ca50] text-[#121212]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              1-4-5
            </button>
            <button
              onClick={() => setDisplayMode('letters')}
              className={`px-3 py-1 rounded-full transition-all font-bold ${
                displayMode === 'letters'
                  ? 'bg-cyan-400 text-[#121212]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Letters
            </button>
          </div>

          {displayMode === 'letters' && (
            <select
              value={stageKey}
              onChange={(e) => setStageKey(e.target.value)}
              className="px-2.5 py-1 rounded-full bg-[#1c1b1b] border border-cyan-500/35 text-xs font-mono font-bold text-cyan-300 focus:outline-none"
            >
              {MAJOR_KEYS.map(k => (
                <option key={k} value={k}>Key {k}</option>
              ))}
            </select>
          )}

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => {
                if (fontSizeLevel === 'xlarge') setFontSizeLevel('large');
                else if (fontSizeLevel === 'large') setFontSizeLevel('normal');
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={() => {
                if (fontSizeLevel === 'normal') setFontSizeLevel('large');
                else if (fontSizeLevel === 'large') setFontSizeLevel('xlarge');
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Auto Scroll */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isAutoScrolling
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400 animate-pulse'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {isAutoScrolling ? <Pause size={13} /> : <Play size={13} />}
            <span className="hidden sm:inline">Scroll</span>
          </button>

          <button
            onClick={onExit}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
            title="Exit"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area matching Stitch Performance Mode */}
      <main className="max-w-3xl mx-auto px-6 sm:px-10 pt-24 space-y-12 relative z-10">
        {song.sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-6">
              {/* Section Header Badge matching Stitch */}
              <div className="inline-flex items-center gap-2">
                <span className="font-label-caps text-xs font-extrabold text-[#121212] bg-[#f2ca50] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {section.label || section.type}
                </span>
              </div>

              {/* Section Lines matching Stitch */}
              <div className="flex flex-col gap-6">
                {section.lines.map((line) => (
                  <div key={line.id} className="flex flex-col gap-2">
                    
                    {/* Big Chords Row with chord-glow */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 items-baseline">
                      {line.chords.map((chord, cIdx) => {
                        const displayChord = displayMode === 'letters'
                          ? convertNashvilleToLetter(chord, stageKey)
                          : chord;

                        return (
                          <span
                            key={cIdx}
                            className={`font-chord-display font-extrabold tracking-wider ${
                              displayMode === 'letters' ? 'text-cyan-300' : 'text-[#f2ca50]'
                            } chord-glow ${chordSizeClasses[fontSizeLevel]}`}
                          >
                            {displayChord}
                          </span>
                        );
                      })}
                    </div>

                    {/* Aligned Lyrics Text matching Stitch */}
                    {line.lyrics ? (
                      <p className={`font-sans font-medium text-white leading-relaxed ${lyricsSizeClasses[fontSizeLevel]}`}>
                        {line.lyrics}
                      </p>
                    ) : (
                      <div className="h-1" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
      </main>

      {/* Floating Auto-Scroll Speed Selector when active */}
      {isAutoScrolling && (
        <div className="fixed bottom-6 right-6 z-50 glass-modal rounded-2xl p-3 shadow-2xl flex items-center gap-3 font-mono text-xs animate-fade-in-up">
          <span className="text-emerald-400 font-bold">Speed:</span>
          {[1, 2, 3, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setScrollSpeed(spd)}
              className={`w-7 h-7 rounded-lg font-bold transition-all ${
                scrollSpeed === spd
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-white/5 text-zinc-300 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
