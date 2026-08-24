import React from 'react';
import { X, Plus } from 'lucide-react';
import type { SectionType } from '../types/song';
import { SECTION_TYPES } from '../utils/nashville';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-md p-6 swiss-dialog text-black relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black hover:bg-black hover:text-white p-1.5 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="border-b-2 border-black pb-4 mb-5">
          <span className="text-[10px] font-mono font-black text-[#FF3000] uppercase tracking-[0.25em] block mb-1">
            Section Selector
          </span>
          <h3 className="text-xl font-black tracking-tight text-black uppercase font-sans">
            ADD SECTION TYPE
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 font-mono">
          {SECTION_TYPES.map((sec, idx) => (
            <button
              key={sec.type}
              onClick={() => {
                onSelectType(sec.type, sec.label);
                onClose();
              }}
              className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-between group transition-colors duration-100 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#FF3000]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-black uppercase tracking-wider">
                  {sec.type}
                </span>
              </div>
              <Plus size={14} className="text-neutral-400 group-hover:text-[#FF3000] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
