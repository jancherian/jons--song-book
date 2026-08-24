import React from 'react';
import { 
  Delete, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
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
    <div className="fixed bottom-0 left-0 w-full px-4 sm:px-8 pb-6 pt-4 bg-[#F2F2F2] border-t-4 border-black z-50 swiss-dots select-none shadow-[0_-8px_0px_rgba(0,0,0,0.15)]">
      
      {/* Top Preview Bar & Controls */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 mb-4 pb-3 border-b-2 border-black bg-white p-3 border-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF3000] text-white flex items-center justify-center font-mono font-black text-xs">
            #{slotIndex !== undefined ? slotIndex + 1 : '1'}
          </div>
          <div>
            <span className="text-[10px] font-mono font-black text-neutral-500 uppercase tracking-widest block">
              {sectionLabel || 'SECTION SLOT'}
            </span>
            <span className="text-2xl font-black text-black font-sans uppercase tracking-tight">
              {currentChord || <span className="text-neutral-400 font-normal italic">(EMPTY)</span>}
            </span>
          </div>
        </div>

        {/* Navigation & Slot Controls */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {onPrevSlot && (
            <button
              onClick={onPrevSlot}
              title="Previous Slot"
              className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-100"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {onNextSlot && (
            <button
              onClick={onNextSlot}
              title="Next Slot"
              className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-100"
            >
              <ChevronRight size={16} />
            </button>
          )}
          {onAddNewSlot && (
            <button
              onClick={onAddNewSlot}
              title="Append Slot"
              className="px-3 py-2 border-2 border-black bg-black text-white hover:bg-[#FF3000] hover:border-[#FF3000] font-black flex items-center gap-1 uppercase transition-colors duration-100"
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          )}
          {onDeleteSlot && (
            <button
              onClick={onDeleteSlot}
              title="Delete Slot"
              className="p-2 border-2 border-black bg-white hover:bg-[#FF3000] hover:text-white hover:border-[#FF3000] transition-colors duration-100 text-neutral-600"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            title="Done / Close"
            className="p-2 border-2 border-black bg-black text-white hover:bg-[#FF3000] hover:border-[#FF3000] transition-colors duration-100 ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Swiss Keypad Matrix (Visual division between Numbers and Modifiers) */}
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        
        {/* Row 1: Scale Degree Numbers (1 - 7) */}
        <div className="grid grid-cols-7 gap-2">
          {['1', '2', '3', '4', '5', '6', '7'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyClick(num)}
              className="swiss-key text-xl font-black h-12 sm:h-14"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Dividing Rule between Numbers & Qualities */}
        <div className="h-[2px] bg-black my-0.5" />

        {/* Row 2: Basic Modifiers & Accidentals */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          <button onClick={() => handleKeyClick('m')} className="swiss-key text-base font-black h-11 bg-neutral-100">m</button>
          <button onClick={() => handleKeyClick('#')} className="swiss-key text-base font-black h-11 bg-neutral-100">#</button>
          <button onClick={() => handleKeyClick('b')} className="swiss-key text-base font-black h-11 bg-neutral-100">b</button>
          <button onClick={() => handleKeyClick('dim')} className="swiss-key text-xs font-black h-11 bg-neutral-100">dim</button>
          <button onClick={() => handleKeyClick('aug')} className="swiss-key text-xs font-black h-11 bg-neutral-100">aug</button>
          <button onClick={() => handleKeyClick('/')} className="swiss-key text-base font-black h-11 bg-neutral-200 text-[#FF3000] border-[#FF3000]">/</button>
          <button onClick={() => handleKeyClick('M7')} className="swiss-key text-xs font-black h-11 hidden sm:flex">M7</button>
          <button onClick={() => handleKeyClick('m7')} className="swiss-key text-xs font-black h-11 hidden sm:flex">m7</button>
        </div>

        {/* Row 3: Extensions & Backspace */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          <button onClick={() => handleKeyClick('M7')} className="swiss-key text-xs font-black h-11 sm:hidden">M7</button>
          <button onClick={() => handleKeyClick('m7')} className="swiss-key text-xs font-black h-11 sm:hidden">m7</button>
          <button onClick={() => handleKeyClick('sus4')} className="swiss-key text-xs font-black h-11">sus4</button>
          <button onClick={() => handleKeyClick('sus2')} className="swiss-key text-xs font-black h-11">sus2</button>
          <button onClick={() => handleKeyClick('2')} className="swiss-key text-xs font-black h-11 hidden sm:flex">add9</button>
          
          {/* Distinct Outlined Backspace Key */}
          <button
            onClick={() => handleKeyClick('⌫')}
            className="swiss-key border-2 border-black text-black bg-white hover:bg-[#FF3000] hover:text-white hover:border-[#FF3000] col-span-2 sm:col-span-2 h-11 font-mono font-black text-xs flex items-center justify-center gap-1.5"
            title="Backspace"
          >
            <Delete size={16} />
            <span>BACKSPACE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
