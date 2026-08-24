export type SectionType = 
  | 'INTRO' 
  | 'VERSE' 
  | 'PRE-CHORUS' 
  | 'CHORUS' 
  | 'BRIDGE' 
  | 'TAG' 
  | 'OUTRO';

export interface SongLine {
  id: string;
  chords: string[]; // e.g. ["1", "5", "6m", "4#m7"]
  lyrics: string;   // editable text aligned under the chord row
}

export interface SongSection {
  id: string;
  type: SectionType;
  label?: string;   // e.g. "Verse 1", "Chorus 2"
  lines: SongLine[];
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  key?: string;     // e.g. "G", "C", "D", "E", "A"
  bpm?: number;
  timeSignature?: string; // e.g. "4/4", "3/4", "6/8"
  favorite: boolean;
  sections: SongSection[];
  createdAt: number;
  updatedAt: number;
}

export interface SelectedChordSlot {
  sectionId: string;
  lineId: string;
  chordIndex: number;
}
