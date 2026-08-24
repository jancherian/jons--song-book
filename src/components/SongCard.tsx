import React from 'react';
import { 
  Star, 
  Play, 
  Trash2, 
  ArrowRight
} from 'lucide-react';
import type { Song } from '../types/song';

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
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <div
      onClick={() => onSelectSong(song)}
      className="swiss-card relative p-5 flex flex-col gap-4 cursor-pointer"
    >
      {/* Top Row: Index + Title + Star Favorite */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-xs font-black text-[#FF3000] shrink-0">
            {formattedIndex}
          </span>
          
          <div className="min-w-0">
            <h4 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase truncate">
              {song.title}
            </h4>
            
            {/* Metadata Line */}
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-600 mt-1 uppercase font-bold tracking-wider">
              <span>{totalSections} {totalSections === 1 ? 'Section' : 'Sections'}</span>
              <span className="w-1 h-1 bg-black" />
              {song.key && (
                <>
                  <span className="text-black font-extrabold">Key {song.key}</span>
                  <span className="w-1 h-1 bg-black" />
                </>
              )}
              {song.bpm && (
                <>
                  <span>{song.bpm} BPM</span>
                  <span className="w-1 h-1 bg-black" />
                </>
              )}
              <span className="truncate">{song.artist || 'Traditional'}</span>
            </div>
          </div>
        </div>

        {/* Favorite Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(song.id);
          }}
          className="p-2 -mr-1 -mt-1 hover:bg-black hover:text-white transition-colors duration-150 shrink-0"
          title={song.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            size={20}
            className={
              song.favorite
                ? 'text-[#FF3000] fill-[#FF3000]'
                : 'text-neutral-400 hover:text-white'
            }
          />
        </button>
      </div>

      {/* Section Flow Tags Row */}
      <div className="flex items-center gap-2 flex-wrap border-t border-neutral-300 pt-3">
        <span className="text-[10px] font-mono font-black uppercase text-neutral-500 tracking-widest mr-1">
          Flow:
        </span>
        {song.sections.map((sec, idx) => (
          <React.Fragment key={sec.id}>
            <span className="text-xs font-mono font-bold text-black uppercase tracking-wider">
              {sec.type}
            </span>
            {idx < song.sections.length - 1 && (
              <span className="text-neutral-400 font-mono text-xs">→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Action Row at Bottom */}
      <div className="border-t-2 border-black pt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Quick Stage Perform Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPerformSong(song);
            }}
            className="px-4 py-1.5 bg-[#FF3000] text-white hover:bg-black text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-150"
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
            className="p-1.5 border border-transparent hover:border-black hover:bg-black hover:text-white text-neutral-500 transition-colors duration-150"
            title="Delete Song"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Open Chart Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black">
          <span>Edit Chart</span>
          <ArrowRight size={15} className="text-[#FF3000]" />
        </div>
      </div>
    </div>
  );
};
