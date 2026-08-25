import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Star, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  AlignLeft,
  X,
  Sun,
  Moon
} from 'lucide-react';
import type { Song, SongSection, SongLine, SectionType, SelectedChordSlot } from '../types/song';
import { MAJOR_KEYS } from '../utils/nashville';
import { SectionTypePickerModal } from './SectionTypePickerModal';
import { NashvilleNumberPad } from './NashvilleNumberPad';
import { LogoMark } from './LogoMark';
import { triggerHaptic } from '../utils/haptics';

interface SongEditorProps {
  song: Song;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onUpdateSong: (updatedSong: Song) => void;
  onBack: () => void;
  onLaunchPerformance: () => void;
  onToggleFavorite: (songId: string) => void;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  song,
  theme = 'light',
  onToggleTheme,
  onUpdateSong,
  onBack,
  onLaunchPerformance,
  onToggleFavorite,
}) => {
  const isDarkMode = theme === 'dark';
  const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedChordSlot | null>(null);

  // Helper to update song
  const mutateSong = (updater: (prev: Song) => Song) => {
    const updated = updater(song);
    onUpdateSong(updated);
  };

  // Section Management
  const handleAddSection = (type: SectionType, defaultLabel: string) => {
    triggerHaptic(20);
    const countOfType = song.sections.filter(s => s.type === type).length;
    const label = countOfType > 0 ? `${defaultLabel} ${countOfType + 1}` : defaultLabel;
    
    const newSection: SongSection = {
      id: `sec-${Date.now()}`,
      type,
      label,
      lines: [
        {
          id: `line-${Date.now()}-1`,
          chords: ['1', '4', '5', '1'],
          lyrics: '',
        }
      ]
    };

    mutateSong(s => ({
      ...s,
      sections: [...s.sections, newSection]
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === song.sections.length - 1) return;

    triggerHaptic(20);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...song.sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    mutateSong(s => ({ ...s, sections: reordered }));
  };

  const handleDeleteSection = (sectionId: string) => {
    triggerHaptic(20);
    mutateSong(s => ({
      ...s,
      sections: s.sections.filter(sec => sec.id !== sectionId)
    }));
    if (selectedSlot?.sectionId === sectionId) {
      setSelectedSlot(null);
    }
  };

  // Line Management
  const handleAddLine = (sectionId: string) => {
    triggerHaptic(15);
    const newLine: SongLine = {
      id: `line-${Date.now()}`,
      chords: ['1', '5', '6m', '4'],
      lyrics: '',
    };

    mutateSong(s => ({
      ...s,
      sections: s.sections.map(sec => {
        if (sec.id === sectionId) {
          return { ...sec, lines: [...sec.lines, newLine] };
        }
        return sec;
      })
    }));
  };

  const handleDeleteLine = (sectionId: string, lineId: string) => {
    triggerHaptic(15);
    mutateSong(s => ({
      ...s,
      sections: s.sections.map(sec => {
        if (sec.id === sectionId) {
          return { ...sec, lines: sec.lines.filter(l => l.id !== lineId) };
        }
        return sec;
      })
    }));
    if (selectedSlot?.lineId === lineId) {
      setSelectedSlot(null);
    }
  };

  // Lyric updates
  const handleUpdateLyrics = (sectionId: string, lineId: string, text: string) => {
    mutateSong(s => ({
      ...s,
      sections: s.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lines: sec.lines.map(line => {
              if (line.id === lineId) {
                return { ...line, lyrics: text };
              }
              return line;
            })
          };
        }
        return sec;
      })
    }));
  };

  // Chord Slot Management
  const handleSelectChordSlot = (sectionId: string, lineId: string, chordIndex: number) => {
    triggerHaptic(15);
    setSelectedSlot({ sectionId, lineId, chordIndex });
  };

  const handleUpdateActiveChord = (newChord: string) => {
    if (!selectedSlot) return;
    const { sectionId, lineId, chordIndex } = selectedSlot;

    mutateSong(s => ({
      ...s,
      sections: s.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lines: sec.lines.map(line => {
              if (line.id === lineId) {
                const nextChords = [...line.chords];
                nextChords[chordIndex] = newChord;
                return { ...line, chords: nextChords };
              }
              return line;
            })
          };
        }
        return sec;
      })
    }));
  };

  const handleAddChordSlotToLine = (sectionId: string, lineId: string) => {
    triggerHaptic(15);
    mutateSong(s => ({
      ...s,
      sections: s.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lines: sec.lines.map(line => {
              if (line.id === lineId) {
                return { ...line, chords: [...line.chords, '1'] };
              }
              return line;
            })
          };
        }
        return sec;
      })
    }));

    // Auto select the new slot
    const sec = song.sections.find(s => s.id === sectionId);
    const line = sec?.lines.find(l => l.id === lineId);
    if (line) {
      setSelectedSlot({
        sectionId,
        lineId,
        chordIndex: line.chords.length,
      });
    }
  };

  const handleDeleteChordSlot = (sectionId: string, lineId: string, chordIndex: number) => {
    triggerHaptic(15);
    mutateSong(s => ({
      ...s,
      sections: s.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lines: sec.lines.map(line => {
              if (line.id === lineId) {
                const nextChords = line.chords.filter((_, idx) => idx !== chordIndex);
                return { ...line, chords: nextChords.length > 0 ? nextChords : ['1'] };
              }
              return line;
            })
          };
        }
        return sec;
      })
    }));

    if (selectedSlot?.chordIndex === chordIndex) {
      setSelectedSlot(null);
    }
  };

  // Number Pad slot navigation
  const navigateSlot = (direction: 'next' | 'prev') => {
    triggerHaptic(10);
    if (!selectedSlot) return;
    const { sectionId, lineId, chordIndex } = selectedSlot;
    const sec = song.sections.find(s => s.id === sectionId);
    const line = sec?.lines.find(l => l.id === lineId);
    if (!line) return;

    if (direction === 'next') {
      if (chordIndex < line.chords.length - 1) {
        setSelectedSlot({ sectionId, lineId, chordIndex: chordIndex + 1 });
      }
    } else {
      if (chordIndex > 0) {
        setSelectedSlot({ sectionId, lineId, chordIndex: chordIndex - 1 });
      }
    }
  };

  // Get current active chord string for keypad
  let activeChordValue = '';
  let activeSectionLabel = '';
  if (selectedSlot) {
    const sec = song.sections.find(s => s.id === selectedSlot.sectionId);
    const line = sec?.lines.find(l => l.id === selectedSlot.lineId);
    if (line && line.chords[selectedSlot.chordIndex] !== undefined) {
      activeChordValue = line.chords[selectedSlot.chordIndex];
      activeSectionLabel = sec?.label || sec?.type || 'Section';
    }
  }

  // Calculate dynamic chord font size so long labels never overflow
  const getChordTextSize = (chordText: string) => {
    if (chordText.length > 4) return 'text-sm sm:text-base';
    if (chordText.length > 2) return 'text-base sm:text-lg';
    return 'text-xl sm:text-2xl';
  };

  return (
    <div className={`min-h-screen pb-72 relative w-full max-w-full overflow-x-hidden transition-colors duration-200 ${
      isDarkMode ? 'chart-grid-bg-dark bg-[#100D0A] text-[#F7F4EB]' : 'chart-grid-bg-light bg-[#F7F4EB] text-[#171310]'
    }`}>
      
      {/* Sticky Top Header: Streamlined for mobile with maximum room for song title & global theme switch */}
      <header className={`sticky top-0 z-40 px-3 sm:px-6 h-16 flex items-center justify-between gap-2.5 w-full max-w-full border-b-2 backdrop-blur-md transition-colors duration-200 ${
        isDarkMode ? 'bg-[#100D0A]/95 border-[#3A332C]' : 'bg-[#F7F4EB]/95 border-[#171310]'
      }`}>
        {/* Left: Back button + Song title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              onBack();
            }}
            className={`p-2 min-w-[40px] min-h-[40px] rounded-md transition-all duration-150 hover:scale-105 active:scale-95 shrink-0 border-2 flex items-center justify-center ${
              isDarkMode 
                ? 'bg-[#1A1512] hover:bg-[#241D17] text-[#F7F4EB] border-[#3A332C]' 
                : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#171310]'
            }`}
            title="Back to Songs"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="hidden sm:flex shrink-0">
            <LogoMark size={26} theme={theme} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 
              className={`font-mono text-sm sm:text-base md:text-lg font-bold tracking-tight truncate ${
                isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
              }`}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            >
              {song.title || 'Untitled Chart'}
            </h1>
            <div className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold truncate ${
              isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/60'
            }`}>
              <span className="text-[#E8432E]">KEY {song.key || 'G'}</span>
              <span>•</span>
              <span>{song.bpm || 80} BPM</span>
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle + Favorite + Perform CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Global Theme Toggle */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] rounded-md flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 border-2 ${
                isDarkMode 
                  ? 'bg-[#1A1512] hover:bg-[#241D17] text-[#F7F4EB] border-[#3A332C]' 
                  : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#171310]'
              }`}
              title={isDarkMode ? 'Switch to Light paper mode' : 'Switch to Dark mode'}
              aria-label="Toggle light/dark theme"
            >
              {isDarkMode ? <Sun size={16} className="text-[#D9A62E]" /> : <Moon size={16} className="text-[#171310]" />}
            </button>
          )}

          {/* Favorite Circle Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              onToggleFavorite(song.id);
            }}
            className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 border-2 ${
              song.favorite 
                ? 'bg-[#E8432E] text-[#F7F4EB] border-[#E8432E]' 
                : isDarkMode 
                  ? 'bg-[#1A1512] text-[#A89C8E] hover:text-[#E8432E] border-[#3A332C]' 
                  : 'bg-white text-[#171310]/40 hover:text-[#E8432E] border-[#171310]'
            }`}
            title={song.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={17}
              className={song.favorite ? 'fill-[#F7F4EB]' : ''}
            />
          </button>

          {/* Solid Vermilion Perform CTA */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onLaunchPerformance();
            }}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className="px-3.5 sm:px-4 py-2 min-h-[40px] bg-[#E8432E] hover:bg-[#D03522] text-[#F7F4EB] font-mono font-bold text-xs rounded-md flex items-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider border-2 border-[#E8432E]"
          >
            <Play size={12} className="fill-current" />
            <span>PERFORM</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-8 pt-6 sm:pt-8 flex flex-col gap-6 sm:gap-8 w-full max-w-full overflow-x-hidden">
        
        {/* Editable Song Title in Bold Monospace */}
        <div className="space-y-1">
          <label 
            className={`font-mono text-xs font-bold uppercase tracking-wider block ${
              isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/60'
            }`}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            Chart Title
          </label>
          <input
            type="text"
            value={song.title}
            onChange={(e) => mutateSong(s => ({ ...s, title: e.target.value }))}
            placeholder="Enter chart title..."
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className={`font-mono text-2xl sm:text-4xl font-bold bg-transparent w-full focus:outline-none tracking-tight ${
              isDarkMode 
                ? 'text-[#F7F4EB] placeholder:text-[#A89C8E]/30' 
                : 'text-[#171310] placeholder:text-[#171310]/30'
            }`}
          />
        </div>

        {/* Metadata Controls Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div 
            className={`flex items-center gap-1.5 border-2 rounded-md px-3 py-2 min-h-[44px] text-xs font-mono font-bold ${
              isDarkMode 
                ? 'bg-[#1A1512] border-[#3A332C] text-[#F7F4EB]' 
                : 'bg-white border-[#171310] text-[#171310]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            <span className={`uppercase ${isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/60'}`}>Key:</span>
            <select
              value={song.key || 'G'}
              onChange={(e) => {
                triggerHaptic(10);
                mutateSong(s => ({ ...s, key: e.target.value }));
              }}
              className={`bg-transparent font-mono font-bold focus:outline-none cursor-pointer ${
                isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
              }`}
            >
              {MAJOR_KEYS.map(k => (
                <option key={k} value={k} className={isDarkMode ? 'bg-[#1A1512] text-[#F7F4EB]' : 'bg-white text-[#171310]'}>
                  Key of {k}
                </option>
              ))}
            </select>
          </div>

          <div 
            className={`flex items-center gap-1.5 border-2 rounded-md px-3 py-2 min-h-[44px] text-xs font-mono font-bold ${
              isDarkMode 
                ? 'bg-[#1A1512] border-[#3A332C] text-[#F7F4EB]' 
                : 'bg-white border-[#171310] text-[#171310]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            <span className={`uppercase ${isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/60'}`}>BPM:</span>
            <input
              type="number"
              min={30}
              max={250}
              value={song.bpm || 80}
              onChange={(e) => mutateSong(s => ({ ...s, bpm: Number(e.target.value) }))}
              className={`w-12 bg-transparent font-mono font-bold focus:outline-none ${
                isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
              }`}
            />
          </div>

          <div 
            className={`flex items-center gap-1.5 border-2 rounded-md px-3 py-2 min-h-[44px] text-xs font-mono font-bold ${
              isDarkMode 
                ? 'bg-[#1A1512] border-[#3A332C] text-[#F7F4EB]' 
                : 'bg-white border-[#171310] text-[#171310]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            <span className={`uppercase ${isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/60'}`}>Time:</span>
            <select
              value={song.timeSignature || '4/4'}
              onChange={(e) => {
                triggerHaptic(10);
                mutateSong(s => ({ ...s, timeSignature: e.target.value }));
              }}
              className={`bg-transparent font-mono font-bold focus:outline-none cursor-pointer ${
                isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
              }`}
            >
              <option value="4/4" className={isDarkMode ? 'bg-[#1A1512] text-[#F7F4EB]' : 'bg-white text-[#171310]'}>4/4</option>
              <option value="3/4" className={isDarkMode ? 'bg-[#1A1512] text-[#F7F4EB]' : 'bg-white text-[#171310]'}>3/4</option>
              <option value="6/8" className={isDarkMode ? 'bg-[#1A1512] text-[#F7F4EB]' : 'bg-white text-[#171310]'}>6/8</option>
              <option value="2/4" className={isDarkMode ? 'bg-[#1A1512] text-[#F7F4EB]' : 'bg-white text-[#171310]'}>2/4</option>
            </select>
          </div>

          <div className={`w-full sm:w-auto sm:flex-1 min-w-0 flex items-center gap-1.5 border-2 rounded-md px-3 py-2 min-h-[44px] text-xs font-medium ${
            isDarkMode 
              ? 'bg-[#1A1512] border-[#3A332C] text-[#F7F4EB]' 
              : 'bg-white border-[#171310] text-[#171310]'
          }`}>
            <span 
              className={`font-mono font-bold uppercase shrink-0 ${
                isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/60'
              }`}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            >
              Artist:
            </span>
            <input
              type="text"
              value={song.artist || ''}
              onChange={(e) => mutateSong(s => ({ ...s, artist: e.target.value }))}
              placeholder="Artist or band (optional)..."
              className={`w-full bg-transparent font-sans font-medium focus:outline-none min-w-0 ${
                isDarkMode 
                  ? 'text-[#F7F4EB] placeholder:text-[#A89C8E]/40' 
                  : 'text-[#171310] placeholder:text-[#171310]/40'
              }`}
            />
          </div>
        </div>

        {/* Section Cards List */}
        <div className="space-y-6">
          {song.sections.map((section, secIdx) => {
            const formattedSecIndex = String(secIdx + 1).padStart(2, '0');

            return (
              <section
                key={section.id}
                className={`border-2 rounded-md p-4 sm:p-6 flex flex-col gap-4 transition-all duration-150 ${
                  isDarkMode 
                    ? 'bg-[#1A1512] border-[#3A332C]' 
                    : 'bg-white border-[#171310]'
                }`}
              >
                {/* Section Header with Mustard Monospace Sequence Number */}
                <div className="flex justify-between items-center w-full max-w-full flex-wrap gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span 
                      className="font-mono text-xs font-black bg-[#D9A62E] text-[#100D0A] px-2 py-0.5 rounded border border-[#171310] shrink-0"
                      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 900 }}
                    >
                      {formattedSecIndex}
                    </span>
                    <span 
                      className={`font-mono text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider shrink-0 border ${
                        isDarkMode 
                          ? 'bg-[#241D17] text-[#F7F4EB] border-[#3D332A]' 
                          : 'bg-[#171310] text-[#F7F4EB] border-[#171310]'
                      }`}
                      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                    >
                      {section.type}
                    </span>
                    <input
                      type="text"
                      value={section.label || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        mutateSong(s => ({
                          ...s,
                          sections: s.sections.map((sec, i) => i === secIdx ? { ...sec, label: val } : sec)
                        }));
                      }}
                      placeholder="Custom label"
                      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                      className={`font-mono text-sm font-bold bg-transparent rounded px-2 py-0.5 focus:outline-none transition-colors min-w-0 truncate border flex-1 max-w-xs ${
                        isDarkMode 
                          ? 'text-[#F7F4EB] hover:bg-[#241D17] focus:bg-[#241D17] border-transparent focus:border-[#3A332C]' 
                          : 'text-[#171310] hover:bg-[#F7F4EB] focus:bg-[#F7F4EB] border-transparent focus:border-[#171310]'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, 'up')}
                      disabled={secIdx === 0}
                      className={`p-2 min-w-[36px] min-h-[36px] rounded-md disabled:opacity-30 transition-all duration-150 hover:scale-105 active:scale-95 border flex items-center justify-center ${
                        isDarkMode 
                          ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                          : 'bg-[#F7F4EB] hover:bg-[#EDE8DA] text-[#171310] border-[#171310]'
                      }`}
                      title="Move Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, 'down')}
                      disabled={secIdx === song.sections.length - 1}
                      className={`p-2 min-w-[36px] min-h-[36px] rounded-md disabled:opacity-30 transition-all duration-150 hover:scale-105 active:scale-95 border flex items-center justify-center ${
                        isDarkMode 
                          ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                          : 'bg-[#F7F4EB] hover:bg-[#EDE8DA] text-[#171310] border-[#171310]'
                      }`}
                      title="Move Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLine(section.id)}
                      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                      className={`px-3 py-2 min-h-[36px] rounded-md font-mono text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ml-1 uppercase border flex items-center justify-center ${
                        isDarkMode 
                          ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                          : 'bg-[#F7F4EB] hover:bg-[#EDE8DA] text-[#171310] border-[#171310]'
                      }`}
                    >
                      + LINE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id)}
                      className={`p-2 min-w-[36px] min-h-[36px] rounded-md transition-all duration-150 hover:scale-105 active:scale-95 ml-0.5 flex items-center justify-center ${
                        isDarkMode 
                          ? 'text-[#A89C8E] hover:text-[#E8432E] hover:bg-red-950/30' 
                          : 'text-[#171310]/50 hover:text-[#E8432E] hover:bg-red-50'
                      }`}
                      title="Delete Section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Section Lines Container */}
                <div className="space-y-3.5 pt-1 w-full max-w-full">
                  {section.lines.map((line) => (
                    <div key={line.id} className={`space-y-2.5 relative group/line rounded-md p-3 sm:p-4 w-full max-w-full border ${
                      isDarkMode 
                        ? 'bg-[#241D17] border-[#3D332A]' 
                        : 'bg-[#FBF9F2] border-[#171310]/30'
                    }`}>
                      
                      {/* Wrapping Chord Row: Naturally wraps chords onto subsequent lines without clipping or scrollbars */}
                      <div className="flex flex-wrap items-center gap-2.5 w-full max-w-full pb-1 pt-1">
                        {line.chords.map((chord, cIdx) => {
                          const isSelected =
                            selectedSlot?.sectionId === section.id &&
                            selectedSlot?.lineId === line.id &&
                            selectedSlot?.chordIndex === cIdx;

                          return (
                            <div
                              key={cIdx}
                              className="relative group/slot flex-none"
                            >
                              <button
                                type="button"
                                onClick={() => handleSelectChordSlot(section.id, line.id, cIdx)}
                                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                                className={`min-w-[54px] sm:min-w-[64px] px-3.5 h-12 sm:h-14 min-h-[44px] rounded-md flex items-center justify-center font-mono font-bold select-none transition-all duration-150 cursor-pointer border-2 ${getChordTextSize(chord)} ${
                                  isSelected 
                                    ? 'bg-[#E8432E] text-[#F7F4EB] hover:bg-[#E8432E] scale-105 border-[#E8432E]' 
                                    : isDarkMode
                                      ? 'bg-[#1A1512] text-[#F7F4EB] hover:bg-[#2E2520] hover:scale-105 active:scale-95 border-[#3D332A]'
                                      : 'bg-white text-[#171310] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 border-[#171310]'
                                }`}
                              >
                                {chord || <span className={`${isDarkMode ? 'text-[#A89C8E]/40' : 'text-[#171310]/30'} font-normal`}>_</span>}
                              </button>

                              {line.chords.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChordSlot(section.id, line.id, cIdx);
                                  }}
                                  className={`absolute -top-1.5 -right-1.5 w-6 h-6 hover:bg-[#E8432E] text-[#F7F4EB] text-xs font-bold rounded-full items-center justify-center hidden group-hover/slot:flex z-10 transition-colors ${
                                    isDarkMode ? 'bg-[#3D332A]' : 'bg-[#171310]'
                                  }`}
                                  title="Delete chord"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          );
                        })}

                        {/* Plus button wraps inline alongside chords without blowing up to full width */}
                        <button
                          type="button"
                          onClick={() => handleAddChordSlotToLine(section.id, line.id)}
                          style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                          className={`w-12 h-12 sm:w-14 sm:h-14 min-w-[44px] min-h-[44px] rounded-md font-mono font-bold text-xl flex items-center justify-center transition-all duration-150 flex-none cursor-pointer border-2 hover:scale-105 active:scale-95 ${
                            isDarkMode 
                              ? 'bg-[#2E2520] hover:bg-[#3D332A] text-[#F7F4EB] border-[#3D332A]' 
                              : 'bg-[#F7F4EB] hover:bg-[#EDE8DA] text-[#171310] border-[#171310]'
                          }`}
                          title="Add chord slot"
                        >
                          +
                        </button>
                      </div>

                      {/* Inline Lyrics Line */}
                      <div className="flex items-center gap-2 pt-1 w-full max-w-full font-sans">
                        <AlignLeft size={16} className={`shrink-0 ${isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/50'}`} />
                        <input
                          type="text"
                          value={line.lyrics}
                          onChange={(e) => handleUpdateLyrics(section.id, line.id, e.target.value)}
                          placeholder="Lyrics for this line (optional)..."
                          className={`w-full bg-transparent border-none text-xs sm:text-sm font-medium rounded px-2 py-1.5 min-w-0 focus:outline-none ${
                            isDarkMode 
                              ? 'text-[#F7F4EB] placeholder:text-[#A89C8E]/40 focus:bg-[#1A1512]' 
                              : 'text-[#171310] placeholder:text-[#171310]/40 focus:bg-white'
                          }`}
                        />
                        {section.lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteLine(section.id, line.id)}
                            className={`p-1.5 min-w-[32px] min-h-[32px] rounded-md transition-colors shrink-0 flex items-center justify-center ${
                              isDarkMode 
                                ? 'text-[#A89C8E] hover:text-[#E8432E] hover:bg-red-950/30' 
                                : 'text-[#171310]/50 hover:text-[#E8432E] hover:bg-red-50'
                            }`}
                            title="Delete Line"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Add Section Button with 48px touch target */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setIsSectionPickerOpen(true);
            }}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className={`px-6 py-3.5 min-h-[48px] font-mono text-xs sm:text-sm font-bold rounded-md inline-flex items-center justify-center gap-2 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider border-2 ${
              isDarkMode 
                ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                : 'bg-[#171310] hover:bg-[#2E2520] text-[#F7F4EB] border-[#171310]'
            }`}
          >
            <Plus size={16} />
            <span>ADD SECTION</span>
          </button>
        </div>
      </main>

      {/* Section Type Picker Modal */}
      <SectionTypePickerModal
        isOpen={isSectionPickerOpen}
        theme={theme}
        onClose={() => setIsSectionPickerOpen(false)}
        onSelectType={handleAddSection}
      />

      {/* Bold Flat Nashville Keypad Drawer */}
      {selectedSlot && (
        <NashvilleNumberPad
          currentChord={activeChordValue}
          theme={theme}
          onChangeChord={handleUpdateActiveChord}
          onClose={() => {
            triggerHaptic(15);
            setSelectedSlot(null);
          }}
          onNextSlot={() => navigateSlot('next')}
          onPrevSlot={() => navigateSlot('prev')}
          onAddNewSlot={() => handleAddChordSlotToLine(selectedSlot.sectionId, selectedSlot.lineId)}
          onDeleteSlot={() => handleDeleteChordSlot(selectedSlot.sectionId, selectedSlot.lineId, selectedSlot.chordIndex)}
          sectionLabel={activeSectionLabel}
          slotIndex={selectedSlot.chordIndex}
        />
      )}
    </div>
  );
};
