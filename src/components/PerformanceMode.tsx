import React, { useState, useEffect, useRef } from 'react';
import { 
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
  const [scrollSpeed, setScrollSpeed] = useState(1);
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
    normal: 'text-3xl sm:text-4xl',
    large: 'text-4xl sm:text-5xl',
    xlarge: 'text-5xl sm:text-6xl',
  };

  const lyricsSizeClasses = {
    normal: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    xlarge: 'text-xl sm:text-2xl',
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans select-none pb-48 relative w-full max-w-full overflow-x-hidden">
      
      {/* Fixed Stage Toolbar (Responsive 2-Tier on Mobile / Single Row on Tablet & Desktop) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white/20 px-3.5 sm:px-6 py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 max-w-full">
        {/* Row 1 / Left Info Area */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onExit}
              className="p-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors duration-150 shrink-0"
              title="Exit Stage Mode"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black text-white truncate uppercase tracking-tight font-sans">
                {song.title}
              </h1>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-neutral-400 uppercase font-bold truncate">
                <span className="text-[#FF3000]">KEY {stageKey}</span>
                {song.bpm && <span>// {song.bpm} BPM</span>}
                {song.timeSignature && <span className="hidden xs:inline">// {song.timeSignature}</span>}
              </div>
            </div>
          </div>

          {/* Mobile Direct "DONE" Button */}
          <button
            type="button"
            onClick={onExit}
            className="sm:hidden px-3 py-1 border-2 border-white bg-black text-white hover:bg-white hover:text-black text-xs font-mono font-black uppercase tracking-wider transition-colors duration-150 shrink-0"
            title="Done"
          >
            DONE
          </button>
        </div>

        {/* Row 2 on Mobile / Right Tools on Desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 font-mono text-xs w-full sm:w-auto overflow-x-auto pb-0.5 sm:pb-0">
          {/* Nashville ↔ Letters Toggle */}
          <div className="flex items-center border border-white shrink-0">
            <button
              type="button"
              onClick={() => setDisplayMode('nashville')}
              className={`px-2.5 sm:px-3 py-1 font-black uppercase transition-colors duration-150 text-[11px] sm:text-xs ${
                displayMode === 'nashville'
                  ? 'bg-white text-black'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              1-4-5
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('letters')}
              className={`px-2.5 sm:px-3 py-1 font-black uppercase transition-colors duration-150 text-[11px] sm:text-xs ${
                displayMode === 'letters'
                  ? 'bg-[#FF3000] text-white'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              CHORDS
            </button>
          </div>

          {displayMode === 'letters' && (
            <select
              value={stageKey}
              onChange={(e) => setStageKey(e.target.value)}
              className="px-2 py-1 bg-black border border-white text-[11px] sm:text-xs font-mono font-black text-white uppercase focus:outline-none cursor-pointer shrink-0"
            >
              {MAJOR_KEYS.map(k => (
                <option key={k} value={k}>Key {k}</option>
              ))}
            </select>
          )}

          {/* Zoom */}
          <div className="flex items-center border border-white shrink-0">
            <button
              type="button"
              onClick={() => {
                if (fontSizeLevel === 'xlarge') setFontSizeLevel('large');
                else if (fontSizeLevel === 'large') setFontSizeLevel('normal');
              }}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (fontSizeLevel === 'normal') setFontSizeLevel('large');
                else if (fontSizeLevel === 'large') setFontSizeLevel('xlarge');
              }}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Auto Scroll */}
          <button
            type="button"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-black uppercase flex items-center gap-1 sm:gap-1.5 border transition-colors duration-150 shrink-0 ${
              isAutoScrolling
                ? 'bg-[#FF3000] text-white border-[#FF3000]'
                : 'bg-black text-white border-white hover:bg-neutral-800'
            }`}
          >
            {isAutoScrolling ? <Pause size={12} /> : <Play size={12} />}
            <span>SCROLL</span>
          </button>

          {/* Desktop Outlined White "DONE" Button */}
          <button
            type="button"
            onClick={onExit}
            className="hidden sm:inline-flex px-4 py-1 border-2 border-white bg-black text-white hover:bg-white hover:text-black text-xs font-mono font-black uppercase tracking-wider transition-colors duration-150 shrink-0"
            title="Done (Exit Stage Mode)"
          >
            DONE
          </button>
        </div>
      </header>

      {/* Main Content Area (Maximum Legibility for Stage Use) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-10 pt-28 sm:pt-24 space-y-12 sm:space-y-16 w-full max-w-full overflow-x-hidden">
        {song.sections.map((section, secIdx) => {
          const formattedSecIndex = String(secIdx + 1).padStart(2, '0');

          return (
            <section key={section.id} className="flex flex-col gap-6 border-l-4 border-white/20 pl-6 focus-within:border-[#FF3000]">
              
              {/* Section Header Label with Swiss Red Index */}
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-black text-[#FF3000]">
                  {formattedSecIndex}
                </span>
                <span className="font-mono text-xs font-black uppercase tracking-widest text-white bg-white/10 px-2 py-0.5 border border-white/20">
                  {section.label || section.type}
                </span>
              </div>

              {/* Section Lines */}
              <div className="flex flex-col gap-8">
                {section.lines.map((line) => (
                  <div key={line.id} className="flex flex-col gap-2">
                    
                    {/* Big Chords in Solid White Black 900 Weight */}
                    <div className="flex flex-wrap gap-x-10 gap-y-3 items-baseline">
                      {line.chords.map((chord, cIdx) => {
                        const displayChord = displayMode === 'letters'
                          ? convertNashvilleToLetter(chord, stageKey)
                          : chord;

                        return (
                          <span
                            key={cIdx}
                            className={`font-sans font-black tracking-wider text-white ${chordSizeClasses[fontSizeLevel]}`}
                          >
                            {displayChord}
                          </span>
                        );
                      })}
                    </div>

                    {/* Lyrics Beneath in Regular 400 Weight Light Gray */}
                    {line.lyrics ? (
                      <p className={`font-sans font-normal text-neutral-300 leading-relaxed ${lyricsSizeClasses[fontSizeLevel]}`}>
                        {line.lyrics}
                      </p>
                    ) : (
                      <div className="h-1" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating Auto-Scroll Speed Selector when active */}
      {isAutoScrolling && (
        <div className="fixed bottom-6 right-6 z-50 bg-black border-2 border-white p-3 flex items-center gap-3 font-mono text-xs shadow-2xl">
          <span className="text-[#FF3000] font-black">SPEED:</span>
          {[1, 2, 3, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setScrollSpeed(spd)}
              className={`w-7 h-7 font-black transition-colors ${
                scrollSpeed === spd
                  ? 'bg-[#FF3000] text-white border border-[#FF3000]'
                  : 'bg-black text-white border border-white hover:bg-neutral-800'
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
