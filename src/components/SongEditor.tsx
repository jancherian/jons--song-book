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
import { SECTION_TYPES, MAJOR_KEYS } from '../utils/nashville';
import { SectionTypePickerModal } from './SectionTypePickerModal';
import { NashvilleNumberPad } from './NashvilleNumberPad';

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

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...song.sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    mutateSong(s => ({ ...s, sections: reordered }));
  };

  const handleDeleteSection = (sectionId: string) => {
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
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] font-sans pb-72 relative">
      
      {/* Sticky Top Header matching Stitch */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-white/10 px-6 h-16 flex items-center justify-between shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full text-[#f2ca50] hover:bg-white/10 transition-colors active:scale-95"
            title="Back to Songs"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-[#f2ca50] tracking-tight">
            Jon's Song Book
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(song.id)}
            className="p-2 rounded-full text-zinc-500 hover:text-[#f2ca50] hover:bg-white/10 transition-colors"
            title={song.favorite ? 'Favorite' : 'Add to favorites'}
          >
            <Star
              size={20}
              className={song.favorite ? 'text-[#f2ca50] fill-[#f2ca50] drop-shadow-[0_0_8px_rgba(242,202,80,0.5)]' : 'text-zinc-500'}
            />
          </button>

          {/* Launch Stage Performance Mode */}
          <button
            onClick={onLaunchPerformance}
            className="px-4 py-2 rounded-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#121212] font-black text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.35)] active:scale-95 transition-all"
          >
            <Play size={14} className="fill-current" />
            <span>Stage</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 pt-8 flex flex-col gap-6 relative z-10">
        
        {/* Editable Song Title matching Stitch */}
        <div className="mb-1 relative">
          <input
            type="text"
            value={song.title}
            onChange={(e) => mutateSong(s => ({ ...s, title: e.target.value }))}
            placeholder="Song Title"
            className="text-3xl sm:text-4xl font-extrabold text-white bg-transparent w-full border-b border-white/15 pb-2.5 focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/30 tracking-tight font-sans"
          />
        </div>

        {/* Metadata Bar (Key, BPM, Time Signature, Artist) */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-[#e5e2e1] pb-2">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-zinc-500">Key:</span>
            <select
              value={song.key || 'G'}
              onChange={(e) => mutateSong(s => ({ ...s, key: e.target.value }))}
              className="bg-transparent font-bold text-[#f2ca50] focus:outline-none cursor-pointer"
            >
              {MAJOR_KEYS.map(k => (
                <option key={k} value={k} className="bg-[#1c1b1b] text-white">
                  Key of {k}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-zinc-500">BPM:</span>
            <input
              type="number"
              min={30}
              max={250}
              value={song.bpm || 80}
              onChange={(e) => mutateSong(s => ({ ...s, bpm: Number(e.target.value) }))}
              className="w-10 bg-transparent font-bold text-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-zinc-500">Time:</span>
            <select
              value={song.timeSignature || '4/4'}
              onChange={(e) => mutateSong(s => ({ ...s, timeSignature: e.target.value }))}
              className="bg-transparent font-bold text-emerald-400 focus:outline-none cursor-pointer"
            >
              <option value="4/4" className="bg-[#1c1b1b] text-white">4/4</option>
              <option value="3/4" className="bg-[#1c1b1b] text-white">3/4</option>
              <option value="6/8" className="bg-[#1c1b1b] text-white">6/8</option>
              <option value="2/4" className="bg-[#1c1b1b] text-white">2/4</option>
            </select>
          </div>

          <input
            type="text"
            value={song.artist || ''}
            onChange={(e) => mutateSong(s => ({ ...s, artist: e.target.value }))}
            placeholder="Artist name (optional)"
            className="flex-1 min-w-[140px] bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-white/80 placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Ordered Section Cards matching Stitch */}
        <div className="space-y-5">
          {song.sections.map((section, secIdx) => {
            const secConfig = SECTION_TYPES.find(t => t.type === section.type);

            return (
              <section
                key={section.id}
                className="backdrop-blur-[24px] bg-white/[0.05] border-t border-l border-white/[0.18] border-b border-r border-black/[0.3] rounded-2xl p-5 flex flex-col gap-3.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] relative overflow-hidden group"
              >
                {/* Section Header */}
                <div className="flex justify-between items-center w-full relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest border ${
                      secConfig?.color || 'bg-white/10 text-[#d4af37] border-white/20'
                    }`}>
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
                      placeholder="Section label (e.g. Verse 1)"
                      className="text-xs font-mono font-bold text-white/90 bg-transparent border-b border-transparent hover:border-white/15 focus:border-[#d4af37] focus:outline-none pb-0.5"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveSection(secIdx, 'up')}
                      disabled={secIdx === 0}
                      className="p-1 rounded text-zinc-500 hover:text-white disabled:opacity-20"
                      title="Move Up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      onClick={() => handleMoveSection(secIdx, 'down')}
                      disabled={secIdx === song.sections.length - 1}
                      className="p-1 rounded text-zinc-500 hover:text-white disabled:opacity-20"
                      title="Move Down"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      onClick={() => handleAddLine(section.id)}
                      className="text-[#f2ca50] hover:text-white text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors ml-1"
                    >
                      + Line
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors ml-1"
                      title="Delete Section"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Section Lines */}
                <div className="space-y-4 pt-1">
                  {section.lines.map((line) => (
                    <div key={line.id} className="space-y-2 relative group/line">
                      
                      {/* Chords row */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {line.chords.map((chord, cIdx) => {
                          const isSelected =
                            selectedSlot?.sectionId === section.id &&
                            selectedSlot?.lineId === line.id &&
                            selectedSlot?.chordIndex === cIdx;

                          return (
                            <div key={cIdx} className="relative group/slot">
                              <button
                                onClick={() => handleSelectChordSlot(section.id, line.id, cIdx)}
                                className={`px-4 py-2 rounded-xl text-base font-bold select-none transition-all duration-150 active:scale-95 ${
                                  isSelected ? 'chord-chip-active' : 'chord-chip-inactive'
                                }`}
                              >
                                {chord || <span className="text-zinc-600 font-normal italic">_</span>}
                              </button>

                              {line.chords.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChordSlot(section.id, line.id, cIdx);
                                  }}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] items-center justify-center hidden group-hover/slot:flex shadow-sm"
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
                          onClick={() => handleAddChordSlotToLine(section.id, line.id)}
                          className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white/[0.03] hover:bg-white/[0.08] text-[#f2ca50] border border-dashed border-white/20 transition-all active:scale-95"
                          title="Add chord slot"
                        >
                          +
                        </button>

                        {section.lines.length > 1 && (
                          <button
                            onClick={() => handleDeleteLine(section.id, line.id)}
                            className="p-1 rounded text-zinc-600 hover:text-rose-400 transition-colors ml-auto hidden group-hover/line:block"
                            title="Delete Line"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {/* Inline Lyrics Line directly beneath chords */}
                      <div className="mt-1 text-[#e5e2e1] font-body-lg opacity-90 border-b border-dashed border-white/20 pb-1 w-full min-h-[30px] flex items-center gap-2">
                        <AlignLeft size={13} className="text-zinc-500 shrink-0" />
                        <input
                          type="text"
                          value={line.lyrics}
                          onChange={(e) => handleUpdateLyrics(section.id, line.id, e.target.value)}
                          placeholder="Walking down the neon streets..."
                          className="w-full bg-transparent border-none text-xs font-mono text-white placeholder:text-white/30 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Add Section Button matching Stitch */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsSectionPickerOpen(true)}
            className="px-6 py-3 rounded-full backdrop-blur-[30px] bg-white/[0.03] border border-white/[0.1] hover:border-[#d4af37]/40 text-[#f2ca50] flex items-center gap-2 hover:bg-white/[0.08] transition-all duration-300 shadow-sm active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-bold text-xs font-mono uppercase tracking-wider">Add Section</span>
          </button>
        </div>
      </main>

      {/* Section Type Picker Modal */}
      <SectionTypePickerModal
        isOpen={isSectionPickerOpen}
        onClose={() => setIsSectionPickerOpen(false)}
        onSelectType={handleAddSection}
      />

      {/* Docked Nashville Keypad when a chord slot is selected */}
      {selectedSlot && (
        <NashvilleNumberPad
          currentChord={activeChordValue}
          onChangeChord={handleUpdateActiveChord}
          onClose={() => setSelectedSlot(null)}
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
