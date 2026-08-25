import { useState, useEffect } from 'react';
import type { Song } from './types/song';
import { 
  getStoredSongs, 
  saveSong, 
  deleteSongById, 
  toggleSongFavorite 
} from './utils/storage';
import { HomeScreen } from './components/HomeScreen';
import { SongEditor } from './components/SongEditor';
import { PerformanceMode } from './components/PerformanceMode';
import { triggerHaptic } from './utils/haptics';

type AppView = 'home' | 'editor' | 'performance';

export default function App() {
  const [songs, setSongs] = useState<Song[]>(() => getStoredSongs());
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [performanceReturnView, setPerformanceReturnView] = useState<'home' | 'editor'>('home');

  // Global Theme State: Default to saved preference or system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('chordset_theme') || localStorage.getItem('chordset_stage_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  // Sync theme changes to localStorage and HTML document element
  useEffect(() => {
    try {
      localStorage.setItem('chordset_theme', theme);
      localStorage.setItem('chordset_stage_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    triggerHaptic(15);
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Sync state if storage changes
  useEffect(() => {
    const loaded = getStoredSongs();
    if (loaded.length > 0 && songs.length === 0) {
      setSongs(loaded);
    }
  }, [songs.length]);

  const handleSelectSong = (song: Song) => {
    setActiveSong(song);
    setCurrentView('editor');
  };

  const handlePerformSongFromHome = (song: Song) => {
    setActiveSong(song);
    setPerformanceReturnView('home');
    setCurrentView('performance');
  };

  const handlePerformSongFromEditor = () => {
    setPerformanceReturnView('editor');
    setCurrentView('performance');
  };

  const handleExitPerformance = () => {
    setCurrentView(performanceReturnView);
  };

  const handleCreateSong = (title: string, artist: string, key: string, bpm: number) => {
    const newSong: Song = {
      id: `song-${Date.now()}`,
      title,
      artist: artist || undefined,
      key: key || 'G',
      bpm: bpm || 80,
      timeSignature: '4/4',
      favorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          type: 'INTRO',
          label: 'Intro',
          lines: [
            {
              id: `line-${Date.now()}-1`,
              chords: ['1', '4', '1', '5'],
              lyrics: '(Instrumental Intro)',
            }
          ]
        },
        {
          id: `sec-${Date.now()}-2`,
          type: 'VERSE',
          label: 'Verse 1',
          lines: [
            {
              id: `line-${Date.now()}-2`,
              chords: ['1', '5', '6m', '4'],
              lyrics: '',
            }
          ]
        },
        {
          id: `sec-${Date.now()}-3`,
          type: 'CHORUS',
          label: 'Chorus',
          lines: [
            {
              id: `line-${Date.now()}-3`,
              chords: ['1', '5', '6m', '4'],
              lyrics: '',
            }
          ]
        }
      ]
    };

    const updated = saveSong(newSong);
    setSongs(updated);
    setActiveSong(newSong);
    setCurrentView('editor');
  };

  const handleUpdateSong = (updatedSong: Song) => {
    const updatedList = saveSong(updatedSong);
    setSongs(updatedList);
    setActiveSong(updatedSong);
  };

  const handleDeleteSong = (songId: string) => {
    const updatedList = deleteSongById(songId);
    setSongs(updatedList);
    if (activeSong?.id === songId) {
      setActiveSong(null);
      setCurrentView('home');
    }
  };

  const handleToggleFavorite = (songId: string) => {
    const updatedList = toggleSongFavorite(songId);
    setSongs(updatedList);
    if (activeSong?.id === songId) {
      setActiveSong(prev => prev ? { ...prev, favorite: !prev.favorite } : null);
    }
  };

  const isDarkMode = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans selection:bg-[#E8432E] selection:text-[#F7F4EB] transition-colors duration-200 ${
      isDarkMode ? 'chart-grid-bg-dark bg-[#100D0A] text-[#F7F4EB]' : 'chart-grid-bg-light bg-[#F7F4EB] text-[#171310]'
    }`}>
      {currentView === 'home' && (
        <HomeScreen
          songs={songs}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSelectSong={handleSelectSong}
          onPerformSong={handlePerformSongFromHome}
          onToggleFavorite={handleToggleFavorite}
          onCreateSong={handleCreateSong}
          onDeleteSong={handleDeleteSong}
        />
      )}

      {currentView === 'editor' && activeSong && (
        <SongEditor
          song={activeSong}
          theme={theme}
          onToggleTheme={toggleTheme}
          onUpdateSong={handleUpdateSong}
          onBack={() => setCurrentView('home')}
          onLaunchPerformance={handlePerformSongFromEditor}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {currentView === 'performance' && activeSong && (
        <PerformanceMode
          song={activeSong}
          theme={theme}
          onToggleTheme={toggleTheme}
          onExit={handleExitPerformance}
        />
      )}
    </div>
  );
}