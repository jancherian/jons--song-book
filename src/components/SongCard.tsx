import React from 'react';
import { 
  Star, 
  Play, 
  Trash2, 
  ArrowRight
} from 'lucide-react';
import type { Song } from '../types/song';
import { triggerHaptic } from '../utils/haptics';

interface SongCardProps {
  song: Song;
  index?: number;
  onSelectSong: (song: Song) => void;
  onPerformSong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onRequestDelete: (songId: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onSelectSong,
  onPerformSong,
  onToggleFavorite,
  onRequestDelete,
}) => {
  const totalSections = song.sections.length;

  return (
    <div
      onClick={() => {
        triggerHaptic(15);
        onSelectSong(song);
      }}
      className={`p-5 sm:p-6 rounded-md flex flex-col gap-4 cursor-pointer transition-all duration-150 hover:scale-[1.012] active:scale-[0.99] group select-none border-2 border-[#171310] ${
        song.favorite 
          ? 'bg-[#FDF6E8] hover:bg-[#F8ECD2]' 
          : 'bg-[#FBF9F2] hover:bg-[#F3EFE3]'
      }`}
    >
      {/* Top Row: Left-Anchored Monospace Title + Favorite Star */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Song Title as Primary Anchor strictly in Bold Monospace */}
          <h4 
            className="font-mono font-bold text-xl sm:text-2xl text-[#171310] tracking-tight truncate group-hover:text-[#E8432E] transition-colors"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            {song.title}
          </h4>
          
          {/* Tighter, Smaller Metadata Cluster Beneath in Sans-Serif */}
          <div className="flex items-center gap-2.5 text-xs text-[#171310]/70 mt-1.5 font-medium flex-wrap font-sans">
            <span className="text-[#171310] font-bold">{totalSections} {totalSections === 1 ? 'sec' : 'secs'}</span>
            <span className="w-1 h-1 rounded-full bg-[#171310]/30" />
            {song.key && (
              <>
                <span className="text-[#171310] font-bold">Key {song.key}</span>
                <span className="w-1 h-1 rounded-full bg-[#171310]/30" />
              </>
            )}
            {song.bpm && (
              <>
                <span className="font-semibold">{song.bpm} BPM</span>
                <span className="w-1 h-1 rounded-full bg-[#171310]/30" />
              </>
            )}
            <span className="truncate text-[#171310]/70 font-medium">{song.artist || 'Traditional'}</span>
          </div>
        </div>

        {/* Favorite Star Button with 44x44px Touch Target */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic(15);
            onToggleFavorite(song.id);
          }}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 shrink-0 border ${
            song.favorite
              ? 'bg-[#E8432E] text-[#F7F4EB] border-[#171310]'
              : 'bg-white text-[#171310]/40 hover:text-[#E8432E] hover:bg-[#FDF6E8] border-[#171310]/30'
          }`}
          title={song.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            size={18}
            className={song.favorite ? 'fill-[#F7F4EB]' : ''}
          />
        </button>
      </div>

      {/* Section Flow Monospace Tags Row */}
      {song.sections.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span 
            className="text-[11px] text-[#171310]/60 font-bold uppercase tracking-wider mr-1 font-mono"
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
          >
            Flow:
          </span>
          {song.sections.map((sec, idx) => (
            <React.Fragment key={sec.id}>
              <span 
                className="font-mono text-xs font-bold text-[#171310] bg-white px-2 py-0.5 rounded border border-[#171310]/30 uppercase tracking-wide"
                style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
              >
                {sec.type}
              </span>
              {idx < song.sections.length - 1 && (
                <span 
                  className="text-[#171310]/40 text-xs font-bold font-mono"
                  style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
                >
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Action Row at Bottom */}
      <div className="pt-1 flex items-center justify-between gap-3 border-t border-[#171310]/15">
        <div className="flex items-center gap-2">
          {/* Solid Vermilion Perform CTA with 44px Touch Target */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic(20);
              onPerformSong(song);
            }}
            style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
            className="px-4 py-2.5 min-h-[44px] bg-[#E8432E] hover:bg-[#D03522] text-[#F7F4EB] font-mono font-bold text-xs rounded-md flex items-center gap-2 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wide border border-[#171310]"
          >
            <Play size={13} className="fill-current" />
            <span>PERFORM</span>
          </button>

          {/* Delete Button with 44x44px Touch Target */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic(15);
              onRequestDelete(song.id);
            }}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-red-50 text-[#171310]/40 hover:text-[#E8432E] transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center border border-[#171310]/20"
            title="Delete Song"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Open Chart Indicator */}
        <div 
          className="flex items-center gap-1 font-mono text-xs font-bold text-[#171310]/70 group-hover:text-[#E8432E] transition-colors uppercase"
          style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 700 }}
        >
          <span>EDIT CHART</span>
          <ArrowRight size={13} className="text-[#E8432E] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
