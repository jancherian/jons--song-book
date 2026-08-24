import React, { useState } from 'react';
import { X, Plus, Music } from 'lucide-react';
import { MAJOR_KEYS } from '../utils/nashville';

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
    onCreate(title.trim(), artist.trim(), selectedKey, bpm);
    setTitle('');
    setArtist('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-backdrop-fade-in">
      <div className="w-full max-w-md rounded-3xl p-6 glass-modal text-[#e5e2e1] relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#d4af37]/20 text-[#f2ca50] border border-[#d4af37]/35">
            <Music size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">New Nashville Chart</h3>
            <p className="text-xs text-[#d0c5af] font-mono">Create a new song for your repertoire</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="text-zinc-300 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">
              Song Title <span className="text-[#f2ca50]">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder="e.g. Goodness of God, Stand by Me"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#1c1b1b]/90 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>

          <div>
            <label className="text-zinc-300 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">
              Artist / Band (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ben E. King, John Denver"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#1c1b1b]/90 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                Default Key
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#1c1b1b]/90 border border-white/15 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              >
                {MAJOR_KEYS.map((k) => (
                  <option key={k} value={k}>Key of {k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-300 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                Tempo (BPM)
              </label>
              <input
                type="number"
                min={30}
                max={250}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#1c1b1b]/90 border border-white/15 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#f2ca50] to-[#d4af37] hover:from-[#ffe088] hover:to-[#e9c349] disabled:opacity-50 text-[#1e1700] font-black text-xs flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/25 active:scale-95 transition-all"
            >
              <Plus size={15} />
              <span>Create Song</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
