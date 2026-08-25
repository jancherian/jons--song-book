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
import { triggerHaptic } from '../utils/haptics';

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
    triggerHaptic(15);
    const updated = applyKeypadInput(currentChord, key);
    onChangeChord(updated);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full px-3 sm:px-8 pb-6 sm:pb-8 pt-3 bg-[#F7F4EB] border-t-2 border-[#171310] z-50 select-none max-w-full overflow-x-hidden pb-safe">
      
      {/* Top Preview Bar & Controls */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4 mb-3 p-2.5 sm:p-3 bg-white rounded-md font-mono border-2 border-[#171310]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div 
            className="w-9 h-9 min-w-[36px] bg-[#D9A62E] text-[#171310] rounded border border-[#171310] flex items-center justify-center font-black text-xs shrink-0"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 900 }}
          >
            #{slotIndex !== undefined ? slotIndex + 1 : '1'}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#171310]/60 uppercase tracking-wider block truncate">
              {sectionLabel || 'Section slot'}
            </span>
            <span 
              className="text-xl sm:text-2xl font-bold text-[#171310] truncate"
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            >
              {currentChord || <span className="text-[#171310]/30 font-normal italic font-sans">(Empty)</span>}
            </span>
          </div>
        </div>

        {/* Navigation & Slot Controls */}
        <div className="flex items-center gap-1.5 text-xs shrink-0 font-mono font-bold">
          {onPrevSlot && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                onPrevSlot();
              }}
              title="Previous slot"
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-md bg-white hover:bg-[#F3EFE3] text-[#171310] transition-all duration-150 hover:scale-105 active:scale-95 border-2 border-[#171310] flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {onNextSlot && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                onNextSlot();
              }}
              title="Next slot"
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-md bg-white hover:bg-[#F3EFE3] text-[#171310] transition-all duration-150 hover:scale-105 active:scale-95 border-2 border-[#171310] flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          )}
          {onAddNewSlot && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onAddNewSlot();
              }}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              title="Add chord slot"
              className="px-3.5 py-2 min-h-[44px] rounded-md bg-[#171310] hover:bg-[#2E2520] text-[#F7F4EB] font-bold flex items-center justify-center gap-1 text-xs transition-all duration-150 hover:scale-105 active:scale-95 uppercase border-2 border-[#171310]"
            >
              <Plus size={15} />
              <span>ADD</span>
            </button>
          )}
          {onDeleteSlot && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onDeleteSlot();
              }}
              title="Delete slot"
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-md bg-white hover:bg-red-50 text-[#171310]/60 hover:text-[#E8432E] transition-all duration-150 hover:scale-105 active:scale-95 border-2 border-[#171310] flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              onClose();
            }}
            title="Done / Close"
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-md bg-[#171310] hover:bg-[#2E2520] text-[#F7F4EB] transition-all duration-150 ml-0.5 hover:scale-105 active:scale-95 border-2 border-[#171310] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Keypad Matrix with Solid Ink Border Chart Keys */}
      <div className="max-w-4xl mx-auto flex flex-col gap-1.5 sm:gap-2 font-mono font-bold">
        
        {/* Row 1: Scale Degree Numbers (1 - 7) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {['1', '2', '3', '4', '5', '6', '7'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyClick(num)}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              className="rounded-md bg-white hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xl sm:text-2xl h-12 sm:h-14 min-h-[44px] flex items-center justify-center transition-all duration-150 cursor-pointer border-2 border-[#171310]"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Row 2: Basic Modifiers & Accidentals */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 sm:gap-2">
          <button type="button" onClick={() => handleKeyClick('m')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-sm sm:text-base h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">m</button>
          <button type="button" onClick={() => handleKeyClick('#')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-sm sm:text-base h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">#</button>
          <button type="button" onClick={() => handleKeyClick('b')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-sm sm:text-base h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">b</button>
          <button type="button" onClick={() => handleKeyClick('dim')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs sm:text-sm h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">dim</button>
          <button type="button" onClick={() => handleKeyClick('aug')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs sm:text-sm h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">aug</button>
          <button type="button" onClick={() => handleKeyClick('/')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FAF0D7] hover:bg-[#F5E6BF] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#9E7314] font-bold text-base sm:text-lg h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">/</button>
          <button type="button" onClick={() => handleKeyClick('M7')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs sm:text-sm h-11 min-h-[44px] hidden sm:flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">M7</button>
          <button type="button" onClick={() => handleKeyClick('m7')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs sm:text-sm h-11 min-h-[44px] hidden sm:flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">m7</button>
        </div>

        {/* Row 3: Extensions & Backspace */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
          <button type="button" onClick={() => handleKeyClick('M7')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs h-11 min-h-[44px] sm:hidden flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">M7</button>
          <button type="button" onClick={() => handleKeyClick('m7')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs h-11 min-h-[44px] sm:hidden flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">m7</button>
          <button type="button" onClick={() => handleKeyClick('sus4')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs sm:text-sm h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">sus4</button>
          <button type="button" onClick={() => handleKeyClick('sus2')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs sm:text-sm h-11 min-h-[44px] flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">sus2</button>
          <button type="button" onClick={() => handleKeyClick('2')} style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }} className="rounded-md bg-[#FBF9F2] hover:bg-[#F3EFE3] hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#171310] font-bold text-xs sm:text-sm h-11 min-h-[44px] hidden sm:flex items-center justify-center transition-all duration-150 border-2 border-[#171310]">add9</button>
          
          {/* Bold Backspace Key with 44px min height */}
          <button
            type="button"
            onClick={() => handleKeyClick('⌫')}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className="rounded-md bg-red-50 hover:bg-red-100 hover:scale-105 active:scale-95 active:bg-[#E8432E] active:text-[#F7F4EB] text-[#E8432E] col-span-2 sm:col-span-2 h-11 min-h-[44px] font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer uppercase border-2 border-[#171310]"
            title="Backspace"
          >
            <Delete size={18} />
            <span>DELETE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
