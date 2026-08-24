// Nashville Number System Utilities

export const SECTION_TYPES: { type: import('../types/song').SectionType; label: string; color: string }[] = [
  { type: 'INTRO', label: 'Intro', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { type: 'VERSE', label: 'Verse', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { type: 'PRE-CHORUS', label: 'Pre-Chorus', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { type: 'CHORUS', label: 'Chorus', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { type: 'BRIDGE', label: 'Bridge', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { type: 'TAG', label: 'Tag', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
  { type: 'OUTRO', label: 'Outro', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
];

export const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

// Chromatic scale mappings for transposition
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Major scale intervals in semitones: 1 (0), 2 (2), 3 (4), 4 (5), 5 (7), 6 (9), 7 (11)
const SCALE_DEGREE_SEMITONES: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
};

/**
 * Converts a Nashville chord notation to actual letter chord in a given Key
 * e.g., in Key of G:
 * "1" -> "G"
 * "4" -> "C"
 * "5" -> "D"
 * "6m" -> "Em"
 * "1/3" -> "G/B"
 * "5/7" -> "D/F#"
 * "4#m7" -> "C#m7"
 */
export function convertNashvilleToLetter(nashvilleChord: string, keyName: string): string {
  if (!nashvilleChord || !keyName) return nashvilleChord;
  
  // Handle slash chords like 1/3, 5/7
  if (nashvilleChord.includes('/')) {
    const [top, bass] = nashvilleChord.split('/');
    const convertedTop = convertNashvilleToLetter(top, keyName);
    const convertedBass = convertNashvilleToLetter(bass, keyName);
    return `${convertedTop}/${convertedBass}`;
  }

  // Parse degree, accidental, and modifier
  // Matches e.g. "4#m7", "b7", "6m", "1sus4", "2dim"
  const match = nashvilleChord.match(/^([b#]?)([1-7])([b#]?)(.*)$/);
  if (!match) return nashvilleChord;

  const prefixAccidental = match[1];
  const degree = parseInt(match[2], 10);
  const postfixAccidental = match[3];
  const modifier = match[4] || '';

  // Find root index of key
  let rootIndex = CHROMATIC_SCALE.indexOf(keyName);
  if (rootIndex === -1) rootIndex = CHROMATIC_FLATS.indexOf(keyName);
  if (rootIndex === -1) rootIndex = 0;

  let semitones = (rootIndex + (SCALE_DEGREE_SEMITONES[degree] || 0)) % 12;
  
  if (prefixAccidental === 'b' || postfixAccidental === 'b') {
    semitones = (semitones - 1 + 12) % 12;
  } else if (prefixAccidental === '#' || postfixAccidental === '#') {
    semitones = (semitones + 1) % 12;
  }

  const useFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(keyName);
  const noteName = useFlats ? CHROMATIC_FLATS[semitones] : CHROMATIC_SCALE[semitones];

  return `${noteName}${modifier}`;
}

/**
 * Modifies an existing Nashville chord string when tapping a number pad button
 */
export function applyKeypadInput(currentChord: string, inputKey: string): string {
  if (inputKey === 'CLEAR') {
    return '';
  }

  if (inputKey === '⌫') {
    if (!currentChord) return '';
    // If ends with a multi-letter modifier like sus4, sus2, dim, aug, M7, m7
    const multiModifiers = ['sus4', 'sus2', 'dim', 'aug', 'M7', 'm7'];
    for (const mod of multiModifiers) {
      if (currentChord.endsWith(mod)) {
        return currentChord.slice(0, -mod.length);
      }
    }
    return currentChord.slice(0, -1);
  }

  // If input is a number 1-7
  if (/^[1-7]$/.test(inputKey)) {
    // If the slot is empty, set it to the number
    if (!currentChord) {
      return inputKey;
    }
    // If it has a trailing slash, append as bass note
    if (currentChord.endsWith('/')) {
      return currentChord + inputKey;
    }
    // If it's already just a single number or starts with a number, replace the root number or start fresh if user wants
    if (/^[1-7]$/.test(currentChord)) {
      return inputKey;
    }
    // If current chord has modifiers but user taps another number, replace the root degree
    return inputKey + currentChord.replace(/^[b#]?[1-7][b#]?/, '');
  }

  // Slash chord operator
  if (inputKey === '/') {
    if (!currentChord || currentChord.includes('/')) return currentChord;
    return currentChord + '/';
  }

  // Accidentals # and b
  if (inputKey === '#' || inputKey === 'b') {
    // If empty, prefix it
    if (!currentChord) return inputKey;
    // Don't add duplicate accidentals
    if (currentChord.endsWith('#') || currentChord.endsWith('b')) return currentChord;
    return currentChord + inputKey;
  }

  // Modifiers (M, m, aug, dim, M7, m7, sus2, sus4)
  // Check if current chord already ends with another quality modifier and replace it if appropriate
  return currentChord + inputKey;
}
