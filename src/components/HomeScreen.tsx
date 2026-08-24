import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Menu, 
  Music, 
  Layers, 
  Edit3, 
  Play
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
  onNavigateTab?: (tab: 'songs' | 'editor' | 'stage') => void;
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
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] font-sans pb-36 relative selection:bg-[#d4af37]/30">
      
      {/* Background Atmospheric Blur Orbs from Stitch */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#d4af37]/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#393939]/20 blur-[150px] mix-blend-screen" />
      </div>

      {/* TopAppBar (Shared Stitch Component) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <button 
          aria-label="Menu" 
          className="text-[#f2ca50] hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-200"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg sm:text-xl font-extrabold text-[#f2ca50] tracking-tight truncate px-2 font-sans">
          Jon's Song Book
        </h1>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsNewSongModalOpen(true)}
            aria-label="New Song" 
            className="text-[#f2ca50] hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-200"
            title="Create Song"
          >
            <Plus size={22} />
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="relative z-10 pt-24 px-5 sm:px-8 flex flex-col gap-6 max-w-3xl mx-auto">
        
        {/* Hero Title Section matching Stitch 1:1 */}
        <div className="flex flex-col items-center text-center mt-4 mb-2">
          <h2 className="text-[46px] sm:text-[54px] leading-[1.05] font-black text-white tracking-tighter">
            Jon's
          </h2>
          <h3 className="text-xs sm:text-sm font-extrabold text-[#d4af37] tracking-[0.35em] mt-1.5 text-glow-gold uppercase">
            SONG BOOK
          </h3>
        </div>

        {/* Glass-morphic Capsule Search Bar matching Stitch */}
        <div className="relative w-full group">
          <div className="absolute inset-0 bg-[#d4af37]/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f2ca50]/70 z-20" />
          <input
            type="text"
            placeholder="Find a song or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-12 bg-black/40 backdrop-blur-2xl border border-[#d4af37]/30 rounded-full text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37]/80 focus:bg-black/60 transition-all duration-300 relative z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white z-20 bg-white/10 px-2.5 py-1 rounded-full"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel font-mono text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-xl transition-all font-bold ${
                activeFilter === 'all'
                  ? 'bg-[#f2ca50] text-[#121212] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({songs.length})
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-4 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1.5 ${
                activeFilter === 'favorites'
                  ? 'bg-[#f2ca50] text-[#121212] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>★ Favorites ({songs.filter(s => s.favorite).length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-500">
            {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
          </span>
        </div>

        {/* Songs List */}
        <div className="space-y-3.5">
          {filteredSongs.length === 0 ? (
            <div className="p-12 rounded-[1.5rem] glass-panel text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 mx-auto flex items-center justify-center">
                <Music size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">No songs found</h4>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  {searchQuery ? 'Try adjusting your search query' : 'Create your first Nashville Number chart to get started!'}
                </p>
              </div>
              <button
                onClick={() => setIsNewSongModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#d4af37]/20 text-[#f2ca50] border border-[#d4af37]/35 text-xs font-mono font-bold inline-flex items-center gap-2 hover:bg-[#d4af37]/30 transition-all"
              >
                <Plus size={14} />
                <span>Add First Song</span>
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

      {/* Floating Action Button (Stitch FAB) positioned at bottom-24 */}
      <button
        onClick={() => setIsNewSongModalOpen(true)}
        className="fixed bottom-24 right-6 z-40 stitch-fab flex items-center justify-center"
        title="Create New Song"
      >
        <Plus size={28} />
      </button>

      {/* Bottom Navigation Bar matching Stitch */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-2.5 bg-black/50 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
        {/* Active Tab: Songs */}
        <button className="flex flex-col items-center justify-center text-[#f2ca50] drop-shadow-[0_0_8px_rgba(242,202,80,0.4)] scale-105 transition-transform duration-300">
          <Layers size={20} className="mb-1" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Songs</span>
        </button>

        {/* Editor Tab */}
        <button 
          onClick={() => {
            if (songs.length > 0) onSelectSong(songs[0]);
          }}
          className="flex flex-col items-center justify-center text-white/60 hover:text-[#f2ca50] transition-colors"
        >
          <Edit3 size={20} className="mb-1" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Editor</span>
        </button>

        {/* Stage Tab */}
        <button 
          onClick={() => {
            if (songs.length > 0) onPerformSong(songs[0]);
          }}
          className="flex flex-col items-center justify-center text-white/60 hover:text-[#f2ca50] transition-colors"
        >
          <Play size={20} className="mb-1" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Stage</span>
        </button>
      </nav>

      {/* New Song Modal */}
      <NewSongModal
        isOpen={isNewSongModalOpen}
        onClose={() => setIsNewSongModalOpen(false)}
        onCreate={onCreateSong}
      />

      {/* Delete Confirmation Modal */}
      {songToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-backdrop-fade-in">
          <div className="w-full max-w-sm rounded-3xl p-6 glass-modal text-white space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-white">Delete Song Chart?</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Are you sure you want to remove this song from your repertoire? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSongToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteSong(songToDelete);
                  setSongToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono font-bold shadow-lg shadow-rose-500/20"
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
