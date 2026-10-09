import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { USER_PLAYLISTS } from '../../data/mockData';

export const BibliotecaScreen: React.FC = () => {
  const { playTrack, setShowCreateRoomModal } = usePlayer();
  const [activeTab, setActiveTab] = useState<'playlists' | 'favoritas' | 'resenas' | 'colaboraciones'>('playlists');
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [anthemLiked, setAnthemLiked] = useState(true);

  const favoriteArtists = [
    {
      id: 1,
      name: 'Jon Hopkins',
      genre: 'Electronic / Ambient',
      rank: '#1',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGYu8S-LUWFpT2ITSNyx3EP-DPGsgurwdS3UGimrio6IE5k-4QhRlTpVY1FrOmQO3ikUK-iPdZqKBArFbNy1Pl_Zffcw-0TiNYooSutJjoT10t4VhjVY_h5A0fLIr2g1Xcr-Oo5qcX2fd1OpeCmBtZs_y-EKT8A7bdy079yJMkE8kCZSEsx9GxoB8g1_LkBClXymuhPpVKqisQBfdRSEkibbjdaDG1ZNGZ9jE2fY9Hw19tR136KnUn',
    },
    {
      id: 2,
      name: 'Bicep',
      genre: 'Breakbeat / Techno',
      rank: '#2',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTv5hD0Eeus2K7c5vy1OL-fVcXsksj2mmW7Mwtmg2CWy0DERmL_bTtuLvMsg0WARhbzypkyidVR_bHETH--k9zq9c7r92K_rhjRvvSGD689SWFw2IrPVuaHiFrxuX4zf3tFjXmrsF8BSqpkbj19rKNpkpKC4EmKgmUpJJjKVYU14RM1pmCJksL8epCPFTAzdndjqQoqbMSbHp2pDj0hvffqYoezL_lmk7f1twBil2-GQPUjP4YM1fF',
    },
    {
      id: 3,
      name: 'Tycho',
      genre: 'Chillwave / Downtempo',
      rank: '#3',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1k4EuAGEXm6FJ3CKk4KuYOwaYWPie2-gQjwkC5WUe08oPWQFf5l3ifBUp0_PoAbYmtmg5EYPktojrB4tPxDvA4Wa9xzz716AY3oapXLBlftwbkPWox0DfqlFZHOIUxcDOzKKWITxMI-YQGqS_uCg3YfPRBrw3z-7bS_J9grJcBckScWSsdstpS_Uc2-hofSms4qrayya3MyEhCFs7_9VLJk1Vn2Ax2W7hFTVdil7sMclFwjD-yrS7',
    },
    {
      id: 4,
      name: 'Kiasmos',
      genre: 'Neo-Classical / Minimal',
      rank: '#4',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6yVV_2wCmmhjaIw_qwxSevpFtObMHomj8YOi5LoY383S6kY9L7HNTH9S06TupG4Pfiv9XyXqfMoy22Ug4UZwoDCw0TgIlmvhkOy7etPF0tKpAtTuzvkCaNmBl9-gL78f8lXQui3ev_aU9m8cfeHm8NK2keBKwB-Cih-fO39DA86wwHMkvJ3QoctS6I4KzpNvbWDIt9AcjLOzqfYyqtnZhI52MEV0HQIWj7cNugyU7GqmKT-Mx8R9W',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-8">
      {/* 1. Hero Header Banner */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-[#1a1b20] shadow-xl border border-white/5">
        <div
          className="w-full h-56 sm:h-64 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYaVpz2HWK5kiY1pTmoDXMhoSfPFVLwBFnzCoo4nVA_V7SxbLWqvzvP9c5hzKCHOhj3Erx93eLH1pVjcGdG1QcujHDjjql32NfEwwGMhgyittSLxSzVNPPnOQtlRfAPZXGlQ3xvcZrPmf0LoOW-ijQ8FM1YSlYKbIxWoCj4N56jmLauCFEkNRL0N24cS0OdTHHIpXhnzUE_qtXRhKqdFHd6xO42_wPyVo8yBhQGdUGtb9I77Yct4hc')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b20] via-[#1a1b20]/60 to-transparent"></div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d0e12]/80 backdrop-blur-md border border-[#ef4444]/30">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-[#ef4444] tracking-widest uppercase">
              En Línea • Produciendo
            </span>
          </div>
        </div>

        {/* Profile Details Overlap */}
        <div className="px-6 sm:px-10 pb-6 -mt-16 sm:-mt-20 relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl bg-[#343439] ring-4 ring-[#ef4444]/40 shadow-[0_0_24px_rgba(239,68,68,0.4)]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkGssoy7rmBy7-kFvuiBaz8rLlBOtb_tNbuxOOJ0_3CSU-lt9JST3cEDlA-N2P-zhMDFtPYtbjati67_rlaFXkJc48RZUzb9OqoSfQiAaODXMT_fg4tjuurE41NMdAJarrUEEhVZyuSFXvzPWAUxvwGd2n1rmSjDnRtDwGvA3BbihfgFGX1WJFurj7s_ixTFBAAehBx6yPYJ2Tg-1AeRixpSilg9TXJg1E-Rc5jX-K0b8NxyATHeqg"
                  alt="Valentina"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-6 h-6 rounded-full bg-[#ef4444] shadow-[0_0_12px_#ef4444] flex items-center justify-center">
                <span className="material-symbols-outlined text-xs text-white font-bold">check</span>
              </span>
            </div>

            <div className="flex flex-col text-center md:text-left gap-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Valentina</h1>
                <span className="material-symbols-outlined text-[#ef4444] text-xl" title="Verificada">
                  verified
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 font-mono text-[10px] font-bold tracking-wider uppercase">
                  Pro Creator
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#f43f5e]">@valentinamusic</p>
              <p className="text-xs sm:text-sm text-[#cbc3d7] max-w-xl mt-1">
                Productora & exploradora sonora 🎧 | Creando paisajes sonoros en la noche 🌙
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 mt-3 text-xs">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-white text-sm">1.4k</span>
                  <span className="text-[#ab8986]">seguidores</span>
                </div>
                <span className="text-[#5b403e]">•</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-white text-sm">480</span>
                  <span className="text-[#ab8986]">siguiendo</span>
                </div>
                <span className="text-[#5b403e]">•</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-white text-sm">26</span>
                  <span className="text-[#ab8986]">playlists</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowCreateRoomModal(true)}
              type="button"
              className="py-2 px-5 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Crear Playlist</span>
            </button>
            <button
              type="button"
              className="py-2 px-4 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#e3e2e7] text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span>Editar perfil</span>
            </button>
            <button
              type="button"
              className="p-2 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#e3e2e7] transition-colors border border-white/5 cursor-pointer"
              title="Compartir perfil"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Dual Showcase: Himno Actual & Monthly Analytics */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Himno Actual (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-3xl bg-[#1a1b20] p-6 shadow-lg relative overflow-hidden flex flex-col justify-between gap-5 border border-[#ef4444]/20">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#ef4444]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ef4444] text-lg">repeat</span>
                <span className="text-xs font-mono font-bold text-[#ef4444] uppercase tracking-wider">
                  Himno Actual / En Repetición
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#292a2e] text-[#f43f5e] font-mono text-[10px] font-bold flex items-center gap-1 border border-[#f43f5e]/20">
                <span className="material-symbols-outlined text-xs text-[#ef4444]">local_fire_department</span>
                <span>42 reproducciones esta semana</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div
                onClick={() =>
                  playTrack({
                    title: 'Resonance',
                    artist: 'HOME • Odyssey',
                    album: 'Odyssey',
                    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuN0Vozz608OXJO3B_eLSrMdVKw4O_dmI_JrjzNtIQ9ueI3MCiUb0JnqUVAizfL8jV3i_97wIlx45K4cBDZ43XRX-JaddjFnIGRpsjp0R3HtP71Ht5JF2BiblUIKkvKw-7XiQLjE54rN38_k3M6jVfYTxrIYk757C7k5iqjTv_GZ8TsuLCaOpz-D3WSVsEgHo73Z9po8OIL9dqZm9TngGsvhlGipkDMRCaqY3ZjKn3KUBgvhp57dyv',
                  })
                }
                className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(239,68,68,0.35)] flex-shrink-0 bg-[#292a2e] ring-1 ring-[#ef4444]/30 cursor-pointer"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuN0Vozz608OXJO3B_eLSrMdVKw4O_dmI_JrjzNtIQ9ueI3MCiUb0JnqUVAizfL8jV3i_97wIlx45K4cBDZ43XRX-JaddjFnIGRpsjp0R3HtP71Ht5JF2BiblUIKkvKw-7XiQLjE54rN38_k3M6jVfYTxrIYk757C7k5iqjTv_GZ8TsuLCaOpz-D3WSVsEgHo73Z9po8OIL9dqZm9TngGsvhlGipkDMRCaqY3ZjKn3KUBgvhp57dyv"
                  alt="Resonance HOME Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-white">play_circle</span>
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white truncate">Resonance</h2>
                  <span className="px-2 py-0.5 rounded-md bg-[#891933]/40 text-[#f43f5e] font-mono text-[9px] font-bold uppercase tracking-wider border border-[#f43f5e]/30">
                    FLAC 24-bit
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#cbc3d7]">
                  HOME • <span className="text-[#ab8986]">Odyssey</span>
                </p>

                <div className="mt-1 p-2 px-3 rounded-xl bg-[#292a2e]/60 flex items-start gap-2 border-l-2 border-[#ef4444]">
                  <span className="material-symbols-outlined text-[#ef4444] text-xs mt-0.5">
                    format_quote
                  </span>
                  <p className="text-xs text-[#e3e2e7] italic line-clamp-2">
                    "Esta línea de sintetizador me mantiene concentrada en sesiones de mezcla a las 3:00 AM."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Waveform Visualizer & Action Bar */}
          <div className="flex flex-col gap-2">
            <div
              onClick={() =>
                playTrack({
                  title: 'Resonance',
                  artist: 'HOME • Odyssey',
                  coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuN0Vozz608OXJO3B_eLSrMdVKw4O_dmI_JrjzNtIQ9ueI3MCiUb0JnqUVAizfL8jV3i_97wIlx45K4cBDZ43XRX-JaddjFnIGRpsjp0R3HtP71Ht5JF2BiblUIKkvKw-7XiQLjE54rN38_k3M6jVfYTxrIYk757C7k5iqjTv_GZ8TsuLCaOpz-D3WSVsEgHo73Z9po8OIL9dqZm9TngGsvhlGipkDMRCaqY3ZjKn3KUBgvhp57dyv',
                })
              }
              className="h-10 w-full flex items-end gap-[3px] py-1 cursor-pointer"
            >
              {Array.from({ length: 25 }).map((_, i) => {
                const heightPercent = Math.sin(i * 0.45) * 35 + 50;
                const isRed = i < 12;
                return (
                  <div
                    key={i}
                    style={{ height: `${heightPercent}%` }}
                    className={`w-1 rounded-full ${
                      isRed ? 'bg-[#ef4444] shadow-[0_0_6px_#ef4444]' : 'bg-[#5b403e]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    playTrack({
                      title: 'Resonance',
                      artist: 'HOME • Odyssey',
                    })
                  }
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#ef4444] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_18px_rgba(239,68,68,0.55)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl">play_arrow</span>
                </button>
                <button
                  onClick={() => setAnthemLiked(!anthemLiked)}
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-bold text-[#e3e2e7] hover:text-[#ef4444] transition-colors cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-xl text-[#ef4444]"
                    style={{ fontVariationSettings: anthemLiked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                  <span>2.4k me gusta</span>
                </button>
              </div>
              <span className="text-[11px] font-mono text-[#ab8986]">
                03:32 • Synthwave / Retrowave
              </span>
            </div>
          </div>
        </div>

        {/* Top Géneros Analytics Card (4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-3xl bg-[#1a1b20] p-6 shadow-lg flex flex-col justify-between border border-white/5">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ef4444] text-lg">insights</span>
                <span className="text-xs sm:text-sm font-bold text-white">Top Géneros del Mes</span>
              </div>
              <span className="text-[10px] font-mono text-[#f43f5e] font-bold">MARZO 2025</span>
            </div>

            <div className="flex items-center gap-3 my-3 p-3 rounded-2xl bg-[#292a2e]/60 border border-[#ef4444]/15">
              <div className="w-11 h-11 rounded-xl bg-[#ef4444]/20 flex items-center justify-center text-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.25)] flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">hourglass_bottom</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-none">86 hrs</span>
                <span className="text-[11px] text-[#cbc3d7]">Tiempo de escucha en 30 días</span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#e3e2e7]">Ambient Synth</span>
                  <span className="text-[#ef4444] font-bold">45%</span>
                </div>
                <div className="h-2 w-full bg-[#292a2e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full shadow-[0_0_8px_#ef4444]"
                    style={{ width: '45%' }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#e3e2e7]">Nu-Disco</span>
                  <span className="text-[#f43f5e] font-bold">30%</span>
                </div>
                <div className="h-2 w-full bg-[#292a2e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f43f5e] to-[#ef4444] rounded-full shadow-[0_0_8px_#f43f5e]"
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#e3e2e7]">Indie Rock</span>
                  <span className="text-[#f97316] font-bold">25%</span>
                </div>
                <div className="h-2 w-full bg-[#292a2e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#dc2626] to-[#f97316] rounded-full shadow-[0_0_8px_#f97316]"
                    style={{ width: '25%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center justify-between text-xs border-t border-white/5">
            <span className="text-[10px] text-[#ab8986]">Basado en 1,248 reproducciones</span>
            <button
              type="button"
              className="text-[#ef4444] font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-xs"
            >
              <span>Ver desglose</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Content Tabs & Playlists Grid */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'playlists'
                  ? 'bg-[#dc2626] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)] font-bold'
                  : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              <span>Mis Playlists</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-white font-mono text-[10px] font-bold">
                26
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favoritas')}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'favoritas'
                  ? 'bg-[#dc2626] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)] font-bold'
                  : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              <span>Favoritas</span>
              <span className="text-[10px] text-[#ab8986]">142</span>
            </button>

            <button
              onClick={() => setActiveTab('resenas')}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'resenas'
                  ? 'bg-[#dc2626] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)] font-bold'
                  : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              <span>Reseñas & Notas</span>
              <span className="text-[10px] text-[#ab8986]">38</span>
            </button>

            <button
              onClick={() => setActiveTab('colaboraciones')}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'colaboraciones'
                  ? 'bg-[#dc2626] text-white shadow-[0_0_18px_rgba(239,68,68,0.45)] font-bold'
                  : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              <span>Colaboraciones</span>
              <span className="text-[10px] text-[#ab8986]">4</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="py-1 px-3 rounded-full bg-[#1a1b20] text-[#e3e2e7] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#292a2e] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">sort</span>
              <span>Recientes</span>
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full bg-[#1a1b20] text-[#cbc3d7] hover:text-white"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Playlists (8-9 Cols) + Right Sidebar Widget (3-4 Cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 2xl:col-span-9 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {USER_PLAYLISTS.map((pl) => (
              <div
                key={pl.id}
                onClick={() =>
                  playTrack({
                    title: pl.title,
                    artist: 'Valentina Curated',
                    coverUrl: pl.coverUrl,
                  })
                }
                className="group relative rounded-2xl bg-[#1a1b20] hover:bg-[#292a2e] transition-all duration-300 p-4 flex flex-col justify-between shadow-md hover:shadow-xl border border-white/5 hover:border-[#ef4444]/30 cursor-pointer"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#292a2e] shadow-lg">
                    <img
                      src={pl.coverUrl}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        className="w-12 h-12 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.7)] hover:scale-110 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-2xl">play_arrow</span>
                      </button>
                    </div>

                    {pl.isColab ? (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#891933]/90 text-white font-mono text-[9px] font-bold flex items-center gap-1 border border-[#f43f5e]/40 shadow-sm">
                        <span className="material-symbols-outlined text-[10px]">group</span> Colab
                      </span>
                    ) : pl.isPrivate ? (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#0d0e12]/90 text-[#ab8986] font-mono text-[9px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">lock</span> Privada
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#0d0e12]/80 backdrop-blur-md text-[#e3e2e7] font-mono text-[9px]">
                        Pública
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ef4444] transition-colors truncate">
                    {pl.title}
                  </h3>
                  <p className="text-[11px] text-[#cbc3d7] mt-0.5">
                    {pl.isColab
                      ? `${pl.trackCount} canciones • Con ${pl.colabWith}`
                      : `${pl.trackCount} canciones • ${pl.duration}`}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-xs">
                  {pl.likes ? (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-[#f43f5e]">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                      {pl.likes}
                    </span>
                  ) : pl.bpmRange ? (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-[#ef4444]">
                      <span className="material-symbols-outlined text-xs">graphic_eq</span>
                      {pl.bpmRange}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[#ab8986]">
                      {pl.updatedAgo || 'Solo tú'}
                    </span>
                  )}

                  <button type="button" className="text-[#ab8986] hover:text-white">
                    <span className="material-symbols-outlined text-base">more_horiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side Widget: Upcoming Live Stream & Top Artists */}
          <aside className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-6">
            {/* Live Session Reminder Widget */}
            <div className="rounded-3xl bg-[#1a1b20] p-5 shadow-lg border border-[#ef4444]/25 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#ef4444]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping"></span>
                  En Vivo Próximamente
                </span>
                <span className="text-[10px] font-mono text-[#f43f5e]">JUE 22:00 CET</span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  Sesión de Mezcla: Deep Electronic Horizons
                </h4>
                <p className="text-xs text-[#cbc3d7] mt-1 leading-relaxed">
                  Valentina transmitirá un live set exclusivo con sintetizadores analógicos y visuales reactivos en vivo.
                </p>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#292a2e]/60 border border-[#ef4444]/15">
                <span className="material-symbols-outlined text-[#ef4444] text-lg">
                  notifications_active
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">184 personas registradas</span>
                  <span className="text-[10px] text-[#ab8986]">Transmisión de 90 minutos</span>
                </div>
              </div>

              <button
                onClick={() => setIsReminderSet(!isReminderSet)}
                type="button"
                className={`w-full py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isReminderSet
                    ? 'bg-[#ef4444] text-white shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                    : 'bg-[#292a2e] hover:bg-[#343439] text-[#e3e2e7]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">event</span>
                <span>{isReminderSet ? 'Recordatorio fijado' : 'Programar recordatorio'}</span>
              </button>
            </div>

            {/* Artistas Favoritos */}
            <div className="rounded-3xl bg-[#1a1b20] p-5 shadow-lg border border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ef4444] text-base">star</span>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Artistas Favoritos</h4>
                </div>
                <span className="text-[10px] font-mono text-[#ab8986]">TOP 5</span>
              </div>

              <div className="flex flex-col gap-2">
                {favoriteArtists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() =>
                      playTrack({
                        title: `Top Track: ${artist.name}`,
                        artist: artist.genre,
                      })
                    }
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#292a2e] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#292a2e] ring-1 ring-[#ef4444]/40 flex-shrink-0">
                        <img
                          src={artist.avatarUrl}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate group-hover:text-[#ef4444]">
                          {artist.name}
                        </span>
                        <span className="text-[10px] text-[#ab8986] truncate">{artist.genre}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#ef4444] font-bold">{artist.rank}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="w-full py-1.5 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-white text-xs font-semibold transition-colors text-center cursor-pointer"
              >
                Ver biblioteca completa
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
