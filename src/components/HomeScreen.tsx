import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Music, 
  Trash2
} from 'lucide-react';
import type { Song } from '../types/song';
import { NewSongModal } from './NewSongModal';
import { SongCard } from './SongCard';

interface HomeScreenProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  onPerformSong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onCreateSong: (title: string, artist: string, key: string, bpm: number) => void;
  onDeleteSong: (songId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  songs,
  onSelectSong,
  onPerformSong,
  onToggleFavorite,
  onCreateSong,
  onDeleteSong,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites'>('all');
  const [isNewSongModalOpen, setIsNewSongModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);

  const filteredSongs = songs.filter((song) => {
    const matchesSearch = 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || song.favorite;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white text-black font-sans swiss-grid pb-32 relative w-full max-w-full overflow-x-hidden">
      
      {/* Top Header Rule */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black px-4 sm:px-6 h-16 flex items-center justify-between gap-3 w-full max-w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#FF3000] shrink-0" />
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-black uppercase font-sans truncate">
            CHORDSET
          </h1>
          <span className="hidden sm:inline text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest pl-2 border-l border-neutral-300 truncate">
            Nashville Number System
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsNewSongModalOpen(true)}
            className="swiss-btn px-3 sm:px-4 py-1.5 sm:py-2 text-xs"
          >
            <Plus size={14} className="mr-1 sm:mr-1.5" />
            <span>New Song</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 flex flex-col gap-6 sm:gap-8 w-full max-w-full overflow-x-hidden">
        
        {/* Swiss Asymmetric Hero Header */}
        <div className="border-b-4 border-black pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-black text-[#FF3000] uppercase tracking-[0.25em] block mb-1">
              Objective Chord Charts // 2026
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-black uppercase tracking-tight leading-none font-sans">
              REPERTOIRE
            </h2>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-neutral-600">
            <span className="font-bold text-black block">{songs.length} TOTAL CHARTS</span>
            <span>STANDARD TUNING // NASHVILLE</span>
          </div>
        </div>

        {/* Swiss Search Bar (Underlined input per Swiss convention) */}
        <div className="relative w-full">
          <div className="flex items-center border-b-2 border-black focus-within:border-[#FF3000] transition-colors duration-150 py-2">
            <Search size={20} className="text-black mr-3 shrink-0" />
            <input
              type="text"
              placeholder="FILTER BY TITLE OR ARTIST..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-base sm:text-lg font-mono font-bold uppercase placeholder:text-neutral-400 focus:outline-none tracking-wider"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-0.5 text-xs font-mono font-bold bg-neutral-200 hover:bg-black hover:text-white transition-colors"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Section Header: "MY SONGS" + Filter Controls */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-mono font-black text-black uppercase tracking-widest">
              MY SONGS
            </h3>
            <span className="text-xs font-mono font-black text-[#FF3000]">
              [{filteredSongs.length}]
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 border border-black font-black uppercase transition-colors duration-150 ${
                activeFilter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              All ({songs.length})
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-1 border border-black font-black uppercase transition-colors duration-150 flex items-center gap-1 ${
                activeFilter === 'favorites'
                  ? 'bg-[#FF3000] text-white border-[#FF3000]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              <span>★ Favs ({songs.filter(s => s.favorite).length})</span>
            </button>
          </div>
        </div>

        {/* Song Cards List */}
        <div className="space-y-4">
          {filteredSongs.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-neutral-400 text-center space-y-4 bg-[#F2F2F2]">
              <div className="w-12 h-12 border-2 border-black bg-white mx-auto flex items-center justify-center text-black">
                <Music size={24} />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-tight text-black">No charts match your filter</h4>
                <p className="text-xs text-neutral-600 font-mono mt-1 uppercase">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Create your first Nashville Number chart to begin'}
                </p>
              </div>
              <button
                onClick={() => setIsNewSongModalOpen(true)}
                className="swiss-btn px-4 py-2 text-xs"
              >
                <Plus size={14} className="mr-1.5" />
                <span>Create First Chart</span>
              </button>
            </div>
          ) : (
            filteredSongs.map((song, idx) => (
              <SongCard
                key={song.id}
                song={song}
                index={idx}
                onSelectSong={onSelectSong}
                onPerformSong={onPerformSong}
                onToggleFavorite={onToggleFavorite}
                onRequestDelete={setSongToDelete}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button (Swiss Red square with 2px border) */}
      <button
        onClick={() => setIsNewSongModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-[#FF3000] text-white border-2 border-black shadow-[4px_4px_0px_#000000] hover:bg-black hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 flex items-center justify-center"
        title="Create New Song"
      >
        <Plus size={28} />
      </button>

      {/* New Song Modal */}
      <NewSongModal
        isOpen={isNewSongModalOpen}
        onClose={() => setIsNewSongModalOpen(false)}
        onCreate={onCreateSong}
      />

      {/* Delete Confirmation Modal */}
      {songToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm p-6 swiss-dialog space-y-4">
            <div className="flex items-center gap-2 text-[#FF3000]">
              <Trash2 size={20} />
              <h3 className="text-lg font-black uppercase text-black">Delete Chart?</h3>
            </div>
            <p className="text-xs text-neutral-600 font-mono uppercase">
              Are you sure you want to remove this chart from your repertoire? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
              <button
                onClick={() => setSongToDelete(null)}
                className="swiss-btn-outline px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteSong(songToDelete);
                  setSongToDelete(null);
                }}
                className="swiss-btn-accent px-4 py-2 text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
