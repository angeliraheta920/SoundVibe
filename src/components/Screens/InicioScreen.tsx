import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { AUDIO_NOTES, POSTS_FEED } from '../../data/mockData';

export const InicioScreen: React.FC = () => {
  const { playTrack, joinVoiceRoom, setCurrentScreen } = usePlayer();
  const [activeTab, setActiveTab] = useState<'para_ti' | 'amigos' | 'synthwave' | 'novedades'>('para_ti');
  const [activeNoteAudio, setActiveNoteAudio] = useState<string | null>(null);
  const [feedPosts, setFeedPosts] = useState(POSTS_FEED);

  const toggleLikePost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handlePlayNote = (noteId: string, title: string) => {
    if (activeNoteAudio === noteId) {
      setActiveNoteAudio(null);
    } else {
      setActiveNoteAudio(noteId);
      playTrack({
        title: `Nota de audio: ${title}`,
        artist: 'Momento musical compartido',
        duration: 30,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Centralized Stream Container */}
      <div className="w-full max-w-3xl flex flex-col gap-6 min-w-0">
        
        {/* 1. Historias & Notas Musicales (Stories Row) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ef4444] text-xl">graphic_eq</span>
              <h2 className="text-xs sm:text-sm font-bold text-[#e3e2e7] uppercase tracking-wider">
                Notas de Audio & Momentos
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#ab8986]">Actualizado hace 2m</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar justify-start sm:justify-center">
            {AUDIO_NOTES.map((note) => {
              const isPlayingThis = activeNoteAudio === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => handlePlayNote(note.id, note.authorName)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group relative"
                >
                  {/* Floating mini speech bubble tag */}
                  {!note.isUser && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#343439]/95 backdrop-blur-md px-2 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none z-10 flex items-center gap-1 border border-[#ef4444]/30">
                      <span className="material-symbols-outlined text-[#ef4444] text-xs">
                        {note.iconName}
                      </span>
                      <span className="text-[10px] text-white font-medium">
                        {note.statusText}
                      </span>
                    </div>
                  )}

                  {note.isUser ? (
                    <div className="relative w-16 h-16 rounded-full bg-[#292a2e] flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-[#1a1b20] flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-[#ef4444] text-2xl group-hover:rotate-90 transition-transform duration-300">
                          add
                        </span>
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ef4444] flex items-center justify-center text-white shadow-lg shadow-[#ef4444]/40">
                        <span className="material-symbols-outlined text-xs">mic</span>
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105 ${
                          isPlayingThis
                            ? 'bg-gradient-to-tr from-[#ef4444] via-[#f43f5e] to-[#f97316] ring-2 ring-[#ef4444]'
                            : 'bg-gradient-to-tr from-[#ef4444] to-[#f43f5e]'
                        }`}
                      >
                        <img
                          src={note.avatarUrl}
                          alt={note.authorName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#ef4444] ring-2 ring-[#121317] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      </span>
                    </div>
                  )}

                  <span className="text-[11px] text-[#e3e2e7] font-semibold truncate max-w-[72px] text-center">
                    {note.authorName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Sub-navigation Tabs (Centered) */}
        <div className="flex items-center justify-center gap-3 border-b-0 pb-1">
          <nav className="flex items-center gap-1 p-1 bg-[#1a1b20] rounded-full overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveTab('para_ti')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'para_ti'
                  ? 'bg-[#ef4444] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)]'
                  : 'text-[#cbc3d7] hover:text-white hover:bg-[#292a2e]'
              }`}
            >
              Para ti
            </button>
            <button
              onClick={() => setActiveTab('amigos')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'amigos'
                  ? 'bg-[#ef4444] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)]'
                  : 'text-[#cbc3d7] hover:text-white hover:bg-[#292a2e]'
              }`}
            >
              Amigos
            </button>
            <button
              onClick={() => setActiveTab('synthwave')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'synthwave'
                  ? 'bg-[#ef4444] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)]'
                  : 'text-[#cbc3d7] hover:text-white hover:bg-[#292a2e]'
              }`}
            >
              <span>Synthwave & Electronic</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
            </button>
            <button
              onClick={() => setActiveTab('novedades')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'novedades'
                  ? 'bg-[#ef4444] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)]'
                  : 'text-[#cbc3d7] hover:text-white hover:bg-[#292a2e]'
              }`}
            >
              Novedades
            </button>
          </nav>

          <button
            onClick={() => setCurrentScreen('explorar')}
            className="hidden sm:flex p-2 rounded-full bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7] hover:text-[#ef4444] transition-colors cursor-pointer flex-shrink-0"
            title="Filtro de género"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
        </div>

        {/* 3. Listening Party / Sesión en Vivo Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1b20] p-6 shadow-xl border border-[#ef4444]/20">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#ef4444]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-32 -bottom-20 w-52 h-52 rounded-full bg-[#f43f5e]/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-2xl bg-[#292a2e] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-[0_0_24px_rgba(239,68,68,0.35)] ring-1 ring-[#ef4444]/40">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe-jrxSB7tfASqAcR5OG56NMWcB5HrVQKmTWtPGgAyBrCBWP8ArG_m_nW77brAn0gjKp7TcVLdQKiVWO8kAdv75AAdyDx5kbPyS-AzNsNXj7pzx45v9DWbzVNKU7JKMiQOb2eScQ12zGDnOHnz7BNOYiVMQyogccgTlZdUuz7XDUTuRUmeU3H_tEZWrrxr6fGWl9lJ1HfYoEXXxmB7X24aq06f11oSis_pHfiYXJOD4q5csFw5R2uY"
                  alt="Synthwave Club Night"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ef4444] text-2xl animate-pulse">
                    radio
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-[#ef4444] text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    EN DIRECTO
                  </span>
                  <span className="text-[10px] text-[#f43f5e] font-mono tracking-wider font-bold">
                    SALA PRIVADA · HQ LOSSLESS
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#e3e2e7] leading-snug">
                  Synthwave Club Night: Midnight Overdrive
                </h3>
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex -space-x-2 overflow-hidden">
                    <span className="inline-block h-5 w-5 rounded-full bg-[#dc2626] text-white text-[9px] font-bold ring-1 ring-[#121317] flex items-center justify-center">
                      SC
                    </span>
                    <span className="inline-block h-5 w-5 rounded-full bg-[#e11d48] text-white text-[9px] font-bold ring-1 ring-[#121317] flex items-center justify-center">
                      MR
                    </span>
                    <span className="inline-block h-5 w-5 rounded-full bg-[#be123c] text-white text-[9px] font-bold ring-1 ring-[#121317] flex items-center justify-center">
                      AL
                    </span>
                  </div>
                  <p className="text-xs text-[#cbc3d7]">
                    24 amigos escuchando en sincronía perfecta
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  joinVoiceRoom('vr-featured', 'Synthwave Club Night');
                  playTrack({
                    title: 'Midnight Overdrive (Club VIP)',
                    artist: 'Kavinsky & Sofia Chen',
                  });
                }}
                type="button"
                className="py-2 px-5 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(239,68,68,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">sensors</span>
                <span>Unirse a la sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. FEED STREAM RICH CARDS */}
        {feedPosts.map((post, index) => {
          if (post.type === 'playlist_share' && post.playlist) {
            return (
              <React.Fragment key={post.id}>
                <article className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-[#1a1b20]/70 backdrop-blur-xl shadow-lg border border-[#ef4444]/15 hover:border-[#ef4444]/30 transition-all">
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-[#ef4444]/40"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white hover:underline cursor-pointer">
                            {post.author.name}
                          </span>
                          {post.author.verified && (
                            <span className="material-symbols-outlined text-[#ef4444] text-sm" title="Verificado">
                              verified
                            </span>
                          )}
                          <span className="text-xs text-[#ab8986]">compartió una lista</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#958ea0]">
                          <span>{post.author.handle}</span>
                          <span>•</span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="p-1.5 text-[#cbc3d7] hover:text-white rounded-full">
                      <span className="material-symbols-outlined text-xl">more_horiz</span>
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm text-[#e3e2e7] leading-relaxed">{post.content}</p>

                  {/* Playlist Interactive Box */}
                  <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-[#292a2e]/60 border border-white/5">
                    <div
                      onClick={() =>
                        playTrack({
                          title: post.playlist?.title,
                          artist: 'Curada por Sofia Chen',
                          coverUrl: post.playlist?.coverUrl,
                        })
                      }
                      className="relative w-full md:w-36 h-36 rounded-xl overflow-hidden flex-shrink-0 group cursor-pointer shadow-md"
                    >
                      <img
                        src={post.playlist.coverUrl}
                        alt={post.playlist.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="w-11 h-11 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-lg shadow-[#ef4444]/50">
                          <span className="material-symbols-outlined text-2xl">play_arrow</span>
                        </span>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#0d0e12]/90 backdrop-blur-md text-[10px] font-mono text-[#ef4444] font-bold">
                        {post.playlist.trackCount} TRACKS
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-[#e3e2e7] truncate">
                            {post.playlist.title}
                          </h4>
                          <span className="text-xs text-[#ef4444] font-mono font-bold whitespace-nowrap">
                            {post.playlist.duration}
                          </span>
                        </div>
                        <span className="text-xs text-[#cbc3d7] truncate block mt-0.5">
                          {post.playlist.artists}
                        </span>
                      </div>

                      {/* Audio Waveform Player Widget */}
                      <div className="flex flex-col gap-1 p-2 rounded-xl bg-[#0d0e12]/60 border border-[#ef4444]/15">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="material-symbols-outlined text-[#ef4444] text-sm">
                              music_note
                            </span>
                            <span className="text-[11px] text-[#e3e2e7] font-medium truncate">
                              Vista previa: {post.playlist.previewTrack}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#ab8986] font-mono">
                            {post.playlist.previewDuration}
                          </span>
                        </div>

                        {/* Interactive Waveform Bars */}
                        <div
                          onClick={() => {
                            playTrack({
                              title: post.playlist?.previewTrack,
                              artist: 'The Midnight',
                              coverUrl: post.playlist?.coverUrl,
                            });
                          }}
                          className="flex items-end gap-[3px] h-8 px-1 cursor-pointer group"
                        >
                          {Array.from({ length: 32 }).map((_, i) => {
                            const isElapsed = i < 16;
                            const height = Math.sin(i * 0.45) * 14 + 14;
                            return (
                              <div
                                key={i}
                                style={{ height: `${height}px` }}
                                className={`w-1 rounded-full transition-colors ${
                                  isElapsed
                                    ? i % 2 === 0
                                      ? 'bg-[#ef4444]'
                                      : 'bg-[#f43f5e]'
                                    : 'bg-[#343439]'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setCurrentScreen('biblioteca')}
                          className="py-1 px-3.5 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#e3e2e7] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#ef4444]/20 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-[#ef4444]">
                            bookmark_add
                          </span>
                          <span>Añadir a mi biblioteca</span>
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-[#cbc3d7] hover:text-[#ef4444] rounded-full transition-colors cursor-pointer"
                          title="Compartir"
                        >
                          <span className="material-symbols-outlined text-base">share</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Social Metrics */}
                  <div className="flex items-center justify-between pt-1 text-xs text-[#cbc3d7]">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => toggleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isLiked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-lg"
                          style={{ fontVariationSettings: post.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          favorite
                        </span>
                        <span className="font-bold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-lg">chat_bubble</span>
                        <span>{post.commentsCount} comentarios</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-[#f43f5e] transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-lg">repeat</span>
                        <span>{post.sharesCount}</span>
                      </button>
                    </div>
                    {post.listenedByNote && (
                      <span className="text-[11px] text-[#ab8986] hidden sm:inline">
                        {post.listenedByNote}
                      </span>
                    )}
                  </div>
                </article>

                {/* Symmetrical Middle Strip: Tendencias & Radar Social AI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tendencias */}
                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-[#1a1b20]/70 backdrop-blur-xl border border-[#ef4444]/15 shadow-md">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ef4444] text-base">trending_up</span>
                        <h4 className="text-xs font-bold text-white">Tendencias en tu Red</h4>
                      </div>
                      <span className="text-[9px] font-mono text-[#ab8986]">24h</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div
                        onClick={() => setCurrentScreen('explorar')}
                        className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#292a2e] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#ef4444]">01</span>
                          <span className="text-xs text-white truncate font-medium">#SynthwaveAutumn</span>
                        </div>
                        <span className="text-[10px] text-[#ab8986] font-mono">18.4k</span>
                      </div>

                      <div
                        onClick={() =>
                          playTrack({
                            title: 'Overdrive (Club Edit)',
                            artist: 'Kiasmos',
                          })
                        }
                        className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#292a2e] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#f43f5e]">02</span>
                          <span className="text-xs text-white truncate font-medium">Overdrive (Club Edit)</span>
                        </div>
                        <span className="text-[10px] text-[#f43f5e] font-mono">+340</span>
                      </div>
                    </div>
                  </div>

                  {/* Algoritmo Social AI */}
                  <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-[#dc2626]/20 via-[#1a1b20] to-[#be123c]/20 border border-[#ef4444]/30 shadow-md">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#ef4444] mb-1">
                        <span className="material-symbols-outlined text-base">blur_on</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider">Algoritmo Social AI</span>
                      </div>
                      <p className="text-[11px] text-[#cbc3d7] leading-relaxed">
                        Afinidad al <strong className="text-[#ef4444] font-bold">94%</strong> en Synthwave & Melodic Techno esta semana.
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('explorar')}
                      type="button"
                      className="mt-2 w-full py-1.5 rounded-full bg-[#292a2e] hover:bg-[#ef4444] hover:text-white text-[#e3e2e7] text-[11px] font-semibold transition-all border border-[#ef4444]/20 cursor-pointer text-center"
                    >
                      Explorar Matriz de Afinidades
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          }

          if (post.type === 'audio_review' && post.audioReview) {
            return (
              <article
                key={post.id}
                className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-[#1a1b20]/70 backdrop-blur-xl shadow-lg border border-[#ef4444]/15"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#ef4444]/30"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white hover:underline cursor-pointer">
                          {post.author.name}
                        </span>
                        {post.author.role && (
                          <span className="px-2 py-0.5 rounded-full bg-[#dc2626] text-white text-[10px] font-bold shadow-sm">
                            {post.author.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#ab8986]">
                        Publicó una micro-reseña sonora • {post.timeAgo}
                      </span>
                    </div>
                  </div>
                  {post.rating && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#292a2e] border border-[#ef4444]/20">
                      <span
                        className="material-symbols-outlined text-[#ef4444] text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="text-xs font-bold text-white">{post.rating} / 5</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <h4 className="text-base font-bold text-white">
                    "El cambio de beat en el 0:18 es de otro nivel..."
                  </h4>
                  <p className="text-xs sm:text-sm text-[#cbc3d7] leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* 30s Audio Review Interactive Module */}
                <div className="p-4 rounded-2xl bg-[#0d0e12]/80 border border-[#ef4444]/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          playTrack({
                            title: post.audioReview?.title,
                            artist: 'Jon Hopkins (Snippet por Mateo Rivas)',
                            duration: 30,
                          })
                        }
                        type="button"
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_18px_rgba(239,68,68,0.5)] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">play_arrow</span>
                      </button>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">
                          {post.audioReview.title}
                        </span>
                        <span className="text-[11px] text-[#ef4444] font-semibold">
                          {post.audioReview.markerLabel}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#ab8986]">
                      {post.audioReview.snippetDuration} Lossless
                    </span>
                  </div>

                  {/* Dynamic SVG Waveform with Drop Marker */}
                  <div className="w-full h-10 flex items-center">
                    <svg className="w-full h-8 text-[#ef4444]" fill="none" preserveAspectRatio="none" viewBox="0 0 600 40">
                      <path
                        d="M0,20 Q15,5 30,20 T60,20 T90,20 T120,5 T150,35 T180,20 T210,0 T240,40 T270,10 T300,30 T330,20 T360,20 T390,15 T420,25 T450,20 T480,8 T510,32 T540,20 T570,12 T600,20"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeOpacity="0.25"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M0,20 Q15,5 30,20 T60,20 T90,20 T120,5 T150,35 T180,20 T210,0 T240,40"
                        stroke="#ef4444"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <circle cx="210" cy="0" r="4.5" fill="#ef4444" className="drop-shadow-[0_0_8px_#ef4444]" />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center text-[#ab8986] font-mono text-[10px]">
                    <span>00:18 (Drop)</span>
                    <span className="text-[#ef4444] font-semibold">Punto clave seleccionado por el autor</span>
                    <span>00:30</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-6 text-xs text-[#cbc3d7]">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.isLiked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: post.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      <span className="font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-lg">chat_bubble</span>
                      <span>{post.commentsCount}</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('voicerooms')}
                    className="text-[#ef4444] hover:text-[#f87171] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver review completa</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </article>
            );
          }

          if (post.type === 'spotlight' && post.spotlight) {
            return (
              <article
                key={post.id}
                className="relative overflow-hidden rounded-2xl bg-[#1a1b20]/70 backdrop-blur-xl p-5 sm:p-6 shadow-lg border border-[#ef4444]/20"
              >
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 shadow-[0_0_30px_rgba(239,68,68,0.3)] ring-1 ring-[#ef4444]/40">
                    <img
                      src={post.spotlight.coverUrl}
                      alt={post.spotlight.artistName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#ef4444] text-white text-[9px] font-bold shadow-md">
                      RADAR SPOTLIGHT
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-2.5 w-full">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#ef4444] uppercase font-bold tracking-wider">
                          {post.spotlight.category}
                        </span>
                        <h3 className="text-xl font-extrabold text-white">
                          {post.spotlight.artistName}
                        </h3>
                        <span className="text-xs text-[#cbc3d7]">
                          {post.spotlight.genre} • {post.spotlight.location}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="py-1 px-4 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold shadow-[0_0_16px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
                      >
                        Seguir
                      </button>
                    </div>

                    <p className="text-xs text-[#cbc3d7] line-clamp-2">
                      {post.spotlight.description}
                    </p>

                    {/* Mini Sample Player */}
                    <div className="flex items-center gap-3 p-1.5 rounded-full bg-[#292a2e]/60 pr-4 border border-[#ef4444]/20">
                      <button
                        onClick={() =>
                          playTrack({
                            title: post.spotlight?.sampleTrack,
                            artist: post.spotlight?.artistName,
                            coverUrl: post.spotlight?.coverUrl,
                            duration: 45,
                          })
                        }
                        type="button"
                        className="w-8 h-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.4)] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-white truncate block">
                          {post.spotlight.sampleTrack}
                        </span>
                        <span className="text-[10px] text-[#ab8986] truncate block">
                          Nuevo sencillo adelanto
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#ab8986]">
                        {post.spotlight.sampleDuration}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
