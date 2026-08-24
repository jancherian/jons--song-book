import React from 'react';
import { 
  Delete, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Music, 
  Trash2 
} from 'lucide-react';
import { applyKeypadInput } from '../utils/nashville';

interface NashvilleNumberPadProps {
  currentChord: string;
  onChangeChord: (newChord: string) => void;
  onClose: () => void;
  onNextSlot?: () => void;
  onPrevSlot?: () => void;
  onAddNewSlot?: () => void;
  onDeleteSlot?: () => void;
  sectionLabel?: string;
  slotIndex?: number;
}

export const NashvilleNumberPad: React.FC<NashvilleNumberPadProps> = ({
  currentChord,
  onChangeChord,
  onClose,
  onNextSlot,
  onPrevSlot,
  onAddNewSlot,
  onDeleteSlot,
  sectionLabel,
  slotIndex,
}) => {
  const handleKeyClick = (key: string) => {
    const updated = applyKeypadInput(currentChord, key);
    onChangeChord(updated);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full px-3 sm:px-6 pb-6 pt-3 backdrop-blur-[40px] bg-[#121212]/92 border-t border-white/[0.1] rounded-t-3xl z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.85)] animate-fade-in-up">
      
      {/* Drag Indicator Pill from Stitch */}
      <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3" />

      {/* Top Preview Bar & Controls */}
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/35 flex items-center justify-center text-[#f2ca50]">
            <Music size={14} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#d0c5af] block uppercase tracking-wider">
              {sectionLabel || 'Section'} {slotIndex !== undefined ? `#${slotIndex + 1}` : ''}
            </span>
            <span className="text-xl font-extrabold text-[#f2ca50] font-mono tracking-wider">
              {currentChord || <span className="text-zinc-600 italic text-sm font-normal">(empty)</span>}
            </span>
          </div>
        </div>

        {/* Quick Slot Actions */}
        <div className="flex items-center gap-1.5">
          {onPrevSlot && (
            <button
              onClick={onPrevSlot}
              title="Previous Slot"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 border border-white/10 active:scale-95 transition-all"
            >
              <ChevronLeft size={15} />
            </button>
          )}
          {onNextSlot && (
            <button
              onClick={onNextSlot}
              title="Next Slot"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 border border-white/10 active:scale-95 transition-all"
            >
              <ChevronRight size={15} />
            </button>
          )}
          {onAddNewSlot && (
            <button
              onClick={onAddNewSlot}
              title="Append Slot"
              className="px-2 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f2ca50] border border-[#d4af37]/35 text-xs font-mono font-bold flex items-center gap-1 active:scale-95 transition-all"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          )}
          {onDeleteSlot && (
            <button
              onClick={onDeleteSlot}
              title="Delete Slot"
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:scale-95 transition-all"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            title="Done / Close"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 active:scale-95 transition-all ml-1"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Grid Keyboard from Stitch */}
      <div className="max-w-3xl mx-auto grid grid-cols-4 sm:grid-cols-5 gap-2 select-none">
        {/* Row 1: Numbers 1, 2, 3, 4, 5 */}
        <button onClick={() => handleKeyClick('1')} className="key-tile h-12 text-lg font-bold flex items-center justify-center">1</button>
        <button onClick={() => handleKeyClick('2')} className="key-tile h-12 text-lg font-bold flex items-center justify-center">2</button>
        <button onClick={() => handleKeyClick('3')} className="key-tile h-12 text-lg font-bold flex items-center justify-center">3</button>
        <button onClick={() => handleKeyClick('4')} className="key-tile h-12 text-lg font-bold flex items-center justify-center">4</button>
        <button onClick={() => handleKeyClick('5')} className="key-tile h-12 text-lg font-bold hidden sm:flex items-center justify-center">5</button>

        {/* Row 2: 5 (mobile), 6, 7, m, #, b */}
        <button onClick={() => handleKeyClick('5')} className="key-tile h-12 text-lg font-bold sm:hidden flex items-center justify-center">5</button>
        <button onClick={() => handleKeyClick('6')} className="key-tile h-12 text-lg font-bold flex items-center justify-center">6</button>
        <button onClick={() => handleKeyClick('7')} className="key-tile h-12 text-lg font-bold flex items-center justify-center">7</button>
        <button onClick={() => handleKeyClick('m')} className="key-tile h-12 text-base font-bold text-[#f2ca50] bg-[#d4af37]/15 border-[#d4af37]/30 flex items-center justify-center">m</button>
        <button onClick={() => handleKeyClick('#')} className="key-tile h-12 text-base font-bold text-[#f2ca50] bg-[#d4af37]/15 border-[#d4af37]/30 hidden sm:flex items-center justify-center">#</button>

        {/* Row 3: # (mobile), b, dim, M7, m7, sus4 */}
        <button onClick={() => handleKeyClick('#')} className="key-tile h-12 text-base font-bold text-[#f2ca50] bg-[#d4af37]/15 border-[#d4af37]/30 sm:hidden flex items-center justify-center">#</button>
        <button onClick={() => handleKeyClick('b')} className="key-tile h-12 text-base font-bold text-[#f2ca50] bg-[#d4af37]/15 border-[#d4af37]/30 flex items-center justify-center">b</button>
        <button onClick={() => handleKeyClick('dim')} className="key-tile h-12 text-xs font-bold text-[#f2ca50] bg-[#d4af37]/10 flex items-center justify-center">dim</button>
        <button onClick={() => handleKeyClick('M7')} className="key-tile h-12 text-xs font-bold flex items-center justify-center">M7</button>
        <button onClick={() => handleKeyClick('m7')} className="key-tile h-12 text-xs font-bold hidden sm:flex items-center justify-center">m7</button>

        {/* Row 4: m7 (mobile), sus4, sus2, /, Backspace */}
        <button onClick={() => handleKeyClick('m7')} className="key-tile h-12 text-xs font-bold sm:hidden flex items-center justify-center">m7</button>
        <button onClick={() => handleKeyClick('sus4')} className="key-tile h-12 text-xs font-bold flex items-center justify-center">sus4</button>
        <button onClick={() => handleKeyClick('sus2')} className="key-tile h-12 text-xs font-bold flex items-center justify-center">sus2</button>
        <button onClick={() => handleKeyClick('/')} className="key-tile h-12 text-base font-bold text-cyan-300 bg-cyan-950/30 border-cyan-500/30 flex items-center justify-center">/</button>
        <button onClick={() => handleKeyClick('⌫')} className="key-tile h-12 bg-red-500/10 border-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center" title="Backspace">
          <Delete size={18} />
        </button>
      </div>
    </div>
  );
};
