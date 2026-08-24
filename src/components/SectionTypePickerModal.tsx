import React from 'react';
import { X, Layers, Plus } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-backdrop-fade-in">
      <div className="w-full max-w-md rounded-3xl p-6 glass-modal text-[#e5e2e1] relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-[#d4af37]/20 text-[#f2ca50] border border-[#d4af37]/35">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Add Song Section</h3>
            <p className="text-xs text-[#d0c5af] font-mono">Select a section type to insert</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
          {SECTION_TYPES.map((sec) => (
            <button
              key={sec.type}
              onClick={() => {
                onSelectType(sec.type, sec.label);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d4af37]/40 flex items-center justify-between group transition-all text-left active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${sec.color}`}>
                  {sec.type}
                </span>
              </div>
              <Plus size={16} className="text-zinc-500 group-hover:text-[#f2ca50] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
