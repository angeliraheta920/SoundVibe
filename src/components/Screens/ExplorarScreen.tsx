import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  EXPLORAR_BENTO,
  RADAR_SOCIAL_TRACKS,
  EMERGING_ARTISTS,
  VIRAL_TRACKS_RANKING,
} from '../../data/mockData';

export const ExplorarScreen: React.FC = () => {
  const { playTrack, setCurrentScreen } = usePlayer();
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filterChips = [
    'Todo',
    '🔥 Tendencias Hoy',
    'Electrónica & Synthwave',
    'Trap & Hip Hop',
    'Indie Rock',
    'Ambient & Lo-Fi',
    'Podcasts Musicales',
    'Hyperpop & Bass',
  ];

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Search Header & Filter Strip */}
      <section className="flex flex-col gap-4">
        <div className="relative w-full rounded-2xl bg-[#1a1b20]/80 backdrop-blur-xl p-2 sm:p-2.5 shadow-xl flex items-center gap-3 border border-[#ef4444]/20">
          <div className="flex items-center pl-3 text-[#ef4444]">
            <span className="material-symbols-outlined text-2xl">search</span>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar canciones, artistas, géneros, voice rooms o podcasts..."
            className="w-full bg-transparent text-[#e3e2e7] placeholder:text-[#ab8986] text-xs sm:text-sm outline-none"
          />
          <div className="hidden sm:flex items-center gap-1 pr-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[#292a2e] text-[#ab8986] font-mono text-[10px] shadow-inner">
              Ctrl
            </kbd>
            <span className="text-[#ab8986] text-[10px]">+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#292a2e] text-[#ab8986] font-mono text-[10px] shadow-inner">
              K
            </kbd>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-[#dc2626] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_16px_rgba(239,68,68,0.35)] cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>

        {/* Filter Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterChips.map((chip) => {
            const isSelected = activeFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`py-1.5 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#dc2626] text-white shadow-[0_0_14px_rgba(239,68,68,0.4)] font-bold'
                    : 'bg-[#292a2e]/80 hover:bg-[#343439] text-[#cbc3d7] hover:text-white'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Hero Spotlight: Crimson Echoes - Neon Waves LP */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-[#0d0e12] p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(239,68,68,0.35)] border border-[#ef4444]/25">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlsWYBB4lFL2QTiJ9mRWLb70ZXRRBsdOjLqBq0BJnmWWpqlGF_8Ao9JtzG4U34AXaekvx7NkNuFZ6p1mv8FOj6PLj7rDZwhVTP1HM_yB-89KP3WzEnl5L9hwU0sDKcVNL82ZVmzfhLBvKelS-P2mgHjbal1Fr-lWzOCgwrkE0a91ulwhDYqDbMIKLvvK9O6N3CzYaWT8eesIQVP4EFRIJePUQNaERN_TeCdwyVY-oWhc5F7jExCNUL')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e12] via-[#0d0e12]/80 to-transparent"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#dc2626]/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#dc2626] text-white text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Lanzamiento Exclusivo
              </span>
              <span className="text-[10px] font-mono text-[#ef4444] tracking-wider uppercase font-bold">
                Semana 11 • Destacado Global
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Crimson Echoes
                <span className="block bg-gradient-to-r from-[#ef4444] via-[#f43f5e] to-[#f97316] bg-clip-text text-transparent">
                  Neon Waves LP
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#cbc3d7] max-w-lg mt-2 leading-relaxed">
                Sintetizadores analógicos saturados al rojo vivo, bajos sub-armónicos de 32Hz y
                atmósferas cyberpunk producidas en colaboración directa con la comunidad de Voice
                Rooms.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() =>
                  playTrack({
                    title: 'Neon Waves (Intro LP)',
                    artist: 'Crimson Echoes',
                    album: 'Neon Waves LP',
                    duration: 360,
                  })
                }
                type="button"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(239,68,68,0.55)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">play_circle</span>
                <span>Reproducir Álbum</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('biblioteca')}
                className="w-10 h-10 rounded-full bg-[#292a2e]/80 text-[#e3e2e7] hover:text-[#ef4444] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                title="Añadir a mi biblioteca"
              >
                <span className="material-symbols-outlined text-xl">bookmark_add</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('chats')}
                className="w-10 h-10 rounded-full bg-[#292a2e]/80 text-[#cbc3d7] hover:text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                title="Compartir en feed"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Vinyl Preview & Stats Ring */}
          <div className="relative flex items-center justify-center self-center lg:self-auto">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.8)] z-10 group ring-1 ring-[#ef4444]/40">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC2drgAMhpuq2pbyTH6Pk6zv4Yjuh5pF16LSd6GtZ73xchmQENvZ9__z7xH_XKZjMSD_PWN8cA0bpBIvcAMM9AbMI0Cj171lmw0NHe-LxOmRne6ousrdmlPowidEcPjneP_9ab3-jXWIjgCMQeicg4bnkru4RJHcdl8RGjF2KgjHyF0XWn2VuAjondW3qs36hjtVRjJHrme78Sby5JlL8-RJd9rr75DixqlWwI_7v3RawfnYA6-MW5"
                alt="Crimson Echoes Album Cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-[#0d0e12]/85 backdrop-blur-md flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ef4444] text-sm">graphic_eq</span>
                  <span className="text-[11px] font-mono text-white font-semibold">12 Tracks • 44m</span>
                </div>
                <span className="text-[10px] font-mono text-[#f43f5e] font-bold">FLAC 24-bit</span>
              </div>
            </div>

            {/* Disc Peek Element Behind Cover with rotation */}
            <div className="absolute -right-8 sm:-right-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#0d0e12] shadow-2xl flex items-center justify-center animate-vinyl">
              <div className="w-20 h-20 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#0d0e12] ring-4 ring-[#dc2626]/40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Grid: Bento & Discovery (2 Cols) + Trend Radar (1 Col) */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
        <div className="2xl:col-span-2 flex flex-col gap-8">
          {/* 1. Genres & Moods Bento Grid */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ef4444] text-2xl">category</span>
                <h2 className="text-base sm:text-lg font-bold text-white">Explorar Géneros & Vibras</h2>
              </div>
              <button
                type="button"
                className="text-xs font-mono text-[#ef4444] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todo</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {EXPLORAR_BENTO.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    playTrack({
                      title: item.title,
                      artist: item.subtitle,
                    })
                  }
                  className="group relative h-36 rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between bg-[#292a2e] transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(239,68,68,0.25)] cursor-pointer border border-white/5"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${item.imgUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/40 to-transparent" />

                  <span className="relative z-10 px-2 py-0.5 rounded bg-[#dc2626] text-white text-[9px] font-mono font-bold w-fit shadow-sm">
                    {item.tag}
                  </span>

                  <div className="relative z-10">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-[#ef4444] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#cbc3d7] truncate">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Radar Social de tu Círculo */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ef4444] text-xl">hub</span>
                  <h2 className="text-base sm:text-lg font-bold text-white">Radar Social de tu Círculo</h2>
                </div>
                <p className="text-xs text-[#cbc3d7]">
                  Tracks en auge dentro de tus Voice Rooms y amigos seguidos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {RADAR_SOCIAL_TRACKS.map((track) => (
                <div
                  key={track.id}
                  className="group relative rounded-2xl bg-[#1a1b20] p-3 flex flex-col gap-2 hover:bg-[#292a2e] transition-all border border-white/5"
                >
                  <div
                    onClick={() =>
                      playTrack({
                        title: track.title,
                        artist: track.artist,
                        coverUrl: track.coverUrl,
                      })
                    }
                    className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  >
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#dc2626] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_rgba(239,68,68,0.7)]">
                      <span className="material-symbols-outlined text-2xl">play_arrow</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {track.title}
                      </h4>
                      <button type="button" className="text-[#ab8986] hover:text-white">
                        <span className="material-symbols-outlined text-base">more_horiz</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-[#cbc3d7] truncate">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 mt-auto border-t border-white/5">
                    <div className="w-4 h-4 rounded-full bg-[#ef4444]/30 text-[#ef4444] flex items-center justify-center text-[8px] font-bold">
                      VR
                    </div>
                    <span className="text-[10px] text-[#ab8986] truncate">{track.listenedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Artistas Emergentes de la Comunidad */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ef4444] text-xl">verified_user</span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Artistas Emergentes de la Comunidad
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#ab8986]">Actualizado cada lunes</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
              {EMERGING_ARTISTS.map((artist) => (
                <div
                  key={artist.id}
                  className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-[#1a1b20] hover:bg-[#292a2e] transition-all group border border-white/5"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2">
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform ring-2 ring-[#ef4444]/30"
                    />
                    <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-xs shadow-md">
                      <span className="material-symbols-outlined text-xs font-bold">
                        {artist.icon}
                      </span>
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full">
                    {artist.name}
                  </h4>
                  <span className="text-[10px] text-[#ef4444] font-medium truncate block">
                    {artist.genre}
                  </span>
                  <span className="text-[10px] text-[#ab8986] mt-0.5">{artist.listeners}</span>
                  <button
                    onClick={() =>
                      playTrack({
                        title: `Set Destacado: ${artist.name}`,
                        artist: artist.genre,
                      })
                    }
                    type="button"
                    className="mt-2.5 w-full py-1 px-3 rounded-full bg-[#292a2e] hover:bg-[#dc2626] hover:text-white text-[#e3e2e7] text-xs font-semibold transition-all cursor-pointer"
                  >
                    Escuchar
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Radar de Tendencias / Viral Community Hub */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-3xl bg-[#1a1b20]/90 backdrop-blur-2xl shadow-xl flex flex-col gap-5 border border-[#ef4444]/20">
            <div className="flex flex-col gap-1 pb-1 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ef4444] text-xl">radar</span>
                  <h3 className="text-sm sm:text-base font-bold text-white">Radar de Tendencias</h3>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-ping"></span>
              </div>
              <p className="text-xs text-[#cbc3d7]">Top virales en SoundVibe durante las últimas 24 horas</p>
            </div>

            {/* Community Hashtags */}
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-[#dc2626]/20 text-[#ef4444] font-mono text-[10px] font-bold hover:bg-[#dc2626] hover:text-white cursor-pointer transition-colors">
                #Cyberwave2025
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#292a2e] text-[#cbc3d7] font-mono text-[10px] hover:text-white cursor-pointer transition-colors">
                #BassBoost
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#292a2e] text-[#cbc3d7] font-mono text-[10px] hover:text-white cursor-pointer transition-colors">
                #NightRiders
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#292a2e] text-[#cbc3d7] font-mono text-[10px] hover:text-white cursor-pointer transition-colors">
                #LiveVoiceMix
              </span>
            </div>

            {/* Viral Tracks Ranking List */}
            <div className="flex flex-col gap-2">
              {VIRAL_TRACKS_RANKING.map((track) => (
                <div
                  key={track.rank}
                  onClick={() =>
                    playTrack({
                      title: track.title,
                      artist: track.artist,
                      coverUrl: track.coverUrl,
                    })
                  }
                  className="group flex items-center justify-between p-2 rounded-xl bg-[#292a2e]/50 hover:bg-[#292a2e] transition-colors cursor-pointer border border-transparent hover:border-[#ef4444]/20"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-mono text-sm font-extrabold w-4 text-center ${
                        track.rank === 1 ? 'text-[#ef4444]' : 'text-[#ab8986]'
                      }`}
                    >
                      {track.rank}
                    </span>
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="material-symbols-outlined text-white text-base">play_arrow</span>
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{track.title}</h5>
                      <span className="text-[10px] text-[#ab8986] truncate">
                        {track.artist} • {track.plays}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#ef4444] text-xs">trending_up</span>
                    <span className="font-mono text-[10px] text-[#ef4444] font-bold">{track.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily AI Mix Card */}
            <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#891933]/40 via-[#292a2e] to-[#0d0e12] overflow-hidden border border-[#ef4444]/25">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#ef4444] text-sm">auto_awesome</span>
                <span className="text-[10px] font-mono text-[#ef4444] font-bold uppercase tracking-wider">
                  SoundVibe AI Mix
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Tu Radar Diario Personalizado</h4>
              <p className="text-[11px] text-[#cbc3d7] mt-1">
                25 gemas inéditas adaptadas a tu tempo y amigos con los que sueles compartir cabina.
              </p>
              <button
                onClick={() =>
                  playTrack({
                    title: 'Radar Diario Personalizado [Mix]',
                    artist: 'SoundVibe Algoritmo Social',
                  })
                }
                type="button"
                className="mt-3 w-full py-2 px-4 rounded-full bg-[#dc2626] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_16px_rgba(239,68,68,0.4)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Escuchar Mix Diario</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
