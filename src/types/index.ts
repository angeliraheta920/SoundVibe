export type ScreenView = 'inicio' | 'explorar' | 'voicerooms' | 'biblioteca' | 'chats';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  durationFormatted: string;
  coverUrl: string;
  isFlac?: boolean;
  bitrate?: string;
  bpm?: number;
  tags?: string[];
  snippetStart?: number;
  snippetEnd?: number;
}

export interface AudioNote {
  id: string;
  authorName: string;
  avatarUrl: string;
  statusText: string;
  iconName: string;
  hasAudio: boolean;
  duration?: string;
  isUser?: boolean;
}

export interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
    verified: boolean;
    role?: string;
  };
  timeAgo: string;
  type: 'playlist_share' | 'audio_review' | 'spotlight';
  content: string;
  rating?: number;
  playlist?: {
    title: string;
    trackCount: number;
    duration: string;
    artists: string;
    coverUrl: string;
    previewTrack: string;
    previewDuration: string;
  };
  audioReview?: {
    title: string;
    markerLabel: string;
    snippetDuration: string;
    isLossless: boolean;
    dropTime: string;
  };
  spotlight?: {
    category: string;
    artistName: string;
    genre: string;
    location: string;
    description: string;
    coverUrl: string;
    listenersCount: string;
    sampleTrack: string;
    sampleDuration: string;
  };
  likes: number;
  commentsCount: number;
  sharesCount: number;
  listenedByNote?: string;
  isLiked?: boolean;
}

export interface FriendListening {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  trackTitle: string;
  artistName: string;
  isLive: boolean;
  statusTime?: string;
}

export interface VoiceRoom {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'all' | 'dj' | 'debates' | 'parties';
  isLive: boolean;
  listenersCount: number;
  queueCount: number;
  bitrate: string;
  currentTrack?: {
    title: string;
    artist: string;
  };
  hosts: {
    name: string;
    role: 'HOST' | 'CO-HOST' | 'SPEAKER';
    avatarUrl: string;
    isSpeaking?: boolean;
  }[];
  speakersCount: number;
  latencyMs: number;
  tags: string[];
  isFeatured?: boolean;
  bgArtwork?: string;
}

export interface ScheduledRoom {
  id: string;
  dateLabel: string;
  timeLabel: string;
  tag: string;
  title: string;
  subtext: string;
  isReminderSet?: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;
  isRoom?: boolean;
  isListeningTogether?: boolean;
  isOnline?: boolean;
  lastMessage: string;
  timeAgo: string;
  unreadCount?: number;
  currentTrackInfo?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  avatarUrl?: string;
  initials?: string;
  time: string;
  isMe: boolean;
  text?: string;
  audioSnippet?: {
    title: string;
    artist: string;
    coverUrl: string;
    duration: string;
    reactionFire: number;
    reactionLightning: number;
  };
  voiceNote?: {
    duration: string;
    playedDuration: string;
    speed: string;
  };
}

export interface Playlist {
  id: string;
  title: string;
  trackCount: number;
  duration: string;
  coverUrl: string;
  isPublic: boolean;
  isColab?: boolean;
  colabWith?: string;
  bpmRange?: string;
  likes?: string;
  updatedAgo?: string;
  isPrivate?: boolean;
}
