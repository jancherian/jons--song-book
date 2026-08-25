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
  X
} from 'lucide-react';
import type { Song, SongSection, SongLine, SectionType, SelectedChordSlot } from '../types/song';
import { MAJOR_KEYS } from '../utils/nashville';
import { SectionTypePickerModal } from './SectionTypePickerModal';
import { NashvilleNumberPad } from './NashvilleNumberPad';
import { LogoMark } from './LogoMark';
import { triggerHaptic } from '../utils/haptics';

interface SongEditorProps {
  song: Song;
  onUpdateSong: (updatedSong: Song) => void;
  onBack: () => void;
  onLaunchPerformance: () => void;
  onToggleFavorite: (songId: string) => void;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  song,
  onUpdateSong,
  onBack,
  onLaunchPerformance,
  onToggleFavorite,
}) => {
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

  return (
    <div className="min-h-screen chart-grid-bg text-[#171310] font-sans pb-72 relative w-full max-w-full overflow-x-hidden">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#F7F4EB]/95 border-b-2 border-[#171310] px-4 sm:px-6 h-16 flex items-center justify-between gap-2 w-full max-w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              onBack();
            }}
            className="p-2 min-w-[44px] min-h-[44px] rounded-md hover:bg-white text-[#171310] transition-all duration-150 hover:scale-105 active:scale-95 shrink-0 border-2 border-[#171310] flex items-center justify-center"
            title="Back to Songs"
          >
            <ArrowLeft size={18} />
          </button>

          <LogoMark size={28} />

          <h1 
            className="font-mono text-base sm:text-lg font-bold text-[#171310] tracking-tight truncate"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            Chordset <span className="text-[#171310]/40 font-normal">/</span> <span className="text-[#171310] font-black">Editor</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Favorite Circle Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              onToggleFavorite(song.id);
            }}
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 border-2 border-[#171310] ${
              song.favorite 
                ? 'bg-[#E8432E] text-[#F7F4EB]' 
                : 'bg-white text-[#171310]/40 hover:text-[#E8432E]'
            }`}
            title={song.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={18}
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
            className="px-4 py-2.5 min-h-[44px] bg-[#E8432E] hover:bg-[#D03522] text-[#F7F4EB] font-mono font-bold text-xs rounded-md flex items-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider border-2 border-[#171310]"
          >
            <Play size={13} className="fill-current mr-0.5" />
            <span>PERFORM</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex flex-col gap-6 sm:gap-8 w-full max-w-full overflow-x-hidden">
        
        {/* Editable Song Title in Bold Monospace */}
        <div className="space-y-1">
          <label 
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#171310]/60 block"
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
            className="font-mono text-2xl sm:text-4xl font-bold text-[#171310] bg-transparent w-full focus:outline-none tracking-tight placeholder:text-[#171310]/30"
          />
        </div>

        {/* Metadata Controls Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div 
            className="flex items-center gap-1.5 bg-white border-2 border-[#171310] rounded-md px-3.5 py-2 min-h-[44px] text-xs font-mono font-bold text-[#171310]"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            <span className="text-[#171310]/60 uppercase">Key:</span>
            <select
              value={song.key || 'G'}
              onChange={(e) => {
                triggerHaptic(10);
                mutateSong(s => ({ ...s, key: e.target.value }));
              }}
              className="bg-transparent font-mono font-bold text-[#171310] focus:outline-none cursor-pointer"
            >
              {MAJOR_KEYS.map(k => (
                <option key={k} value={k}>Key of {k}</option>
              ))}
            </select>
          </div>

          <div 
            className="flex items-center gap-1.5 bg-white border-2 border-[#171310] rounded-md px-3.5 py-2 min-h-[44px] text-xs font-mono font-bold text-[#171310]"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            <span className="text-[#171310]/60 uppercase">BPM:</span>
            <input
              type="number"
              min={30}
              max={250}
              value={song.bpm || 80}
              onChange={(e) => mutateSong(s => ({ ...s, bpm: Number(e.target.value) }))}
              className="w-12 bg-transparent font-mono font-bold text-[#171310] focus:outline-none"
            />
          </div>

          <div 
            className="flex items-center gap-1.5 bg-white border-2 border-[#171310] rounded-md px-3.5 py-2 min-h-[44px] text-xs font-mono font-bold text-[#171310]"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            <span className="text-[#171310]/60 uppercase">Time:</span>
            <select
              value={song.timeSignature || '4/4'}
              onChange={(e) => {
                triggerHaptic(10);
                mutateSong(s => ({ ...s, timeSignature: e.target.value }));
              }}
              className="bg-transparent font-mono font-bold text-[#171310] focus:outline-none cursor-pointer"
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="6/8">6/8</option>
              <option value="2/4">2/4</option>
            </select>
          </div>

          <div className="w-full sm:w-auto sm:flex-1 min-w-0 flex items-center gap-1.5 bg-white border-2 border-[#171310] rounded-md px-3.5 py-2 min-h-[44px] text-xs font-medium text-[#171310]">
            <span 
              className="font-mono text-[#171310]/60 font-bold uppercase shrink-0"
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            >
              Artist:
            </span>
            <input
              type="text"
              value={song.artist || ''}
              onChange={(e) => mutateSong(s => ({ ...s, artist: e.target.value }))}
              placeholder="Artist or band (optional)..."
              className="w-full bg-transparent font-sans font-medium text-[#171310] placeholder:text-[#171310]/40 focus:outline-none min-w-0"
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
                className="bg-white border-2 border-[#171310] rounded-md p-5 sm:p-6 flex flex-col gap-4 transition-all duration-150"
              >
                {/* Section Header with Mustard Monospace Sequence Number */}
                <div className="flex justify-between items-center w-full max-w-full flex-wrap gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="font-mono text-xs font-black bg-[#D9A62E] text-[#171310] px-2 py-0.5 rounded border border-[#171310] shrink-0"
                      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 900 }}
                    >
                      {formattedSecIndex}
                    </span>
                    <span 
                      className="font-mono text-xs font-bold bg-[#171310] text-[#F7F4EB] px-2.5 py-1 rounded uppercase tracking-wider shrink-0"
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
                      className="font-mono text-sm font-bold text-[#171310] bg-transparent hover:bg-[#F7F4EB] focus:bg-[#F7F4EB] rounded px-2 py-0.5 focus:outline-none transition-colors min-w-0 truncate border border-transparent focus:border-[#171310]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, 'up')}
                      disabled={secIdx === 0}
                      className="p-2 min-w-[36px] min-h-[36px] rounded-md bg-[#F7F4EB] hover:bg-[#EDE8DA] text-[#171310] disabled:opacity-30 disabled:hover:bg-[#F7F4EB] transition-all duration-150 hover:scale-105 active:scale-95 border border-[#171310] flex items-center justify-center"
                      title="Move Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(secIdx, 'down')}
                      disabled={secIdx === song.sections.length - 1}
                      className="p-2 min-w-[36px] min-h-[36px] rounded-md bg-[#F7F4EB] hover:bg-[#EDE8DA] text-[#171310] disabled:opacity-30 disabled:hover:bg-[#F7F4EB] transition-all duration-150 hover:scale-105 active:scale-95 border border-[#171310] flex items-center justify-center"
                      title="Move Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLine(section.id)}
                      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                      className="px-3 py-2 min-h-[36px] rounded-md bg-[#F7F4EB] hover:bg-[#EDE8DA] text-[#171310] font-mono text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ml-1 uppercase border border-[#171310] flex items-center justify-center"
                    >
                      + LINE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 min-w-[36px] min-h-[36px] rounded-md text-[#171310]/50 hover:text-[#E8432E] hover:bg-red-50 transition-all duration-150 hover:scale-105 active:scale-95 ml-0.5 flex items-center justify-center"
                      title="Delete Section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Section Lines Container */}
                <div className="space-y-3 pt-1 w-full max-w-full">
                  {section.lines.map((line) => (
                    <div key={line.id} className="space-y-2.5 relative group/line bg-[#FBF9F2] rounded-md p-3.5 sm:p-4 w-full max-w-full border border-[#171310]/30">
                      
                      {/* Responsive Flexible Chord Cells Container */}
                      <div className="flex flex-wrap items-stretch gap-2 w-full max-w-full">
                        {line.chords.map((chord, cIdx) => {
                          const isSelected =
                            selectedSlot?.sectionId === section.id &&
                            selectedSlot?.lineId === line.id &&
                            selectedSlot?.chordIndex === cIdx;

                          return (
                            <div
                              key={cIdx}
                              className="relative group/slot flex-1 min-w-[56px] sm:min-w-[68px]"
                            >
                              <button
                                type="button"
                                onClick={() => handleSelectChordSlot(section.id, line.id, cIdx)}
                                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                                className={`w-full h-13 sm:h-14 min-h-[44px] rounded-md flex items-center justify-center font-mono font-bold text-xl sm:text-2xl select-none transition-all duration-150 min-w-0 truncate px-1 cursor-pointer border-2 ${
                                  isSelected 
                                    ? 'bg-[#E8432E] text-[#F7F4EB] hover:bg-[#E8432E] scale-105 border-[#171310]' 
                                    : 'bg-white text-[#171310] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 border-[#171310]'
                                }`}
                              >
                                {chord || <span className="text-[#171310]/30 font-normal">_</span>}
                              </button>

                              {line.chords.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChordSlot(section.id, line.id, cIdx);
                                  }}
                                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#171310] hover:bg-[#E8432E] text-[#F7F4EB] text-xs font-bold rounded-full items-center justify-center hidden group-hover/slot:flex z-10 transition-colors"
                                  title="Delete chord"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          );
                        })}

                        {/* Plus button to append slot */}
                        <button
                          type="button"
                          onClick={() => handleAddChordSlotToLine(section.id, line.id)}
                          style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                          className="px-4 h-13 sm:h-14 min-h-[44px] bg-[#F7F4EB] hover:bg-[#EDE8DA] hover:scale-105 active:scale-95 rounded-md text-[#171310] font-mono font-bold text-lg flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer border-2 border-[#171310]"
                          title="Add chord slot"
                        >
                          +
                        </button>
                      </div>

                      {/* Inline Lyrics Line */}
                      <div className="flex items-center gap-2 pt-1 w-full max-w-full font-sans">
                        <AlignLeft size={16} className="text-[#171310]/50 shrink-0" />
                        <input
                          type="text"
                          value={line.lyrics}
                          onChange={(e) => handleUpdateLyrics(section.id, line.id, e.target.value)}
                          placeholder="Lyrics for this line (optional)..."
                          className="w-full bg-transparent border-none text-xs sm:text-sm font-medium text-[#171310] placeholder:text-[#171310]/40 focus:outline-none focus:bg-white rounded px-2 py-1 min-w-0"
                        />
                        {section.lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteLine(section.id, line.id)}
                            className="p-1.5 min-w-[32px] min-h-[32px] rounded-md text-[#171310]/50 hover:text-[#E8432E] hover:bg-red-50 transition-colors shrink-0 flex items-center justify-center"
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

        {/* Add Section Button with 44px min height */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setIsSectionPickerOpen(true);
            }}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className="px-6 py-3.5 min-h-[48px] bg-[#171310] hover:bg-[#2E2520] text-[#F7F4EB] font-mono text-xs sm:text-sm font-bold rounded-md inline-flex items-center justify-center gap-2 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider border-2 border-[#171310]"
          >
            <Plus size={16} />
            <span>ADD SECTION</span>
          </button>
        </div>
      </main>

      {/* Section Type Picker Modal */}
      <SectionTypePickerModal
        isOpen={isSectionPickerOpen}
        onClose={() => setIsSectionPickerOpen(false)}
        onSelectType={handleAddSection}
      />

      {/* Bold Flat Nashville Keypad Drawer */}
      {selectedSlot && (
        <NashvilleNumberPad
          currentChord={activeChordValue}
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
