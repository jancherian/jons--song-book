import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-md p-6 swiss-dialog text-black relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black hover:bg-black hover:text-white p-1.5 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="border-b-2 border-black pb-4 mb-6">
          <span className="text-[10px] font-mono font-black text-[#FF3000] uppercase tracking-[0.25em] block mb-1">
            New Repertoire Chart
          </span>
          <h3 className="text-2xl font-black tracking-tight text-black uppercase font-sans">
            CREATE SONG
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
          <div>
            <label className="text-black block mb-1 font-black uppercase tracking-wider text-[11px]">
              Song Title <span className="text-[#FF3000]">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder="E.G. AMAZING GRACE, STAND BY ME"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-100 border-b-2 border-black text-sm text-black uppercase font-bold placeholder:text-neutral-400 focus:outline-none focus:border-[#FF3000] transition-colors"
            />
          </div>

          <div>
            <label className="text-black block mb-1 font-black uppercase tracking-wider text-[11px]">
              Artist / Band (Optional)
            </label>
            <input
              type="text"
              placeholder="E.G. JOHN NEWTON, BEN E. KING"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-100 border-b-2 border-black text-sm text-black uppercase font-bold placeholder:text-neutral-400 focus:outline-none focus:border-[#FF3000] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-black block mb-1 font-black uppercase tracking-wider text-[11px]">
                Default Key
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-100 border-b-2 border-black text-sm text-black uppercase font-bold focus:outline-none focus:border-[#FF3000] cursor-pointer transition-colors"
              >
                {MAJOR_KEYS.map((k) => (
                  <option key={k} value={k}>Key of {k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-black block mb-1 font-black uppercase tracking-wider text-[11px]">
                Tempo (BPM)
              </label>
              <input
                type="number"
                min={30}
                max={250}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-neutral-100 border-b-2 border-black text-sm text-black uppercase font-bold focus:outline-none focus:border-[#FF3000] transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-black flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="swiss-btn-outline px-4 py-2.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="swiss-btn-accent px-5 py-2.5 text-xs flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Create Chart</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
