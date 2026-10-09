import React, { createContext, useContext, useState, useEffect } from 'react';
import { Track, ScreenView } from '../types';
import { CURRENT_PLAYING_DEFAULT } from '../data/mockData';

interface PlayerContextType {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLiked: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isSpatialAudio: boolean;
  connectedRoom: string | null;
  currentScreen: ScreenView;
  showVisualizerModal: boolean;
  showAudioSettingsModal: boolean;
  showGroupSessionModal: boolean;
  showCreateRoomModal: boolean;
  isHandRaised: boolean;
  isMicMuted: boolean;
  togglePlay: () => void;
  playTrack: (track: Partial<Track>) => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleLike: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleSpatialAudio: () => void;
  setCurrentScreen: (screen: ScreenView) => void;
  setShowVisualizerModal: (val: boolean) => void;
  setShowAudioSettingsModal: (val: boolean) => void;
  setShowGroupSessionModal: (val: boolean) => void;
  setShowCreateRoomModal: (val: boolean) => void;
  joinVoiceRoom: (roomId: string, title: string) => void;
  leaveVoiceRoom: () => void;
  toggleHandRaise: () => void;
  toggleMicMute: () => void;
  formatTime: (secs: number) => string;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(CURRENT_PLAYING_DEFAULT);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(134); // 02:14
  const [duration, setDuration] = useState<number>(342); // 05:42
  const [volume, setVolumeState] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState<boolean>(true);
  const [connectedRoom, setConnectedRoom] = useState<string | null>('Synthwave Night Live');
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('inicio');
  const [showVisualizerModal, setShowVisualizerModal] = useState<boolean>(false);
  const [showAudioSettingsModal, setShowAudioSettingsModal] = useState<boolean>(false);
  const [showGroupSessionModal, setShowGroupSessionModal] = useState<boolean>(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(true);

  // Simulated ticker for progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return isRepeat ? 0 : duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, isRepeat]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const playTrack = (trackData: Partial<Track>) => {
    setCurrentTrack((prev) => ({
      ...prev,
      ...trackData,
      id: trackData.id || `track-${Date.now()}`,
      title: trackData.title || prev.title,
      artist: trackData.artist || prev.artist,
      duration: trackData.duration || 300,
      durationFormatted: trackData.durationFormatted || '05:00',
    }));
    setDuration(trackData.duration || 300);
    setCurrentTime(trackData.snippetStart || 0);
    setIsPlaying(true);
  };

  const seek = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(seconds, duration)));
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev);
  };

  const toggleSpatialAudio = () => {
    setIsSpatialAudio((prev) => !prev);
  };

  const joinVoiceRoom = (roomId: string, title: string) => {
    setConnectedRoom(title);
  };

  const leaveVoiceRoom = () => {
    setConnectedRoom(null);
    setIsHandRaised(false);
  };

  const toggleHandRaise = () => {
    setIsHandRaised((prev) => !prev);
  };

  const toggleMicMute = () => {
    setIsMicMuted((prev) => !prev);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isLiked,
        isShuffle,
        isRepeat,
        isSpatialAudio,
        connectedRoom,
        currentScreen,
        showVisualizerModal,
        showAudioSettingsModal,
        showGroupSessionModal,
        showCreateRoomModal,
        isHandRaised,
        isMicMuted,
        togglePlay,
        playTrack,
        seek,
        setVolume,
        toggleMute,
        toggleLike,
        toggleShuffle,
        toggleRepeat,
        toggleSpatialAudio,
        setCurrentScreen,
        setShowVisualizerModal,
        setShowAudioSettingsModal,
        setShowGroupSessionModal,
        setShowCreateRoomModal,
        joinVoiceRoom,
        leaveVoiceRoom,
        toggleHandRaise,
        toggleMicMute,
        formatTime,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
