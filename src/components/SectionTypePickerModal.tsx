import React from 'react';
import { X, Plus } from 'lucide-react';
import type { SectionType } from '../types/song';
import { SECTION_TYPES } from '../utils/nashville';
import { triggerHaptic } from '../utils/haptics';

interface SectionTypePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: SectionType, label: string) => void;
}

export const SectionTypePickerModal: React.FC<SectionTypePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md p-6 bg-[#FBF9F2] rounded-md text-[#171310] relative space-y-4 border-2 border-[#171310]">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onClose();
          }}
          className="absolute top-4 right-4 text-[#171310]/50 hover:text-[#171310] hover:bg-white p-2 min-w-[36px] min-h-[36px] rounded-md transition-colors border border-transparent hover:border-[#171310] flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <div>
          <span 
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#E8432E] block mb-1"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            Section Selector
          </span>
          <h3 
            className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#171310]"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
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
              className="p-3.5 min-h-[48px] rounded-md bg-white hover:bg-[#E8432E] hover:text-[#F7F4EB] flex items-center justify-between group transition-all duration-150 text-left cursor-pointer hover:scale-105 active:scale-95 border-2 border-[#171310]"
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="font-mono text-xs font-black bg-[#D9A62E] text-[#171310] px-2 py-0.5 rounded border border-[#171310] group-hover:bg-[#F7F4EB]"
                  style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 900 }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span 
                  className="text-xs font-bold uppercase tracking-wider text-[#171310] group-hover:text-[#F7F4EB]"
                  style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                >
                  {sec.type}
                </span>
              </div>
              <Plus size={16} className="text-[#171310]/50 group-hover:text-[#F7F4EB] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
