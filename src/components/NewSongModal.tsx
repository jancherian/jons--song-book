import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { MAJOR_KEYS } from '../utils/nashville';
import { triggerHaptic } from '../utils/haptics';

interface NewSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, artist: string, key: string, bpm: number) => void;
}

export const NewSongModal: React.FC<NewSongModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [selectedKey, setSelectedKey] = useState('G');
  const [bpm, setBpm] = useState<number>(75);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    triggerHaptic(20);
    onCreate(title.trim(), artist.trim(), selectedKey, bpm);
    setTitle('');
    setArtist('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md p-6 bg-[#FBF9F2] rounded-md text-[#171310] relative space-y-5 border-2 border-[#171310]">
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
            New Chart
          </span>
          <h3 
            className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#171310]"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            Create Song
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label 
              className="font-mono text-[#171310] block mb-1.5 font-bold text-xs uppercase tracking-wider"
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            >
              Song title <span className="text-[#E8432E]">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder="e.g. Amazing Grace, Stand By Me"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              className="w-full px-3.5 py-2.5 min-h-[44px] bg-white rounded-md text-sm text-[#171310] font-mono font-bold placeholder:text-[#171310]/40 placeholder:font-normal placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#E8432E] border-2 border-[#171310] transition-all duration-150"
            />
          </div>

          <div>
            <label 
              className="font-mono text-[#171310] block mb-1.5 font-bold text-xs uppercase tracking-wider"
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            >
              Artist / Band (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. John Newton, Ben E. King"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] bg-white rounded-md text-sm text-[#171310] font-sans font-medium placeholder:text-[#171310]/40 focus:outline-none focus:ring-2 focus:ring-[#E8432E] border-2 border-[#171310] transition-all duration-150"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <label 
                className="text-[#171310] block mb-1.5 font-bold text-xs uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              >
                Default key
              </label>
              <select
                value={selectedKey}
                onChange={(e) => {
                  triggerHaptic(10);
                  setSelectedKey(e.target.value);
                }}
                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-white rounded-md text-sm text-[#171310] font-bold focus:outline-none focus:ring-2 focus:ring-[#E8432E] border-2 border-[#171310] cursor-pointer transition-all duration-150"
              >
                {MAJOR_KEYS.map((k) => (
                  <option key={k} value={k}>Key of {k}</option>
                ))}
              </select>
            </div>

            <div>
              <label 
                className="text-[#171310] block mb-1.5 font-bold text-xs uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              >
                Tempo (BPM)
              </label>
              <input
                type="number"
                min={30}
                max={250}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-white rounded-md text-sm text-[#171310] font-bold focus:outline-none focus:ring-2 focus:ring-[#E8432E] border-2 border-[#171310] transition-all duration-150"
              />
            </div>
          </div>

          <div className="pt-3 border-t-2 border-[#171310]/15 flex justify-end gap-2 font-mono">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                onClose();
              }}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              className="px-4 py-2.5 min-h-[44px] bg-white hover:bg-[#F3EFE3] text-[#171310] text-xs font-bold rounded-md transition-all duration-150 hover:scale-105 active:scale-95 border-2 border-[#171310]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              className="px-5 py-2.5 min-h-[44px] bg-[#E8432E] hover:bg-[#D03522] text-[#F7F4EB] text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer uppercase tracking-wider border-2 border-[#171310]"
            >
              <Plus size={15} />
              <span>CREATE CHART</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
