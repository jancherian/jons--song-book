import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Music, 
  Trash2, 
  X,
  Sun,
  Moon
} from 'lucide-react';
import type { Song } from '../types/song';
import { NewSongModal } from './NewSongModal';
import { SongCard } from './SongCard';
import { LogoMark } from './LogoMark';
import { triggerHaptic } from '../utils/haptics';
import { MONO_FONT_STACK, DISPLAY_FONT_STACK } from '../utils/typography';

interface HomeScreenProps {
  songs: Song[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSelectSong: (song: Song) => void;
  onPerformSong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onCreateSong: (title: string, artist: string, key: string, bpm: number) => void;
  onDeleteSong: (songId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  songs,
  theme,
  onToggleTheme,
  onSelectSong,
  onPerformSong,
  onToggleFavorite,
  onCreateSong,
  onDeleteSong,
}) => {
  const isDarkMode = theme === 'dark';
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

  const handleToggleFav = (songId: string) => {
    triggerHaptic(15);
    onToggleFavorite(songId);
  };

  const handlePerform = (song: Song) => {
    triggerHaptic(20);
    onPerformSong(song);
  };

  const handleOpenCreateModal = () => {
    triggerHaptic(15);
    setIsNewSongModalOpen(true);
  };

  return (
    <div className={`min-h-screen relative w-full max-w-full overflow-x-hidden transition-colors duration-200 ${
      isDarkMode ? 'chart-grid-bg-dark text-[#F7F4EB]' : 'chart-grid-bg-light text-[#171310]'
    }`}>
      
      {/* Top Header */}
      <header className={`sticky top-0 z-30 px-4 sm:px-6 h-16 flex items-center justify-between gap-3 w-full max-w-full border-b-2 backdrop-blur-md transition-colors duration-200 ${
        isDarkMode ? 'bg-[#100D0A]/95 border-[#3A332C]' : 'bg-[#F7F4EB]/95 border-[#171310]'
      }`}>
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <LogoMark size={32} theme={theme} />
          <h1 
            className={`font-mono text-lg sm:text-xl font-bold tracking-tight truncate ${
              isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
            }`}
            style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
          >
            Chordset
          </h1>
          <span className={`hidden sm:inline font-mono text-xs font-semibold uppercase tracking-wider pl-2 border-l-2 truncate ${
            isDarkMode ? 'text-[#A89C8E] border-[#3D332A]' : 'text-[#171310]/60 border-[#171310]/20'
          }`}>
            Nashville Number System
          </span>
        </div>

        {/* Global Sun/Moon Theme Toggle in Header */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2.5 min-w-[40px] min-h-[40px] rounded-md flex items-center justify-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 border-2 ${
              isDarkMode 
                ? 'bg-[#1A1512] hover:bg-[#241D17] text-[#F7F4EB] border-[#3A332C]' 
                : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#171310]'
            }`}
            title={isDarkMode ? 'Switch to Light paper mode' : 'Switch to Dark mode'}
            aria-label="Toggle light/dark theme"
          >
            {isDarkMode ? <Sun size={17} className="text-[#D9A62E]" /> : <Moon size={17} className="text-[#171310]" />}
            <span className="hidden md:inline font-mono text-xs font-bold uppercase">
              {isDarkMode ? 'LIGHT' : 'DARK'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area with generous bottom padding to prevent FAB overlap */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-36 sm:pb-40 flex flex-col gap-6 sm:gap-8 w-full max-w-full overflow-x-hidden">
        
        {/* Bold Condensed Display Headline (Chart Paper Poster Identity) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h2 
              className={`font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none uppercase ${
                isDarkMode ? 'text-[#F7F4EB]' : 'text-[#171310]'
              }`}
              style={{ fontFamily: DISPLAY_FONT_STACK, fontWeight: 900 }}
            >
              My Songs
            </h2>
          </div>

          <div className="text-left sm:text-right font-mono text-xs font-bold">
            <span 
              className={`px-3 py-1.5 rounded-md inline-block border-2 ${
                isDarkMode 
                  ? 'bg-[#1A1512] text-[#F7F4EB] border-[#3A332C]' 
                  : 'bg-white text-[#171310] border-[#171310]'
              }`}
              style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
            >
              {songs.length} {songs.length === 1 ? 'CHART' : 'CHARTS'}
            </span>
          </div>
        </div>

        {/* Flat Search Bar with Solid 2px Border */}
        <div className="relative w-full">
          <div className={`flex items-center rounded-md px-4 py-3 min-h-[48px] text-sm focus-within:ring-2 focus-within:ring-[#E8432E] border-2 transition-all duration-150 ${
            isDarkMode 
              ? 'bg-[#1A1512] text-[#F7F4EB] border-[#3A332C]' 
              : 'bg-white text-[#171310] border-[#171310]'
          }`}>
            <Search size={18} className={`mr-3 shrink-0 ${isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/50'}`} />
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent text-sm sm:text-base font-sans font-medium focus:outline-none ${
                isDarkMode 
                  ? 'text-[#F7F4EB] placeholder:text-[#A89C8E]/40' 
                  : 'text-[#171310] placeholder:text-[#171310]/40'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  setSearchQuery('');
                }}
                className={`p-2 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
                  isDarkMode ? 'hover:bg-[#241D17] text-[#A89C8E]' : 'hover:bg-[#F7F4EB] text-[#171310]/70'
                }`}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span 
              className={`font-mono text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/70'
              }`}
              style={{ fontFamily: MONO_FONT_STACK }}
            >
              Showing {filteredSongs.length} of {songs.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setActiveFilter('all');
              }}
              style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
              className={`px-3.5 py-2 min-h-[44px] rounded-md font-bold transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center ${
                activeFilter === 'all'
                  ? isDarkMode 
                    ? 'bg-[#F7F4EB] text-[#100D0A] border-[#F7F4EB]' 
                    : 'bg-[#171310] text-[#F7F4EB] border-[#171310]'
                  : isDarkMode
                    ? 'bg-[#1A1512] text-[#F7F4EB] hover:bg-[#241D17] border-[#3A332C]'
                    : 'bg-white text-[#171310] hover:bg-[#F3EFE3] border-[#171310]'
              }`}
            >
              ALL ({songs.length})
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setActiveFilter('favorites');
              }}
              style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
              className={`px-3.5 py-2 min-h-[44px] rounded-md font-bold transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 cursor-pointer border-2 ${
                activeFilter === 'favorites'
                  ? 'bg-[#E8432E] text-[#F7F4EB] border-[#E8432E]'
                  : isDarkMode
                    ? 'bg-[#1A1512] text-[#F7F4EB] hover:bg-[#241D17] border-[#3A332C]'
                    : 'bg-white text-[#171310] hover:bg-[#F3EFE3] border-[#171310]'
              }`}
            >
              <span>★ FAVORITES ({songs.filter(s => s.favorite).length})</span>
            </button>
          </div>
        </div>

