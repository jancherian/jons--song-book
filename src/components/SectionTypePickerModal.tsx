import React from 'react';
import { X, Plus } from 'lucide-react';
import type { SectionType } from '../types/song';
import { SECTION_TYPES } from '../utils/nashville';
import { triggerHaptic } from '../utils/haptics';
import { MONO_FONT_STACK } from '../utils/typography';

interface SectionTypePickerModalProps {
  isOpen: boolean;
  theme?: 'light' | 'dark';
  onClose: () => void;
  onSelectType: (type: SectionType, label: string) => void;
}

export const SectionTypePickerModal: React.FC<SectionTypePickerModalProps> = ({
  isOpen,
  theme = 'light',
  onClose,
  onSelectType,
}) => {
  const isDarkMode = theme === 'dark';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className={`w-full max-w-md p-6 rounded-md relative space-y-4 border-2 ${
        isDarkMode 
          ? 'bg-[#1A1512] text-[#F7F4EB] border-[#3A332C]' 
          : 'bg-[#FBF9F2] text-[#171310] border-[#171310]'
      }`}>
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onClose();
          }}
          className={`absolute top-4 right-4 p-2 min-w-[36px] min-h-[36px] rounded-md transition-colors border border-transparent flex items-center justify-center ${
            isDarkMode 
              ? 'text-[#A89C8E] hover:text-[#F7F4EB] hover:bg-[#241D17] hover:border-[#3D332A]' 
              : 'text-[#171310]/50 hover:text-[#171310] hover:bg-white hover:border-[#171310]'
          }`}
        >
          <X size={18} />
        </button>

        <div>
          <span 
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#E8432E] block mb-1"
            style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
          >
            Section Selector
          </span>
          <h3 
            className={`font-mono text-xl sm:text-2xl font-bold tracking-tight ${
              isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
            }`}
            style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
          >
            Add Section Type
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono">
          {SECTION_TYPES.map((sec, idx) => (
            <button
              key={sec.type}
              type="button"
              onClick={() => {
                triggerHaptic(20);
                onSelectType(sec.type, sec.label);
                onClose();
              }}
              className={`p-3.5 min-h-[48px] rounded-md flex items-center justify-between group transition-all duration-150 text-left cursor-pointer hover:scale-105 active:scale-95 border-2 ${
                isDarkMode 
                  ? 'bg-[#241D17] hover:bg-[#E8432E] hover:text-[#F7F4EB] text-[#F7F4EB] border-[#3D332A]' 
                  : 'bg-white hover:bg-[#E8432E] hover:text-[#F7F4EB] text-[#171310] border-[#171310]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="font-mono text-xs font-black bg-[#D9A62E] text-[#100D0A] px-2 py-0.5 rounded border border-[#171310] group-hover:bg-[#F7F4EB]"
                  style={{ fontFamily: MONO_FONT_STACK, fontWeight: 900 }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span 
                  className={`text-xs font-bold uppercase tracking-wider group-hover:text-[#F7F4EB] ${
                    isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
                  }`}
                  style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
                >
                  {sec.type}
                </span>
              </div>
              <Plus size={16} className={`transition-colors group-hover:text-[#F7F4EB] ${
                isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/50'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
