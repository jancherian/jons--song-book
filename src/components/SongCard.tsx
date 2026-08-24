import React from 'react';
import { 
  Star, 
  Play, 
  Trash2, 
  ChevronRight
} from 'lucide-react';
import type { Song } from '../types/song';
import { SECTION_TYPES } from '../utils/nashville';

interface SongCardProps {
  song: Song;
  index: number;
  onSelectSong: (song: Song) => void;
  onPerformSong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onRequestDelete: (songId: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  index,
  onSelectSong,
  onPerformSong,
  onToggleFavorite,
  onRequestDelete,
}) => {
  const totalSections = song.sections.length;

  return (
    <div
      onClick={() => onSelectSong(song)}
      className="glass-panel glass-panel-hover animate-card relative rounded-[1.5rem] p-5 flex flex-col gap-3.5 cursor-pointer transition-all duration-300"
      style={{ animationDelay: `${(index + 1) * 80}ms` }}
    >
      {/* Top Row: Title + Star Favorite */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="text-xl font-bold text-white group-hover:text-[#f2ca50] transition-colors truncate tracking-tight font-sans">
            {song.title}
          </h4>
          
          {/* Metadata Row matching Stitch: [X SECTIONS] • [KEY OF X] • [ARTIST] */}
          <div className="flex items-center gap-2.5 text-[11px] font-mono font-bold text-white/70 tracking-wider uppercase">
            <span>{totalSections} {totalSections === 1 ? 'Section' : 'Sections'}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            {song.key && (
              <>
                <span className="text-[#f2ca50]">Key of {song.key}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
              </>
            )}
            <span className="text-[#d0c5af] truncate">{song.artist || 'Traditional'}</span>
          </div>
        </div>

        {/* Favorite Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(song.id);
          }}
          className="p-1.5 -mr-1 -mt-1 rounded-full text-zinc-500 hover:text-[#f2ca50] hover:bg-white/10 transition-all shrink-0 active:scale-75"
          title={song.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            size={20}
            className={
              song.favorite
                ? 'text-[#f2ca50] fill-[#f2ca50] drop-shadow-[0_0_8px_rgba(242,202,80,0.6)]'
                : 'text-zinc-600 hover:text-white/70'
            }
          />
        </button>
      </div>

      {/* Section Badges Row */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        {song.sections.slice(0, 5).map((sec) => {
          const secConfig = SECTION_TYPES.find(t => t.type === sec.type);
          return (
            <span
              key={sec.id}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border tracking-wider uppercase ${
                secConfig?.color || 'bg-white/5 text-zinc-300 border-white/10'
              }`}
            >
              {sec.type}
            </span>
          );
        })}
        {song.sections.length > 5 && (
          <span className="text-[10px] font-mono text-zinc-500">
            +{song.sections.length - 5} more
          </span>
        )}
      </div>

      {/* Action Row at Bottom */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Quick Stage Perform Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPerformSong(song);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 hover:bg-[#f2ca50] text-[#f2ca50] hover:text-[#121212] border border-[#d4af37]/35 text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Play size={12} className="fill-current" />
            <span>Perform</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete(song.id);
            }}
            className="p-1.5 rounded-full text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors active:scale-95"
            title="Delete Song"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Chevron */}
        <div className="flex items-center gap-1 text-xs font-mono text-[#d4af37]/70 group-hover:text-[#f2ca50] transition-colors">
          <span className="text-[11px] hidden sm:inline text-zinc-400 group-hover:text-[#f2ca50]">Open Editor</span>
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};
