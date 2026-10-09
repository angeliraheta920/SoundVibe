import React, { useRef, useEffect, useState, useId } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  getAudioVisualizerEngine,
  VisualizerMode,
  AudioMetrics,
  VISUALIZER_THEMES,
} from '../../utils/webAudioVisualizer';

export const BottomPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLiked,
    isShuffle,
    isRepeat,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleLike,
    toggleShuffle,
    toggleRepeat,
    setShowVisualizerModal,
    setShowGroupSessionModal,
    formatTime,
  } = usePlayer();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressBarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expandedCanvasRef = useRef<HTMLCanvasElement>(null);

  // Visualizer settings state
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');
  const [activeThemeKey, setActiveThemeKey] = useState<keyof typeof VISUALIZER_THEMES>('crimson');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [liveMetrics, setLiveMetrics] = useState<AudioMetrics>({
    volume: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    peak: 0,
    isPlaying: false,
  });

  const engine = useRef(getAudioVisualizerEngine()).current;

  // Sync playback state with Web Audio API engine
  useEffect(() => {
    if (isPlaying) {
      engine.startPlayback(currentTrack.bpm || 126);
    } else {
      engine.stopPlayback();
    }
  }, [isPlaying, currentTrack.bpm, engine]);

  // Sync volume with Web Audio API engine in real time
  useEffect(() => {
    engine.setVolume(volume);
  }, [volume, engine]);

  // Sync mute state with Web Audio API engine in real time
  useEffect(() => {
    engine.setMuted(isMuted);
  }, [isMuted, engine]);

  // Sync theme
  useEffect(() => {
    engine.setTheme(activeThemeKey);
  }, [activeThemeKey, engine]);

  // Attach canvas to engine
  useEffect(() => {
    const targetCanvas = isExpanded ? expandedCanvasRef.current : canvasRef.current;
    if (targetCanvas) {
      engine.attachCanvas(targetCanvas, visualizerMode);
    }

    return () => {
      engine.detachCanvas();
    };
  }, [visualizerMode, isExpanded, engine]);

  // Periodically sample metrics for reactive UI pills (20fps)
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = engine.getMetrics();
      setLiveMetrics(metrics);
    }, 50);

    return () => clearInterval(interval);
  }, [engine]);

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      const targetTime = Math.round(clickPos * duration);
      seek(targetTime);
    }
  };

  const cycleMode = () => {
    const modes: VisualizerMode[] = ['bars', 'wave', 'radial', 'matrix'];
    const nextIndex = (modes.indexOf(visualizerMode) + 1) % modes.length;
    const nextMode = modes[nextIndex];
    setVisualizerMode(nextMode);
    engine.setMode(nextMode);
  };

  const modeLabels: Record<VisualizerMode, { name: string; icon: string }> = {
    bars: { name: 'EQ Espectro', icon: 'equalizer' },
    wave: { name: 'Onda Neón', icon: 'graphic_eq' },
    radial: { name: 'Pulso 3D', icon: 'radio_button_checked' },
    matrix: { name: 'Matriz LED', icon: 'grid_view' },
  };

  return (
    <>
      {/* Expanded Audio Visualizer Drawer (collapsible above player) */}
      {isExpanded && (
        <div className="fixed bottom-36 sm:bottom-24 left-0 right-0 z-40 bg-[#0d0e12]/95 backdrop-blur-2xl border-t border-[#ef4444]/30 p-4 sm:px-8 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-200">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ef4444] animate-pulse">graphic_eq</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    Visualizador de Audio Web API
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40">
                      {modeLabels[visualizerMode].name}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#958ea0]">
                    Análisis en tiempo real de volumen RMS y frecuencias (Graves 20-250Hz · Medios 250Hz-4kHz · Agudos 4-16kHz)
                  </p>
                </div>
              </div>

              {/* Theme & Mode Selectors */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-[#1a1b20] p-1 rounded-lg border border-white/5 gap-1">
                  {(['bars', 'wave', 'radial', 'matrix'] as VisualizerMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setVisualizerMode(mode);
                        engine.setMode(mode);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                        visualizerMode === mode
                          ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                          : 'text-[#cbc3d7] hover:text-white'
                      }`}
                    >
                      {modeLabels[mode].name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  {(['crimson', 'neonViolet', 'cyanPulse'] as (keyof typeof VISUALIZER_THEMES)[]).map((tKey) => (
                    <button
                      key={tKey}
                      onClick={() => setActiveThemeKey(tKey)}
                      title={`Tema: ${tKey}`}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        activeThemeKey === tKey ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: VISUALIZER_THEMES[tKey].primary }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg text-[#cbc3d7] hover:text-white hover:bg-[#292a2e] transition-colors ml-2"
                  title="Cerrar panel"
                >
                  <span className="material-symbols-outlined text-lg">expand_more</span>
                </button>
              </div>
            </div>

            {/* High-Resolution Visualizer Canvas */}
            <div className="relative w-full h-24 sm:h-28 bg-[#121317]/80 rounded-xl overflow-hidden border border-[#ef4444]/20 flex items-center justify-center">
              <canvas
                ref={expandedCanvasRef}
                width={800}
                height={112}
                className="w-full h-full object-cover"
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center gap-2 text-xs font-mono text-[#cbc3d7]">
                  <span className="material-symbols-outlined text-sm text-[#ef4444]">pause</span>
                  Reproducción pausada • Reanuda para ver las frecuencias activas
                </div>
              )}
            </div>

            {/* Reactive Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="bg-[#1a1b20] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-[#958ea0]">VOLUMEN RMS:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-2 bg-[#292a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#ef4444] transition-all duration-75"
                      style={{ width: `${Math.round(liveMetrics.volume * 100)}%` }}
                    />
                  </div>
                  <span className="text-white font-bold">{Math.round(liveMetrics.volume * 100)}%</span>
                </div>
              </div>

              <div className="bg-[#1a1b20] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-[#958ea0]">GRAVES (BASS):</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-2 bg-[#292a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ef4444] transition-all duration-75 shadow-[0_0_6px_#ef4444]"
                      style={{ width: `${Math.round(liveMetrics.bass * 100)}%` }}
                    />
                  </div>
                  <span className="text-[#ef4444] font-bold">{Math.round(liveMetrics.bass * 100)}%</span>
                </div>
              </div>

              <div className="bg-[#1a1b20] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-[#958ea0]">MEDIOS (MID):</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-2 bg-[#292a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#f43f5e] transition-all duration-75"
                      style={{ width: `${Math.round(liveMetrics.mid * 100)}%` }}
                    />
                  </div>
                  <span className="text-[#f43f5e] font-bold">{Math.round(liveMetrics.mid * 100)}%</span>
                </div>
              </div>

              <div className="bg-[#1a1b20] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-[#958ea0]">AGUDOS (TREBLE):</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-2 bg-[#292a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#fb7185] transition-all duration-75"
                      style={{ width: `${Math.round(liveMetrics.treble * 100)}%` }}
                    />
                  </div>
                  <span className="text-[#fb7185] font-bold">{Math.round(liveMetrics.treble * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Player Bar */}
      <footer className="fixed bottom-16 lg:bottom-0 left-0 right-0 h-20 sm:h-24 bg-[#0d0e12]/95 backdrop-blur-2xl z-40 px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 border-t border-[#ef4444]/25 shadow-[0_-5px_25px_rgba(0,0,0,0.6)]">
        {/* Left: Track Info & Album Art */}
        <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-xs flex-1 sm:flex-initial">
          <div 
            onClick={() => setShowVisualizerModal(true)}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#292a2e] flex-shrink-0 flex items-center justify-center text-[#ef4444] shadow-[0_0_24px_rgba(239,68,68,0.35)] ring-1 ring-[#ef4444]/40 overflow-hidden cursor-pointer group"
          >
            {currentTrack.coverUrl ? (
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : ''}`}
              />
            ) : (
              <span className="material-symbols-outlined text-2xl">album</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="material-symbols-outlined text-white text-xl">open_in_full</span>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span 
                onClick={() => setShowVisualizerModal(true)}
                className="text-xs sm:text-sm font-bold text-[#e3e2e7] truncate cursor-pointer hover:text-[#ef4444] transition-colors"
              >
                {currentTrack.title}
              </span>
              <span className={`material-symbols-outlined text-[#ef4444] text-xs sm:text-sm ${isPlaying ? 'animate-pulse' : ''}`}>
                graphic_eq
              </span>
            </div>
            <span className="text-[11px] text-[#cbc3d7] truncate">
              {currentTrack.artist} {currentTrack.isFlac ? '[FLAC]' : ''}
            </span>
          </div>

          <button
            onClick={toggleLike}
            type="button"
            className="p-1.5 text-[#ef4444] hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:block"
            title={isLiked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <span 
              className="material-symbols-outlined text-xl" 
              style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Center: Transport Controls, Inline Web Audio Visualizer & Scrubber */}
        <div className="flex-1 max-w-xl flex flex-col items-center gap-1 sm:gap-1.5">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={toggleShuffle}
              type="button"
              className={`transition-colors hidden sm:block cursor-pointer ${
                isShuffle ? 'text-[#ef4444]' : 'text-[#cbc3d7] hover:text-white'
              }`}
              title="Aleatorio"
            >
              <span className="material-symbols-outlined text-lg">shuffle</span>
            </button>

            <button
              onClick={() => seek(Math.max(0, currentTime - 15))}
              type="button"
              className="text-[#cbc3d7] hover:text-white transition-colors cursor-pointer"
              title="Anterior / -15s"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">skip_previous</span>
            </button>

            <button
              onClick={togglePlay}
              type="button"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_22px_rgba(239,68,68,0.6)] cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <button
              onClick={() => seek(Math.min(duration, currentTime + 15))}
              type="button"
              className="text-[#cbc3d7] hover:text-white transition-colors cursor-pointer"
              title="Siguiente / +15s"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">skip_next</span>
            </button>

            <button
              onClick={toggleRepeat}
              type="button"
              className={`transition-colors hidden sm:block cursor-pointer ${
                isRepeat ? 'text-[#ef4444]' : 'text-[#cbc3d7] hover:text-white'
              }`}
              title="Repetir"
            >
              <span className="material-symbols-outlined text-lg">repeat</span>
            </button>
          </div>

          {/* Integrated Real-time Web Audio API Visualizer Canvas Bar */}
          {!isExpanded && (
            <div className="w-full max-w-md h-5 px-1 flex items-center justify-between gap-2 bg-[#1a1b20]/70 rounded-md border border-[#ef4444]/20 overflow-hidden relative group">
              <canvas
                ref={canvasRef}
                width={380}
                height={20}
                className="w-full h-full cursor-pointer"
                onClick={cycleMode}
                title="Toca para cambiar estilo de visualización (Barras / Onda / Radial / Matriz)"
              />

              {/* Mode & Live Reaction Badge */}
              <div className="absolute right-1 top-0 bottom-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto bg-[#0d0e12]/90 px-1.5 rounded">
                <button
                  type="button"
                  onClick={cycleMode}
                  className="text-[10px] font-mono text-[#ef4444] hover:underline flex items-center gap-0.5"
                  title="Cambiar modo"
                >
                  <span className="material-symbols-outlined text-[12px]">{modeLabels[visualizerMode].icon}</span>
                  {modeLabels[visualizerMode].name}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="text-[#cbc3d7] hover:text-white ml-1"
                  title="Expandir visualizador de frecuencias"
                >
                  <span className="material-symbols-outlined text-[13px]">expand_less</span>
                </button>
              </div>
            </div>
          )}

          {/* Scrubber Bar */}
          <div className="w-full flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-[10px] sm:text-xs text-[#ab8986] min-w-[34px] text-right">
              {formatTime(currentTime)}
            </span>

            <div
              ref={progressBarRef}
              onClick={handleSeekClick}
              className="relative flex-1 h-3 flex items-center cursor-pointer group"
            >
              <div className="w-full h-1 sm:h-1.5 bg-[#292a2e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] rounded-full shadow-[0_0_8px_#ef4444] transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              {/* Scrubber Knob */}
              <div
                className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#ef4444] rounded-full shadow-[0_0_10px_#ef4444] ring-2 ring-white/40 -translate-x-1/2 group-hover:scale-125 transition-transform"
                style={{ left: `${progressPercent}%` }}
              ></div>
            </div>

            <span className="font-mono text-[10px] sm:text-xs text-[#ab8986] min-w-[34px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Audio Features & Volume */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4 justify-end min-w-[180px] sm:min-w-[220px]">
          {/* Quick Visualizer Toggle Button */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            type="button"
            className={`transition-colors cursor-pointer flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
              isExpanded
                ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]'
                : 'text-[#cbc3d7] hover:text-[#ef4444] border-white/5 bg-[#1a1b20]'
            }`}
            title="Panel de Frecuencias y Volumen Web Audio API"
          >
            <span className={`material-symbols-outlined text-sm ${isPlaying ? 'animate-pulse' : ''}`}>
              graphic_eq
            </span>
            <span className="font-mono text-[10px] hidden lg:inline">
              {Math.round(liveMetrics.volume * 100)}%
            </span>
          </button>

          <button
            onClick={() => setShowGroupSessionModal(true)}
            type="button"
            className="text-[#cbc3d7] hover:text-[#ef4444] transition-colors cursor-pointer"
            title="Listening Party / Sesión Grupal"
          >
            <span className="material-symbols-outlined text-xl">groups</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVisualizerModal(true)}
            className="text-[#cbc3d7] hover:text-white transition-colors cursor-pointer"
            title="Cola de reproducción & Letras"
          >
            <span className="material-symbols-outlined text-xl">queue_music</span>
          </button>

          {/* Volume Slider with Web Audio API Reaction */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              type="button"
              className="text-[#cbc3d7] hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              <span className="material-symbols-outlined text-xl">
                {isMuted || volume === 0
                  ? 'volume_off'
                  : volume < 50
                  ? 'volume_down'
                  : 'volume_up'}
              </span>
            </button>
            <div className="relative w-16 sm:w-20 h-1 bg-[#292a2e] rounded-full overflow-hidden cursor-pointer group">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                title={`Volumen: ${volume}%`}
              />
              <div
                className="h-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] rounded-full shadow-[0_0_6px_#ef4444]"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setShowVisualizerModal(true)}
            type="button"
            className="text-[#cbc3d7] hover:text-white transition-colors cursor-pointer"
            title="Modo Inmersivo / Pantalla Completa"
          >
            <span className="material-symbols-outlined text-xl">fullscreen</span>
          </button>
        </div>
      </footer>
    </>
  );
};

