import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import type { Song } from '../types/song';
import { MAJOR_KEYS, convertNashvilleToLetter } from '../utils/nashville';
import { LogoMark } from './LogoMark';
import { triggerHaptic } from '../utils/haptics';

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
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  
  // Persistent Light / Dark Mode Toggle
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('chordset_stage_theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    triggerHaptic(15);
    setThemeMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('chordset_stage_theme', next);
      } catch {
        // localStorage not available
      }
      return next;
    });
  };

  const isDarkMode = themeMode === 'dark';

  const scrollIntervalRef = useRef<number | null>(null);
  const lineElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Detect active line based on viewport position during auto-scroll
  const updateActiveLine = useCallback(() => {
    if (!isAutoScrolling) {
      setActiveLineId(null);
      return;
    }

    const targetY = window.innerHeight * 0.32; // Stage spotlight reading target zone (~30% down screen)
    let closestLineId: string | null = null;
    let closestDistance = Infinity;

    lineElementsRef.current.forEach((el, id) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - targetY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestLineId = id;
      }
    });

    if (closestLineId) {
      setActiveLineId(closestLineId);
    }
  }, [isAutoScrolling]);

  // Auto scroll effect using smooth animation interval
  useEffect(() => {
    if (isAutoScrolling) {
      updateActiveLine();

      scrollIntervalRef.current = window.setInterval(() => {
        window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
        updateActiveLine();
      }, 50);

      const handleScroll = () => {
        updateActiveLine();
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }
      };
    } else {
      setActiveLineId(null);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }
  }, [isAutoScrolling, scrollSpeed, updateActiveLine]);

  const chordSizeClasses = {
    normal: 'text-2xl sm:text-3xl',
    large: 'text-3xl sm:text-4xl md:text-5xl',
    xlarge: 'text-4xl sm:text-5xl md:text-6xl',
  };

  const lyricsSizeClasses = {
    normal: 'text-xs sm:text-sm',
    large: 'text-sm sm:text-base',
    xlarge: 'text-base sm:text-lg',
  };

  return (
    <div className={`min-h-screen font-sans select-none pb-48 relative w-full max-w-full overflow-x-hidden transition-colors duration-200 ${
      isDarkMode ? 'bg-[#100D0A] text-[#F7F4EB]' : 'bg-[#F7F4EB] text-[#171310]'
    }`}>
      
      {/* Fixed Stage Toolbar */}
      <header className={`fixed top-0 left-0 w-full z-50 px-3.5 sm:px-6 py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 max-w-full border-b-2 transition-colors duration-200 ${
        isDarkMode ? 'bg-[#100D0A] border-[#241D17]' : 'bg-[#F7F4EB] border-[#D9D2C0]'
      }`}>
        {/* Row 1 / Left Info Area */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onExit();
              }}
              className={`p-2 min-w-[44px] min-h-[44px] rounded-md transition-all duration-150 hover:scale-105 active:scale-95 shrink-0 border flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                  : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#D9D2C0]'
              }`}
              title="Exit Stage Mode"
            >
              <ArrowLeft size={18} />
            </button>
            <LogoMark size={28} theme={isDarkMode ? 'dark' : 'light'} />
            <div className="min-w-0">
              <h1 
                className="font-mono text-base sm:text-lg font-bold truncate tracking-tight"
                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              >
                {song.title}
              </h1>
              <div className={`flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold truncate ${
                isDarkMode ? 'text-[#A89C8E]' : 'text-[#7A6E62]'
              }`}>
                <span className="text-[#E8432E]">Key {stageKey}</span>
                {song.bpm && <span>• {song.bpm} BPM</span>}
                {song.timeSignature && <span className="hidden xs:inline">• {song.timeSignature}</span>}
              </div>
            </div>
          </div>

          {/* Mobile Direct "Done" Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              onExit();
            }}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className={`sm:hidden px-4 py-2 min-h-[44px] font-mono text-xs font-bold rounded-md transition-all duration-150 hover:scale-105 active:scale-95 shrink-0 border flex items-center justify-center ${
              isDarkMode 
                ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#D9D2C0]'
            }`}
            title="Done"
          >
            DONE
          </button>
        </div>

        {/* Row 2 on Mobile / Right Tools on Desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 text-xs w-full sm:w-auto overflow-x-auto pb-0.5 sm:pb-0 font-mono font-bold">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 min-h-[44px] sm:px-3 sm:py-2 rounded-md flex items-center justify-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 shrink-0 border ${
              isDarkMode 
                ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#D9D2C0]'
            }`}
            title={isDarkMode ? 'Switch to Light paper mode' : 'Switch to Dark stage mode'}
          >
            {isDarkMode ? <Sun size={15} className="text-[#D9A62E]" /> : <Moon size={15} className="text-[#171310]" />}
            <span className="hidden md:inline text-[11px] uppercase font-bold">{isDarkMode ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Nashville ↔ Letters Toggle */}
          <div className={`flex items-center rounded-md p-0.5 min-h-[44px] shrink-0 border ${
            isDarkMode ? 'bg-[#241D17] border-[#3D332A]' : 'bg-white border-[#D9D2C0]'
          }`}>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setDisplayMode('nashville');
              }}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              className={`px-3 py-2 min-h-[36px] rounded transition-all duration-150 text-[11px] sm:text-xs flex items-center justify-center ${
                displayMode === 'nashville'
                  ? 'bg-[#E8432E] text-[#F7F4EB]'
                  : isDarkMode ? 'text-[#A89C8E] hover:text-[#F7F4EB]' : 'text-[#7A6E62] hover:text-[#171310]'
              }`}
            >
              1-4-5
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setDisplayMode('letters');
              }}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              className={`px-3 py-2 min-h-[36px] rounded transition-all duration-150 text-[11px] sm:text-xs flex items-center justify-center ${
                displayMode === 'letters'
                  ? 'bg-[#E8432E] text-[#F7F4EB]'
                  : isDarkMode ? 'text-[#A89C8E] hover:text-[#F7F4EB]' : 'text-[#7A6E62] hover:text-[#171310]'
              }`}
            >
              CHORDS
            </button>
          </div>

          {displayMode === 'letters' && (
            <select
              value={stageKey}
              onChange={(e) => {
                triggerHaptic(10);
                setStageKey(e.target.value);
              }}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              className={`px-2.5 py-2 min-h-[44px] rounded-md text-[11px] sm:text-xs font-mono font-bold focus:outline-none cursor-pointer shrink-0 border ${
                isDarkMode 
                  ? 'bg-[#241D17] text-[#F7F4EB] border-[#3D332A]' 
                  : 'bg-white text-[#171310] border-[#D9D2C0]'
              }`}
            >
              {MAJOR_KEYS.map(k => (
                <option key={k} value={k}>Key {k}</option>
              ))}
            </select>
          )}

          {/* Zoom Controls */}
          <div className={`flex items-center rounded-md p-0.5 min-h-[44px] shrink-0 border ${
            isDarkMode ? 'bg-[#241D17] border-[#3D332A]' : 'bg-white border-[#D9D2C0]'
          }`}>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                if (fontSizeLevel === 'xlarge') setFontSizeLevel('large');
                else if (fontSizeLevel === 'large') setFontSizeLevel('normal');
              }}
              className={`p-2.5 min-w-[36px] min-h-[36px] rounded transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center ${
                isDarkMode ? 'text-[#A89C8E] hover:text-[#F7F4EB] hover:bg-[#332A22]' : 'text-[#7A6E62] hover:text-[#171310] hover:bg-[#F3EFE3]'
              }`}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                if (fontSizeLevel === 'normal') setFontSizeLevel('large');
                else if (fontSizeLevel === 'large') setFontSizeLevel('xlarge');
              }}
              className={`p-2.5 min-w-[36px] min-h-[36px] rounded transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center ${
                isDarkMode ? 'text-[#A89C8E] hover:text-[#F7F4EB] hover:bg-[#332A22]' : 'text-[#7A6E62] hover:text-[#171310] hover:bg-[#F3EFE3]'
              }`}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Primary Action: Solid Vermilion Scroll Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setIsAutoScrolling(!isAutoScrolling);
            }}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className="px-4 py-2 min-h-[44px] rounded-md text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 shrink-0 bg-[#E8432E] hover:bg-[#D03522] text-[#F7F4EB] border border-[#E8432E]"
            title={isAutoScrolling ? 'Pause auto-scroll' : 'Start auto-scroll'}
          >
            {isAutoScrolling ? <Pause size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
            <span>{isAutoScrolling ? 'PAUSE' : 'SCROLL'}</span>
          </button>

          {/* Desktop "Done" Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              onExit();
            }}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className={`hidden sm:inline-flex px-4 py-2 min-h-[44px] font-mono text-xs font-bold rounded-md transition-all duration-150 hover:scale-105 active:scale-95 shrink-0 border items-center justify-center ${
              isDarkMode 
                ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#D9D2C0]'
            }`}
            title="Done (Exit Stage Mode)"
          >
            DONE
          </button>
        </div>
      </header>

      {/* Main Content Area (Connected by a continuous left-margin vertical rule) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-10 pt-28 sm:pt-24 w-full max-w-full overflow-x-hidden">
        <div className={`relative pl-4 sm:pl-7 border-l ml-1 sm:ml-3 space-y-8 sm:space-y-10 transition-colors ${
          isDarkMode ? 'border-[#2A2420]' : 'border-[#D9D2C0]'
        }`}>
          {song.sections.map((section, secIdx) => {
            const formattedSecIndex = String(secIdx + 1).padStart(2, '0');

            return (
              <section key={section.id} className="flex flex-col gap-3">
                
                {/* Section Header Label with Mustard Sequence Monospace Badge */}
                <div className="flex items-baseline gap-2.5">
                  <span 
                    className="font-mono text-xs font-black bg-[#D9A62E] text-[#100D0A] px-2 py-0.5 rounded border border-[#171310] shrink-0"
                    style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 900 }}
                  >
                    {formattedSecIndex}
                  </span>
                  <span 
                    className={`font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                      isDarkMode 
                        ? 'text-[#F7F4EB] bg-[#241D17] border-[#3D332A]' 
                        : 'text-[#171310] bg-white border-[#D9D2C0]'
                    }`}
                    style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                  >
                    {section.label || section.type}
                  </span>
                </div>

                {/* Section Lines */}
                <div className="flex flex-col gap-4">
                  {section.lines.map((line) => {
                    const lineKey = `${section.id}-${line.id}`;
                    const isActive = isAutoScrolling && activeLineId === lineKey;

                    return (
                      <div
                        key={line.id}
                        ref={(el) => {
                          if (el) lineElementsRef.current.set(lineKey, el);
                          else lineElementsRef.current.delete(lineKey);
                        }}
                        className={`flex flex-col gap-1.5 pl-3 sm:pl-4 pr-3 py-2 rounded-r-md transition-all duration-200 border-l-[5px] ${
                          isActive 
                            ? `border-l-[#E8432E] ${isDarkMode ? 'bg-[#1A1512]' : 'bg-[#EFE9D9]'}` 
                            : 'border-l-transparent bg-transparent'
                        }`}
                      >
                        {/* Continuous Chord Row Sitting Directly on Baseline Rule with Barline Ticks */}
                        <div className={`flex flex-wrap items-baseline gap-x-5 sm:gap-x-8 gap-y-2 pb-2 transition-colors ${
                          isActive 
                            ? 'border-b-2 border-b-[#E8432E]' 
                            : isDarkMode ? 'border-b border-[#2A2420]' : 'border-b border-[#D9D2C0]'
                        }`}>
                          {line.chords.map((chord, cIdx) => {
                            const displayChord = displayMode === 'letters'
                              ? convertNashvilleToLetter(chord, stageKey)
                              : chord;

                            return (
                              <div key={cIdx} className="inline-flex items-baseline gap-5 sm:gap-8">
                                {/* Chord Text: Bold Monospace, Unboxed */}
                                <span
                                  style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                                  className={`font-mono font-bold tracking-wider select-none leading-none ${chordSizeClasses[fontSizeLevel]} ${
                                    isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
                                  }`}
                                >
                                  {displayChord}
                                </span>

                                {/* Thin Barline Tick between individual chords */}
                                {cIdx < line.chords.length - 1 && (
                                  <span
                                    className={`self-center h-4 sm:h-6 w-[1px] opacity-70 ${
                                      isActive
                                        ? 'bg-[#E8432E]'
                                        : isDarkMode ? 'bg-[#2A2420]' : 'bg-[#D9D2C0]'
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Lyrics / Annotations: Warm gray, italic, Inter beneath chord line */}
                        {line.lyrics ? (
                          <p className={`font-sans italic font-normal leading-relaxed pt-0.5 ${lyricsSizeClasses[fontSizeLevel]} ${
                            isDarkMode ? 'text-[#A89C8E]' : 'text-[#7A6E62]'
                          }`}>
                            {line.lyrics}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Floating Auto-Scroll Speed Selector when active (With pb-safe support) */}
      {isAutoScrolling && (
        <div className={`fixed bottom-6 right-6 z-50 border-2 rounded-md p-3 flex items-center gap-2.5 text-xs font-mono font-bold ${
          isDarkMode 
            ? 'bg-[#1A1512] border-[#3D332A] text-[#F7F4EB]' 
            : 'bg-white border-[#D9D2C0] text-[#171310]'
        }`}>
          <span className="text-[#E8432E] uppercase">Speed:</span>
          {[1, 2, 3, 4].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setScrollSpeed(spd);
              }}
              className={`w-9 h-9 min-w-[36px] min-h-[36px] rounded-md font-bold transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center ${
                scrollSpeed === spd
                  ? 'bg-[#E8432E] text-[#F7F4EB]'
                  : isDarkMode 
                    ? 'bg-[#241D17] text-[#D8CDC0] hover:bg-[#332A22] hover:text-[#F7F4EB]' 
                    : 'bg-[#F3EFE3] text-[#7A6E62] hover:bg-[#EDE8DA] hover:text-[#171310]'
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
