import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  getAudioVisualizerEngine,
  VisualizerMode,
  AudioMetrics,
} from '../../utils/webAudioVisualizer';

export const AudioVisualizerModal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    formatTime,
    showVisualizerModal,
    setShowVisualizerModal,
    isSpatialAudio,
    toggleSpatialAudio,
  } = usePlayer();

  const [modalMode, setModalMode] = useState<VisualizerMode>('bars');
  const [modalMetrics, setModalMetrics] = useState<AudioMetrics>({
    volume: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    peak: 0,
    isPlaying: false,
  });

  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef(getAudioVisualizerEngine()).current;

  useEffect(() => {
    if (showVisualizerModal && modalCanvasRef.current) {
      engine.attachCanvas(modalCanvasRef.current, modalMode);
    }
    return () => {
      if (showVisualizerModal) {
        engine.detachCanvas();
      }
    };
  }, [showVisualizerModal, modalMode, engine]);

  useEffect(() => {
    if (!showVisualizerModal) return;
    const interval = setInterval(() => {
      setModalMetrics(engine.getMetrics());
    }, 50);
    return () => clearInterval(interval);
  }, [showVisualizerModal, engine]);

  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    '🔥': 28,
    '💜': 19,
    '⚡': 35,
    '🚀': 12,
  });

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, author: 'Nova Ray', time: '02:10', text: '¡Ese sintetizador analógico en 02:10 es una locura total! 🤯', isMe: false },
    { id: 2, author: 'Luxor 9', time: '02:12', text: 'Suban el volumen, se viene el drop de bajo pesado', isMe: false },
    { id: 3, author: 'Kaelen Voss (Tú)', time: '02:14', text: 'Sintonizado al 100% con monitores de estudio 🔥', isMe: true },
  ]);

  if (!showVisualizerModal) return null;

  const handleSendReaction = (emoji: string) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: 'Kaelen Voss (Tú)',
        time: formatTime(currentTime),
        text: chatInput.trim(),
        isMe: true,
      },
    ]);
    setChatInput('');
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0e12]/95 backdrop-blur-2xl flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar animate-in fade-in duration-200">
      {/* Top Bar with Dismiss */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ef4444]/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] animate-ping"></div>
          <span className="text-xs font-mono font-bold text-[#ef4444] uppercase tracking-wider">
            SALA SINCRONIZADA #402 · AUDIO ESPACIAL 3D
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#1a1b20] text-[#cbc3d7] font-mono text-[10px] border border-white/5">
            LOSSLESS 24-BIT / 96kHz
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSpatialAudio}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              isSpatialAudio
                ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]'
                : 'bg-[#1a1b20] text-[#cbc3d7]'
            }`}
          >
            {isSpatialAudio ? '3D Audio ON' : 'Stereo Standard'}
          </button>
          <button
            onClick={() => setShowVisualizerModal(false)}
            type="button"
            className="w-9 h-9 rounded-full bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6">
        {/* Left Column: Huge Artwork, Interactive Waveform & Synchronized Lyrics */}
        <div className="lg:col-span-7 flex flex-col gap-6 justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(239,68,68,0.35)] ring-2 ring-[#ef4444]/30 flex-shrink-0 group">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="flex flex-col text-center sm:text-left gap-1">
              <span className="text-xs font-mono text-[#ef4444] font-bold tracking-wider">
                EN REPRODUCCIÓN
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#e3e2e7] tracking-tight">
                {currentTrack.title}
              </h1>
              <p className="text-sm sm:text-base text-[#cbc3d7]">
                {currentTrack.artist}
              </p>
              <span className="text-xs text-[#958ea0] mt-1 font-mono">
                Álbum: {currentTrack.album || 'Sonic Rituals'} • 126 BPM • Fa# Menor
              </span>
            </div>
          </div>

          {/* Dynamic Frequency Web Audio API Waveform Visualizer */}
          <div className="p-4 rounded-2xl bg-[#1a1b20]/80 border border-[#ef4444]/25 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-xs text-[#cbc3d7]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#ef4444] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm animate-pulse">equalizer</span>
                  Espectro Web Audio API
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] text-[10px] font-mono border border-[#ef4444]/30">
                  RMS: {Math.round(modalMetrics.volume * 100)}%
                </span>
              </div>

              {/* Mode toggles */}
              <div className="flex items-center gap-1 bg-[#121317] p-1 rounded-lg border border-white/5">
                {(['bars', 'wave', 'radial', 'matrix'] as VisualizerMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setModalMode(m);
                      engine.setMode(m);
                    }}
                    className={`px-2 py-0.5 text-[10px] rounded font-mono uppercase transition-all ${
                      modalMode === m
                        ? 'bg-[#ef4444] text-white shadow-[0_0_8px_#ef4444]'
                        : 'text-[#958ea0] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="relative w-full h-20 rounded-xl bg-[#0d0e12]/90 border border-white/5 overflow-hidden flex items-center justify-center">
              <canvas
                ref={modalCanvasRef}
                width={700}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Real-time frequency band metrics */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="bg-[#121317] px-2.5 py-1.5 rounded border border-white/5 flex items-center justify-between">
                <span className="text-[#958ea0]">BASS (20-250Hz):</span>
                <span className="text-[#ef4444] font-bold">{Math.round(modalMetrics.bass * 100)}%</span>
              </div>
              <div className="bg-[#121317] px-2.5 py-1.5 rounded border border-white/5 flex items-center justify-between">
                <span className="text-[#958ea0]">MID (250-4kHz):</span>
                <span className="text-[#f43f5e] font-bold">{Math.round(modalMetrics.mid * 100)}%</span>
              </div>
              <div className="bg-[#121317] px-2.5 py-1.5 rounded border border-white/5 flex items-center justify-between">
                <span className="text-[#958ea0]">TREBLE (4-16kHz):</span>
                <span className="text-[#fb7185] font-bold">{Math.round(modalMetrics.treble * 100)}%</span>
              </div>
            </div>

            <div className="flex justify-between font-mono text-[11px] text-[#ab8986]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Synchronized Lyrics */}
          <div className="p-5 rounded-2xl bg-[#1a1b20]/60 border border-white/5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ab8986] uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm text-[#ef4444]">format_quote</span>
              <span>Letra Sincronizada en Vivo</span>
            </div>
            <p className="text-sm text-[#958ea0] line-through opacity-50">
              Speeding through the empty midnight boulevard
            </p>
            <p className="text-base sm:text-lg font-bold text-white bg-gradient-to-r from-white to-[#f43f5e] bg-clip-text text-transparent">
              "Neon lights are falling on the dash..."
            </p>
            <p className="text-sm text-[#cbc3d7]">
              And we never look behind, no looking back
            </p>
          </div>
        </div>

        {/* Right Column: Group Listening, Live Reactions & Synced Room Chat */}
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          {/* Group Room Card */}
          <div className="p-4 rounded-2xl bg-[#1a1b20]/70 border border-[#ef4444]/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Sala de Escucha Grupal</h3>
              <span className="text-xs font-mono text-[#ef4444] font-bold">+14 amigos conectados</span>
            </div>

            {/* Listener Avatars */}
            <div className="flex items-center -space-x-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCauyVP2gTdwvbKk2bud93LZFDYO34aTIUNnoSy9m2UKCrlWZE8I2wqMLZ5vQUnZR0dSrWaIRYp7Gof2RizWzU73JoP19Sz0vuA_yiGcRtuFZHuUYxLBxLDokLt7GZxEveGNshmFS_jo1G_Vb66cqtoLgpQvDLctt3akitMCU0-r1YxKfxDpbjjoV2NMhrJmuQEnRSWhHpRt9mAyFVjAmeLEZJVw-HuhlXMNyCwC3C2lTTLRciSRffS"
                alt="Nova Ray"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0d0e12]"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_DVbvL-wHOXgLZs38n_g_rYmh-VThhgEqtHVc_h98UgFDiXQFuXFTP5rvVQTTdGNdAdasEK-vGJhuK2f_jJkaOBH-mGx9zq5MidZ_N9M15-MurUNnxaqrJMH8gB06MLtsG9WlCjGy5Ljl1ynGSTHD8z9OoxC6q1aCLUYRvRxVoaPn5fq5X1jDiqK1XPSkX_dSzgn-kn-D5y90902fsLVurL5t3dxiHbv0GkOd7IaJorzu9dsd8hKR"
                alt="Sara V"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0d0e12]"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrmkHmEDwt00cAlWMUAWHKHDt3yk8fkjtbx30VJhLrkM9U77J85fCMtvLnW_3QbAy3mkji7FbwY7EIqkwMJTUryxNheqOkK4lUjk1xA0St-oEdgjqNxbdLBg5nxeN_w9akYmYFIJInYp-n1_se6M-oGNE0UqJuc-jUfakZhjXNNpghzFwRK7Sco8DmcaV2uSBDpw7FZP90I-Oq_k6Pc0Aly8pPxg7Y9zfxkNLuNEigZNE22N6a2QuT"
                alt="Mireia"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0d0e12]"
              />
              <div className="w-9 h-9 rounded-full bg-[#292a2e] text-[#ef4444] text-xs font-bold ring-2 ring-[#0d0e12] flex items-center justify-center">
                +11
              </div>
            </div>

            {/* Live Emoji Reaction Palette */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              {Object.entries(reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => handleSendReaction(emoji)}
                  type="button"
                  className="flex-1 py-1.5 px-2 rounded-full bg-[#292a2e] hover:bg-[#343439] hover:scale-105 active:scale-95 transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-transparent hover:border-[#ef4444]/30"
                >
                  <span>{emoji}</span>
                  <span className="text-[#ef4444]">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Synchronized Chat Card */}
          <div className="p-4 rounded-2xl bg-[#1a1b20]/70 border border-white/5 flex flex-col h-64 sm:h-72">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
              <span className="text-xs font-bold text-white">Chat Sincronizado</span>
              <span className="text-[10px] text-[#ef4444] font-mono">Modo Audio-Reactivo</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2.5 pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                    msg.isMe
                      ? 'ml-auto bg-[#ef4444]/20 border border-[#ef4444]/30 text-white'
                      : 'bg-[#292a2e] text-[#e3e2e7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-[#ef4444] text-[11px]">{msg.author}</span>
                    <span className="font-mono text-[9px] text-[#958ea0]">{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Comentar en este segundo del track..."
                className="flex-1 px-3 py-2 bg-[#292a2e] rounded-full text-xs text-white placeholder:text-[#ab8986] outline-none focus:ring-1 focus:ring-[#ef4444]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white flex items-center justify-center transition-all flex-shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
