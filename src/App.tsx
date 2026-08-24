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

type AppView = 'home' | 'editor' | 'performance';

export default function App() {
  const [songs, setSongs] = useState<Song[]>(() => getStoredSongs());
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeSong, setActiveSong] = useState<Song | null>(null);

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

  const handlePerformSong = (song: Song) => {
    setActiveSong(song);
    setCurrentView('performance');
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

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#FF3000] selection:text-white">
      {currentView === 'home' && (
        <HomeScreen
          songs={songs}
          onSelectSong={handleSelectSong}
          onPerformSong={handlePerformSong}
          onToggleFavorite={handleToggleFavorite}
          onCreateSong={handleCreateSong}
          onDeleteSong={handleDeleteSong}
        />
      )}

      {currentView === 'editor' && activeSong && (
        <SongEditor
          song={activeSong}
          onUpdateSong={handleUpdateSong}
          onBack={() => setCurrentView('home')}
          onLaunchPerformance={() => setCurrentView('performance')}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {currentView === 'performance' && activeSong && (
        <PerformanceMode
          song={activeSong}
          onExit={() => setCurrentView('editor')}
        />
      )}
    </div>
  );
}