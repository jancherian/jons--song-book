import type { Song } from '../types/song';

const STORAGE_KEY = 'jons_song_book_v2_songs';

export const DEFAULT_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    key: 'A',
    bpm: 118,
    timeSignature: '4/4',
    favorite: true,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    sections: [
      {
        id: 'sec-1-intro',
        type: 'INTRO',
        label: 'Bass Line & Groove',
        lines: [
          {
            id: 'line-1-1',
            chords: ['1', '1', '6m', '6m'],
            lyrics: '(Bass groove starts with steady kick and snare)'
          },
          {
            id: 'line-1-2',
            chords: ['4', '5', '1', '1'],
            lyrics: '(Strings swell and acoustic guitar enters)'
          }
        ]
      },
      {
        id: 'sec-1-v1',
        type: 'VERSE',
        label: 'Verse 1',
        lines: [
          {
            id: 'line-1-3',
            chords: ['1', '1', '6m', '6m'],
            lyrics: 'When the night has come, and the land is dark'
          },
          {
            id: 'line-1-4',
            chords: ['4', '5', '1', '1'],
            lyrics: 'And the moon is the only light we will see'
          },
          {
            id: 'line-1-5',
            chords: ['1', '1', '6m', '6m'],
            lyrics: 'No I won\'t be afraid, no I won\'t be afraid'
          },
          {
            id: 'line-1-6',
            chords: ['4', '5', '1', '1'],
            lyrics: 'Just as long as you stand, stand by me'
          }
        ]
      },
      {
        id: 'sec-1-c1',
        type: 'CHORUS',
        label: 'Chorus',
        lines: [
          {
            id: 'line-1-7',
            chords: ['1', '1', '6m', '6m'],
            lyrics: 'So darling, darling stand by me, oh stand by me'
          },
          {
            id: 'line-1-8',
            chords: ['4', '5', '1', '1'],
            lyrics: 'Oh stand, stand by me, stand by me'
          }
        ]
      },
      {
        id: 'sec-1-out',
        type: 'OUTRO',
        label: 'Outro',
        lines: [
          {
            id: 'line-1-9',
            chords: ['1', '6m', '4', '5', '1'],
            lyrics: 'Whenever you\'re in trouble won\'t you stand by me'
          }
        ]
      }
    ]
  },
  {
    id: 'song-2',
    title: 'Goodness of God',
    artist: 'Bethel Music / Jenn Johnson',
    key: 'Ab',
    bpm: 68,
    timeSignature: '4/4',
    favorite: true,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    sections: [
      {
        id: 'sec-2-intro',
        type: 'INTRO',
        label: 'Intro',
        lines: [
          {
            id: 'line-2-1',
            chords: ['1', '1/3', '4', '1'],
            lyrics: '(Acoustic fingerpicking & soft ambient pad)'
          }
        ]
      },
      {
        id: 'sec-2-v1',
        type: 'VERSE',
        label: 'Verse 1',
        lines: [
          {
            id: 'line-2-2',
            chords: ['1', '4', '1', '5/7'],
            lyrics: 'I love You, Lord, for Your mercy never fails me'
          },
          {
            id: 'line-2-3',
            chords: ['6m', '4', '5sus4', '5'],
            lyrics: 'All my days, I\'ve been held in Your hands'
          },
          {
            id: 'line-2-4',
            chords: ['6m', '4', '1', '5/7', '6m'],
            lyrics: 'From the moment that I wake up until I lay my head'
          },
          {
            id: 'line-2-5',
            chords: ['4', '5', '1', '1'],
            lyrics: 'Oh, I will sing of the goodness of God'
          }
        ]
      },
      {
        id: 'sec-2-chorus',
        type: 'CHORUS',
        label: 'Chorus',
        lines: [
          {
            id: 'line-2-6',
            chords: ['4', '1', '4', '1', '5'],
            lyrics: 'All my life You have been faithful, and all my life You have been so so good'
          },
          {
            id: 'line-2-7',
            chords: ['4', '1', '5/7', '6m'],
            lyrics: 'With every breath that I am able'
          },
          {
            id: 'line-2-8',
            chords: ['4', '5', '1', '1'],
            lyrics: 'Oh, I will sing of the goodness of God'
          }
        ]
      },
      {
        id: 'sec-2-bridge',
        type: 'BRIDGE',
        label: 'Bridge',
        lines: [
          {
            id: 'line-2-9',
            chords: ['1/3', '4', '5', '1'],
            lyrics: 'Your goodness is running after, it\'s running after me'
          },
          {
            id: 'line-2-10',
            chords: ['1/3', '4', '5', '6m'],
            lyrics: 'With my life laid down, I\'m surrendered now, I give You everything'
          }
        ]
      }
    ]
  },
  {
    id: 'song-3',
    title: 'Take Me Home, Country Roads',
    artist: 'John Denver',
    key: 'G',
    bpm: 82,
    timeSignature: '4/4',
    favorite: false,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
    sections: [
      {
        id: 'sec-3-intro',
        type: 'INTRO',
        label: 'Intro',
        lines: [
          {
            id: 'line-3-1',
            chords: ['1', '1', '1', '1'],
            lyrics: '(Acoustic strumming in G)'
          }
        ]
      },
      {
        id: 'sec-3-v1',
        type: 'VERSE',
        label: 'Verse 1',
        lines: [
          {
            id: 'line-3-2',
            chords: ['1', '6m', '5', '4', '1'],
            lyrics: 'Almost heaven, West Virginia, Blue Ridge Mountains, Shenandoah River'
          },
          {
            id: 'line-3-3',
            chords: ['1', '6m', '5', '4', '1'],
            lyrics: 'Life is old there, older than the trees, younger than the mountains, growin like a breeze'
          }
        ]
      },
      {
        id: 'sec-3-chorus',
        type: 'CHORUS',
        label: 'Chorus',
        lines: [
          {
            id: 'line-3-4',
            chords: ['1', '5', '6m', '4'],
            lyrics: 'Country roads, take me home, to the place I belong'
          },
          {
            id: 'line-3-5',
            chords: ['1', '5', '4', '1'],
            lyrics: 'West Virginia, mountain mama, take me home, country roads'
          }
        ]
      }
    ]
  }
];

export function getStoredSongs(): Song[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredSongs(DEFAULT_SONGS);
      return DEFAULT_SONGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SONGS;
  }
}

export function saveStoredSongs(songs: Song[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch (err) {
    console.error('Failed to save songs to localStorage', err);
  }
}

export function saveSong(song: Song): Song[] {
  const songs = getStoredSongs();
  const existingIdx = songs.findIndex(s => s.id === song.id);
  
  let updatedSongs: Song[];
  if (existingIdx >= 0) {
    updatedSongs = [...songs];
    updatedSongs[existingIdx] = {
      ...song,
      updatedAt: Date.now()
    };
  } else {
    updatedSongs = [{
      ...song,
      createdAt: song.createdAt || Date.now(),
      updatedAt: Date.now()
    }, ...songs];
  }

  saveStoredSongs(updatedSongs);
  return updatedSongs;
}

export function deleteSongById(songId: string): Song[] {
  const songs = getStoredSongs();
  const filtered = songs.filter(s => s.id !== songId);
  saveStoredSongs(filtered);
  return filtered;
}

export function toggleSongFavorite(songId: string): Song[] {
  const songs = getStoredSongs();
  const updated = songs.map(s => {
    if (s.id === songId) {
      return { ...s, favorite: !s.favorite, updatedAt: Date.now() };
    }
    return s;
  });
  saveStoredSongs(updated);
  return updated;
}
