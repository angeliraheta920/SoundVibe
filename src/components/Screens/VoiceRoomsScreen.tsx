import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { VOICE_ROOMS, SCHEDULED_ROOMS } from '../../data/mockData';

export const VoiceRoomsScreen: React.FC = () => {
  const {
    connectedRoom,
    joinVoiceRoom,
    leaveVoiceRoom,
    isHandRaised,
    toggleHandRaise,
    isMicMuted,
    toggleMicMute,
    setShowAudioSettingsModal,
    setShowCreateRoomModal,
    playTrack,
  } = usePlayer();

  const [activeCategory, setActiveCategory] = useState<'all' | 'dj' | 'debates' | 'parties'>('all');
  const [scheduledList, setScheduledList] = useState(SCHEDULED_ROOMS);
  const [queueHandCount, setQueueHandCount] = useState(12);

  const handleToggleHand = () => {
    toggleHandRaise();
    setQueueHandCount((prev) => (isHandRaised ? prev - 1 : prev + 1));
  };

  const toggleReminder = (id: string) => {
    setScheduledList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isReminderSet: !item.isReminderSet } : item
      )
    );
  };

  const featuredRoom = VOICE_ROOMS.find((r) => r.isFeatured) || VOICE_ROOMS[0];
  const regularRooms = VOICE_ROOMS.filter((r) => !r.isFeatured);

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Top Header & Live Broadcast Banner */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping"></span>
          <span className="text-[10px] sm:text-xs font-mono font-bold text-[#ef4444] tracking-widest uppercase">
            EN VIVO • RED SÓNICA EN DIRECTO
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Voice Rooms</h1>
            <p className="text-xs sm:text-sm text-[#cbc3d7] mt-0.5">
              42 Salas activas • <strong className="text-white">3.8k</strong> oyentes sintonizados
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowAudioSettingsModal(true)}
              type="button"
              className="py-2 px-4 rounded-full bg-[#1a1b20] hover:bg-[#292a2e] text-[#e3e2e7] text-xs font-bold flex items-center gap-2 border border-[#ef4444]/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#ef4444]">tune</span>
              <span>Ajustes de Audio 3D</span>
            </button>

            <button
              onClick={() => setShowCreateRoomModal(true)}
              type="button"
              className="py-2 px-5 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.45)] transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Crear Voice Room</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#ef4444] text-white shadow-[0_0_14px_rgba(239,68,68,0.4)]'
                : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
            }`}
          >
            Todas las salas
          </button>
          <button
            onClick={() => setActiveCategory('dj')}
            className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'dj'
                ? 'bg-[#ef4444] text-white shadow-[0_0_14px_rgba(239,68,68,0.4)]'
                : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">headphones</span>
            <span>Sesiones de DJ</span>
          </button>
          <button
            onClick={() => setActiveCategory('debates')}
            className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'debates'
                ? 'bg-[#ef4444] text-white shadow-[0_0_14px_rgba(239,68,68,0.4)]'
                : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">record_voice_over</span>
            <span>Debates de Álbumes</span>
          </button>
          <button
            onClick={() => setActiveCategory('parties')}
            className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'parties'
                ? 'bg-[#ef4444] text-white shadow-[0_0_14px_rgba(239,68,68,0.4)]'
                : 'bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">radio</span>
            <span>Listening Parties</span>
          </button>
        </div>
      </section>

      {/* Featured Room Card: "Synthwave Night Live & Feedback Sessions" */}
      <section className="relative overflow-hidden rounded-3xl bg-[#141114] p-6 sm:p-8 border border-[#ef4444]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef4444]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          {/* Left Column: Room info & Audio Player */}
          <div className="flex-1 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#dc2626] text-white text-[10px] font-mono font-bold tracking-wider">
                  SALA PRINCIPAL
                </span>
                <span className="text-[10px] font-mono text-[#f43f5e] font-bold">
                  BITRATE 320 KBPS / STEREO 3D
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#cbc3d7] font-mono">
                  <span className="material-symbols-outlined text-xs text-[#ef4444]">visibility</span>
                  <span>{featuredRoom.listenersCount} oyentes</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#cbc3d7] font-mono">
                  <span className="material-symbols-outlined text-xs text-[#f97316]">pan_tool</span>
                  <span>{queueHandCount} en cola</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {featuredRoom.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#cbc3d7] mt-2 leading-relaxed">
                {featuredRoom.description}
              </p>
            </div>

            {/* Currently playing inside room */}
            <div
              onClick={() =>
                playTrack({
                  title: featuredRoom.currentTrack?.title,
                  artist: featuredRoom.currentTrack?.artist,
                })
              }
              className="p-3.5 rounded-2xl bg-[#0d0e12]/80 border border-[#ef4444]/20 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#292a2e] text-[#ef4444] flex items-center justify-center flex-shrink-0 group-hover:bg-[#ef4444] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">music_note</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#ef4444] font-bold block">
                    SONANDO EN VIVO • Sincronizado
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate block">
                    {featuredRoom.currentTrack?.title} — {featuredRoom.currentTrack?.artist}
                  </span>
                </div>
              </div>

              {/* Animated Live Equalizer bars */}
              <div className="flex items-end gap-1 h-5 flex-shrink-0 pr-2">
                <div className="w-1 bg-[#ef4444] h-3 rounded-full animate-pulse"></div>
                <div className="w-1 bg-[#f43f5e] h-5 rounded-full animate-pulse"></div>
                <div className="w-1 bg-[#ef4444] h-2 rounded-full animate-pulse"></div>
                <div className="w-1 bg-[#f43f5e] h-4 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Stage Action Buttons */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <button
                onClick={() => joinVoiceRoom(featuredRoom.id, featuredRoom.title)}
                type="button"
                className="py-2.5 px-6 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(239,68,68,0.5)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">sensors</span>
                <span>Entrar al Stage</span>
              </button>

              <button
                onClick={handleToggleHand}
                type="button"
                className={`py-2 px-4 rounded-full text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isHandRaised
                    ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'bg-[#1a1b20] hover:bg-[#292a2e] border-white/10 text-[#e3e2e7]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">pan_tool</span>
                <span>Levantar la mano ({queueHandCount})</span>
              </button>

              <button
                type="button"
                className="p-2.5 rounded-full bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7] hover:text-white transition-colors"
                title="Compartir sala"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>

              <button
                type="button"
                className="p-2.5 rounded-full bg-[#1a1b20] hover:bg-[#292a2e] text-[#cbc3d7] hover:text-white transition-colors"
                title="Guardar sala"
              >
                <span className="material-symbols-outlined text-lg">bookmark</span>
              </button>
            </div>
          </div>

          {/* Right Column: Escenario en Vivo Stage Avatars & Telemetry */}
          <div className="w-full lg:w-72 rounded-2xl bg-[#0d0e12]/90 p-5 border border-[#ef4444]/25 flex flex-col justify-between gap-5 flex-shrink-0">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-[#ef4444]">mic</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Escenario en Vivo
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#ef4444] font-bold">
                  3 HABLANDO AHORA
                </span>
              </div>

              {/* Stage Speaker Grid */}
              <div className="grid grid-cols-2 gap-4">
                {featuredRoom.hosts.map((host) => (
                  <div key={host.name} className="flex flex-col items-center text-center">
                    <div className="relative mb-1">
                      <div
                        className={`w-14 h-14 rounded-full overflow-hidden p-0.5 transition-all ${
                          host.isSpeaking
                            ? 'ring-2 ring-[#ef4444] shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                            : 'ring-1 ring-white/10'
                        }`}
                      >
                        <img
                          src={host.avatarUrl}
                          alt={host.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      {host.isSpeaking && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#ef4444] ring-2 ring-[#0d0e12] flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-[80px]">
                      {host.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase ${
                        host.role === 'HOST'
                          ? 'text-[#ef4444]'
                          : host.role === 'CO-HOST'
                          ? 'text-[#f43f5e]'
                          : 'text-[#ab8986]'
                      }`}
                    >
                      {host.role}
                    </span>
                  </div>
                ))}

                {/* Speaker Podium Slot available */}
                <div
                  onClick={handleToggleHand}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1a1b20] border border-dashed border-[#ef4444]/40 flex items-center justify-center mb-1 group-hover:border-[#ef4444] group-hover:scale-105 transition-all">
                    <span className="material-symbols-outlined text-lg text-[#ef4444]">person_add</span>
                  </div>
                  <span className="text-xs font-bold text-[#e3e2e7] group-hover:text-[#ef4444]">
                    Subir al atril
                  </span>
                  <span className="text-[9px] text-[#958ea0]">Turno disponible</span>
                </div>
              </div>
            </div>

            {/* Signal Telemetry Oscilloscope */}
            <div className="p-3 rounded-xl bg-[#141114] border border-[#ef4444]/20 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#ab8986]">SEÑAL VOZ LATENCIA:</span>
                <span className="text-[#ef4444] font-bold">{featuredRoom.latencyMs}ms</span>
              </div>
              <div className="h-6 w-full flex items-center">
                <svg className="w-full h-6 text-[#ef4444]" fill="none" viewBox="0 0 200 24">
                  <path
                    d="M0,12 Q15,4 30,12 T60,12 T90,2 T120,22 T150,12 T180,8 T200,12"
                    stroke="#ef4444"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Other Live Voice Rooms: "Salas en Directo para Unirte" */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Salas en Directo para Unirte</h2>
            <p className="text-xs text-[#cbc3d7]">
              Audio bidireccional de baja latencia con masterización en vivo
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-mono text-[#ef4444] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todas (42)</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regularRooms.map((room) => (
            <div
              key={room.id}
              className="p-5 rounded-2xl bg-[#1a1b20]/70 backdrop-blur-xl border border-[#ef4444]/15 hover:border-[#ef4444]/35 transition-all flex flex-col justify-between gap-4 shadow-md hover:shadow-xl"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-[#ef4444] font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping"></span>
                    {room.category === 'debates' ? 'EN CONVERSACIÓN' : 'LIVE DJ SET HQ'}
                  </span>
                  <div className="flex items-center gap-2 text-[#ab8986]">
                    <span>{room.listenersCount} oyentes</span>
                    <span>•</span>
                    <span>{room.speakersCount} speakers</span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {room.title}
                </h3>
                {room.subtitle && (
                  <p className="text-xs text-[#cbc3d7] line-clamp-2 leading-relaxed">
                    {room.subtitle}
                  </p>
                )}

                {/* Host Line */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex -space-x-1.5">
                    {room.hosts.map((h, i) => (
                      <img
                        key={i}
                        src={h.avatarUrl}
                        alt={h.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-[#121317]"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {room.hosts[0]?.name} <span className="text-[10px] text-[#958ea0] font-normal">(Host)</span>
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 pt-1">
                  {room.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-[#292a2e] text-[#cbc3d7] text-[10px] font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => joinVoiceRoom(room.id, room.title)}
                  type="button"
                  className="flex-1 py-2 px-4 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_14px_rgba(239,68,68,0.35)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">sensors</span>
                  <span>Unirse a la Sala</span>
                </button>
                <button
                  onClick={handleToggleHand}
                  type="button"
                  className="p-2 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-[#ef4444] transition-colors"
                  title="Levantar la mano"
                >
                  <span className="material-symbols-outlined text-base">pan_tool</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Salas Programadas Próximamente */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-lg">event</span>
            <h2 className="text-base sm:text-lg font-bold text-white">Salas Programadas Próximamente</h2>
          </div>
          <span className="text-[11px] font-mono text-[#ab8986]">Horarios sincronizados con tu zona</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduledList.map((sch) => (
            <div
              key={sch.id}
              className="p-4 rounded-2xl bg-[#1a1b20]/70 border border-white/5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#292a2e] border border-white/5 text-center flex-shrink-0">
                  <span className="text-[9px] font-mono text-[#ef4444] font-bold">{sch.dateLabel}</span>
                  <span className="text-sm font-extrabold text-white">{sch.timeLabel}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#f43f5e] font-bold uppercase">
                    {sch.tag}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px]">
                    {sch.title}
                  </h4>
                  <span className="text-[11px] text-[#958ea0] truncate">{sch.subtext}</span>
                </div>
              </div>

              <button
                onClick={() => toggleReminder(sch.id)}
                type="button"
                className={`py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  sch.isReminderSet
                    ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">notifications</span>
                <span>{sch.isReminderSet ? 'Recordatorio Activo' : 'Recordarme'}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Active Voice Room Status Pill Dock */}
      {connectedRoom && (
        <div className="sticky bottom-24 lg:bottom-28 z-30 mx-auto w-full max-w-xl p-2.5 rounded-full bg-[#141114]/95 backdrop-blur-2xl border border-[#ef4444]/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 pl-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-ping flex-shrink-0"></span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white truncate block">
                CONECTADO • {connectedRoom}
              </span>
              <span className="text-[10px] font-mono text-[#ef4444]">
                Audio Espacial 3D Activo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={toggleMicMute}
              type="button"
              className={`py-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                isMicMuted
                  ? 'bg-[#292a2e] text-[#cbc3d7]'
                  : 'bg-[#ef4444] text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isMicMuted ? 'mic_off' : 'mic'}
              </span>
              <span>{isMicMuted ? 'Silenciado' : 'Hablando'}</span>
            </button>

            <button
              onClick={handleToggleHand}
              type="button"
              className={`p-1.5 rounded-full ${
                isHandRaised ? 'bg-[#f43f5e] text-white' : 'bg-[#292a2e] text-[#cbc3d7]'
              }`}
              title="Levantar la mano"
            >
              <span className="material-symbols-outlined text-base">pan_tool</span>
            </button>

            <button
              onClick={leaveVoiceRoom}
              type="button"
              className="py-1.5 px-3 rounded-full bg-[#dc2626] hover:bg-[#b91a24] text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden sm:inline">Dejar sala</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