        {/* Song Cards List */}
        <div className="space-y-3.5">
          {filteredSongs.length === 0 ? (
            <div className={`p-10 rounded-md text-center space-y-4 border-2 ${
              isDarkMode 
                ? 'bg-[#1A1512] border-[#3A332C] text-[#F7F4EB]' 
                : 'bg-white border-[#171310] text-[#171310]'
            }`}>
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center border-2 ${
                isDarkMode 
                  ? 'bg-[#241D17] text-[#F7F4EB] border-[#3D332A]' 
                  : 'bg-[#F7F4EB] text-[#171310] border-[#171310]'
              }`}>
                <Music size={22} />
              </div>
              <div className="space-y-1">
                <h4 
                  className="font-mono font-bold text-base"
                  style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
                >
                  No charts match your filter
                </h4>
                <p className={`text-xs font-sans font-medium ${isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/60'}`}>
                  {searchQuery ? 'Try adjusting your search criteria' : 'Create your first Nashville Number chart to begin'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
                className={`px-5 py-3 min-h-[44px] bg-[#E8432E] text-[#F7F4EB] hover:bg-[#D03522] font-mono text-xs font-bold rounded-md inline-flex items-center justify-center gap-2 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider border-2 ${
                  isDarkMode ? 'border-[#E8432E]' : 'border-[#171310]'
                }`}
              >
                <Plus size={15} />
                <span>CREATE FIRST CHART</span>
              </button>
            </div>
          ) : (
            filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                theme={theme}
                onSelectSong={(s) => {
                  triggerHaptic(15);
                  onSelectSong(s);
                }}
                onPerformSong={handlePerform}
                onToggleFavorite={handleToggleFav}
                onRequestDelete={(id) => {
                  triggerHaptic(15);
                  setSongToDelete(id);
                }}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={handleOpenCreateModal}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-14 h-14 min-w-[56px] min-h-[56px] bg-[#E8432E] hover:bg-[#D03522] text-[#F7F4EB] rounded-full hover:scale-110 active:scale-95 transition-all duration-150 flex items-center justify-center cursor-pointer border-2 ${
          isDarkMode ? 'border-[#F7F4EB]' : 'border-[#171310]'
        }`}
        title="Create new song"
        aria-label="Create new song"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* New Song Modal */}
      <NewSongModal
        isOpen={isNewSongModalOpen}
        theme={theme}
        onClose={() => setIsNewSongModalOpen(false)}
        onCreate={(title, artist, key, bpm) => {
          triggerHaptic(20);
          onCreateSong(title, artist, key, bpm);
        }}
      />

      {/* Delete Confirmation Modal */}
      {songToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className={`w-full max-w-sm p-6 rounded-md space-y-4 border-2 ${
            isDarkMode 
              ? 'bg-[#1A1512] text-[#F7F4EB] border-[#3A332C]' 
              : 'bg-[#FBF9F2] text-[#171310] border-[#171310]'
          }`}>
            <div className="flex items-center gap-2.5 text-[#E8432E]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                isDarkMode 
                  ? 'bg-red-950/40 text-[#E8432E] border-[#3D332A]' 
                  : 'bg-red-100 text-[#E8432E] border-[#171310]'
              }`}>
                <Trash2 size={20} />
              </div>
              <h3 
                className="font-mono text-lg font-bold"
                style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
              >
                Delete chart?
              </h3>
            </div>
            <p className={`text-xs font-sans font-medium leading-relaxed ${
              isDarkMode ? 'text-[#A89C8E]' : 'text-[#171310]/70'
            }`}>
              Are you sure you want to remove this chart from your repertoire? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSongToDelete(null)}
                style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
                className={`px-4 py-2.5 min-h-[44px] font-mono text-xs font-bold rounded-md transition-all duration-150 hover:scale-105 active:scale-95 border-2 ${
                  isDarkMode 
                    ? 'bg-[#241D17] hover:bg-[#332A22] text-[#F7F4EB] border-[#3D332A]' 
                    : 'bg-white hover:bg-[#F3EFE3] text-[#171310] border-[#171310]'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(25);
                  onDeleteSong(songToDelete);
                  setSongToDelete(null);
                }}
                style={{ fontFamily: MONO_FONT_STACK, fontWeight: 700 }}
                className="px-4 py-2.5 min-h-[44px] bg-[#E8432E] hover:bg-[#D03522] text-[#F7F4EB] font-mono text-xs font-bold rounded-md transition-all duration-150 hover:scale-105 active:scale-95 uppercase tracking-wider border-2 border-[#E8432E]"
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
