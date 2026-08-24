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
    <div className="min-h-screen bg-white text-black font-sans swiss-grid pb-72 relative">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors duration-150"
            title="Back to Songs"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-lg sm:text-xl font-black uppercase text-black tracking-tight">
            CHORDSET <span className="text-[#FF3000]">//</span> CHART EDITOR
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(song.id)}
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors duration-150"
            title={song.favorite ? 'Favorite' : 'Add to favorites'}
          >
            <Star
              size={18}
              className={song.favorite ? 'text-[#FF3000] fill-[#FF3000]' : 'text-neutral-400'}
            />
          </button>

          {/* Launch Stage Performance Mode */}
          <button
            onClick={onLaunchPerformance}
            className="swiss-btn-accent px-4 py-2 text-xs"
          >
            <Play size={14} className="fill-current mr-1.5" />
            <span>STAGE MODE</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 pt-8 flex flex-col gap-8">
        
        {/* Editable Song Title (Underlined Swiss Input) */}
        <div className="border-b-4 border-black pb-4">
          <label className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#FF3000] block mb-1">
            Chart Title
          </label>
          <input
            type="text"
            value={song.title}
            onChange={(e) => mutateSong(s => ({ ...s, title: e.target.value }))}
            placeholder="ENTER CHART TITLE..."
            className="text-3xl sm:text-5xl font-black uppercase text-black bg-transparent w-full focus:outline-none tracking-tight font-sans"
          />
        </div>

        {/* Metadata Controls Strip */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs border-b-2 border-black pb-4">
          <div className="flex items-center gap-2 bg-[#F2F2F2] border border-black px-3 py-1.5 font-bold">
            <span className="text-neutral-500 uppercase">Key:</span>
            <select
              value={song.key || 'G'}
              onChange={(e) => mutateSong(s => ({ ...s, key: e.target.value }))}
              className="bg-transparent font-black text-black uppercase focus:outline-none cursor-pointer"
            >
              {MAJOR_KEYS.map(k => (
                <option key={k} value={k}>Key of {k}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#F2F2F2] border border-black px-3 py-1.5 font-bold">
            <span className="text-neutral-500 uppercase">BPM:</span>
            <input
              type="number"
              min={30}
              max={250}
              value={song.bpm || 80}
              onChange={(e) => mutateSong(s => ({ ...s, bpm: Number(e.target.value) }))}
              className="w-12 bg-transparent font-black text-black focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#F2F2F2] border border-black px-3 py-1.5 font-bold">
            <span className="text-neutral-500 uppercase">Time:</span>
            <select
              value={song.timeSignature || '4/4'}
              onChange={(e) => mutateSong(s => ({ ...s, timeSignature: e.target.value }))}
              className="bg-transparent font-black text-black focus:outline-none cursor-pointer"
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="6/8">6/8</option>
              <option value="2/4">2/4</option>
            </select>
          </div>

          <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-[#F2F2F2] border border-black px-3 py-1.5 font-bold">
            <span className="text-neutral-500 uppercase">Artist:</span>
            <input
              type="text"
              value={song.artist || ''}
              onChange={(e) => mutateSong(s => ({ ...s, artist: e.target.value }))}
              placeholder="OPTIONAL ARTIST..."
              className="w-full bg-transparent font-black text-black uppercase placeholder:text-neutral-400 focus:outline-none"
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
                className="bg-[#F2F2F2] border-2 border-black p-5 flex flex-col gap-4"
              >
                {/* Section Header with Swiss Index Prefix */}
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-sm font-black text-[#FF3000]">
                      {formattedSecIndex}
                    </span>
                    <span className="font-mono text-xs font-black uppercase text-black tracking-widest">
                      {section.type}
                    </span>
                    <span className="text-neutral-400 text-xs font-mono">—</span>
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
                      placeholder="CUSTOM LABEL"
                      className="text-xs font-mono font-bold text-black uppercase bg-transparent border-b border-transparent hover:border-black focus:border-[#FF3000] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveSection(secIdx, 'up')}
                      disabled={secIdx === 0}
                      className="p-1 border border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                      title="Move Up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveSection(secIdx, 'down')}
                      disabled={secIdx === song.sections.length - 1}
                      className="p-1 border border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                      title="Move Down"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={() => handleAddLine(section.id)}
                      className="swiss-btn-outline px-2.5 py-0.5 text-[11px] ml-1"
                    >
                      + Line
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1 border border-transparent hover:border-black hover:bg-[#FF3000] hover:text-white text-neutral-500 transition-colors ml-1"
                      title="Delete Section"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Section Lines */}
                <div className="space-y-5 pt-1">
                  {section.lines.map((line) => (
                    <div key={line.id} className="space-y-2 relative group/line bg-white border-2 border-black p-4">
                      
                      {/* Visible Chord Grid Cell Rows */}
                      <div className="flex flex-wrap items-stretch border-2 border-black bg-neutral-100">
                        {line.chords.map((chord, cIdx) => {
                          const isSelected =
                            selectedSlot?.sectionId === section.id &&
                            selectedSlot?.lineId === line.id &&
                            selectedSlot?.chordIndex === cIdx;

                          return (
                            <div key={cIdx} className="relative group/slot flex-1 min-w-[72px]">
                              <button
                                onClick={() => handleSelectChordSlot(section.id, line.id, cIdx)}
                                className={`w-full h-14 flex items-center justify-center font-sans font-black text-xl border-r-2 border-black select-none transition-colors duration-100 ${
                                  isSelected 
                                    ? 'bg-[#FF3000] text-white border-[#FF3000]' 
                                    : 'bg-white text-black hover:bg-neutral-200'
                                }`}
                              >
                                {chord || <span className="text-neutral-400 font-normal">_</span>}
                              </button>

                              {line.chords.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChordSlot(section.id, line.id, cIdx);
                                  }}
                                  className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] items-center justify-center hidden group-hover/slot:flex border border-white"
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
                          className="px-3 h-14 bg-white hover:bg-black hover:text-white font-mono font-bold text-sm text-black border-l-0 flex items-center justify-center transition-colors duration-100"
                          title="Add chord slot"
                        >
                          +
                        </button>
                      </div>

                      {/* Inline Lyrics Line directly beneath chord grid */}
                      <div className="flex items-center gap-2 border-b border-black pt-2 pb-1">
                        <AlignLeft size={14} className="text-neutral-400 shrink-0" />
                        <input
                          type="text"
                          value={line.lyrics}
                          onChange={(e) => handleUpdateLyrics(section.id, line.id, e.target.value)}
                          placeholder="ENTER LYRICS FOR THIS MEASURE..."
                          className="w-full bg-transparent border-none text-xs font-mono font-bold uppercase text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                        />
                        {section.lines.length > 1 && (
                          <button
                            onClick={() => handleDeleteLine(section.id, line.id)}
                            className="p-1 text-neutral-400 hover:text-[#FF3000] transition-colors shrink-0"
                            title="Delete Line"
                          >
                            <X size={14} />
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

        {/* Add Section Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsSectionPickerOpen(true)}
            className="swiss-btn px-6 py-3 text-xs"
          >
            <Plus size={16} className="mr-2" />
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

      {/* Swiss Dot-Matrix Nashville Keypad when a chord slot is selected */}
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
