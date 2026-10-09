import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { CHAT_THREADS, INITIAL_CHAT_MESSAGES } from '../../data/mockData';
import { ChatMessage } from '../../types';

export const ChatsScreen: React.FC = () => {
  const { playTrack, setShowGroupSessionModal } = usePlayer();
  const [threads, setThreads] = useState(CHAT_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState('ct-1');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeFilter, setActiveFilter] = useState<'todos' | 'no_leidos' | 'salas' | 'productores'>('todos');
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [voicePlaybackSpeed, setVoicePlaybackSpeed] = useState('1x');
  const [snippetLiked, setSnippetLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Tú',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const toggleSpeed = () => {
    setVoicePlaybackSpeed((prev) => (prev === '1x' ? '1.5x' : prev === '1.5x' ? '2x' : '1x'));
  };

  const handleShareRoomLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-13rem)] sm:h-[calc(100vh-12rem)] min-h-[580px]">
      <div className="grid grid-cols-12 gap-4 h-full min-h-0">
        {/* LEFT PANEL: Conversation Directory */}
        <section className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col bg-[#1a1b20] rounded-2xl shadow-xl overflow-hidden min-h-0 border border-white/5">
          {/* Header & Filter Search */}
          <div className="p-3.5 flex flex-col gap-2.5 bg-[#0d0e12]/60 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-tight">Chats</span>
                <span className="px-2 py-0.5 rounded-full bg-[#dc2626] text-white font-mono text-[10px] font-bold">
                  12
                </span>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#292a2e] hover:bg-[#343439] flex items-center justify-center text-[#ef4444] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Nuevo Mensaje"
              >
                <span className="material-symbols-outlined text-lg">edit_square</span>
              </button>
            </div>

            {/* Pill Search Input */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8986] text-base pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar chats o amigos..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#292a2e]/60 focus:bg-[#292a2e] text-white placeholder:text-[#ab8986] text-xs outline-none focus:ring-1 focus:ring-[#ef4444] transition-all"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFilter('todos')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'todos'
                    ? 'bg-[#ef4444] text-white shadow-sm'
                    : 'bg-[#292a2e] text-[#cbc3d7]'
                }`}
              >
                Todos (12)
              </button>
              <button
                onClick={() => setActiveFilter('no_leidos')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'no_leidos'
                    ? 'bg-[#ef4444] text-white'
                    : 'bg-[#292a2e] text-[#cbc3d7]'
                }`}
              >
                No leídos (4)
              </button>
              <button
                onClick={() => setActiveFilter('salas')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'salas'
                    ? 'bg-[#ef4444] text-white'
                    : 'bg-[#292a2e] text-[#cbc3d7]'
                }`}
              >
                Salas (3)
              </button>
              <button
                onClick={() => setActiveFilter('productores')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'productores'
                    ? 'bg-[#ef4444] text-white'
                    : 'bg-[#292a2e] text-[#cbc3d7]'
                }`}
              >
                Productores
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1 min-h-0">
            {threads.map((thread) => {
              const isSelected = thread.id === selectedThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`relative p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#292a2e] text-white shadow-md'
                      : 'hover:bg-[#292a2e]/50 text-[#cbc3d7]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#ef4444] to-[#f43f5e] rounded-r-full"></div>
                  )}

                  <div className="flex items-start gap-2.5 pl-1">
                    <div className="relative flex-shrink-0">
                      {thread.avatarUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#ef4444]/40">
                          <img
                            src={thread.avatarUrl}
                            alt={thread.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#891933]/60 text-white font-bold flex items-center justify-center text-xs">
                          {thread.initials}
                        </div>
                      )}

                      {thread.isListeningTogether && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ef4444] flex items-center justify-center ring-2 ring-[#121317]">
                          <span className="material-symbols-outlined text-[9px] text-white">
                            graphic_eq
                          </span>
                        </span>
                      )}
                      {thread.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ef4444] ring-2 ring-[#121317] animate-pulse"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{thread.name}</span>
                        <span className="text-[10px] text-[#ab8986] font-mono">{thread.timeAgo}</span>
                      </div>

                      {thread.isListeningTogether && (
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="px-1.5 py-0.2 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#ef4444] animate-ping"></span>
                            Escuchando juntos
                          </span>
                        </div>
                      )}

                      <p className="text-[11px] text-[#cbc3d7] truncate">{thread.lastMessage}</p>
                    </div>

                    {thread.unreadCount && (
                      <span className="w-5 h-5 rounded-full bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CENTER PANEL: Primary Interactive Chat Room */}
        <main className="col-span-12 lg:col-span-8 xl:col-span-6 flex flex-col bg-[#1a1b20] rounded-2xl shadow-xl overflow-hidden min-h-0 border border-white/5">
          {/* Room Header */}
          <header className="p-3.5 bg-[#0d0e12]/80 backdrop-blur-xl flex items-center justify-between gap-3 border-b border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#292a2e] flex items-center justify-center ring-2 ring-[#ef4444]/40">
                  <span className="material-symbols-outlined text-[#ef4444] text-xl">audiotrack</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ef4444] ring-2 ring-[#121317]"></span>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                  {selectedThread.name}
                </h2>
                <div className="flex items-center gap-1.5 text-[#ef4444] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                  <span className="truncate">3 personas activas • Audio sincronizado en vivo</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setShowGroupSessionModal(true)}
                type="button"
                className="p-2 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#ef4444] hover:text-white transition-all cursor-pointer"
                title="Llamada de estudio grupal"
              >
                <span className="material-symbols-outlined text-lg">headset_mic</span>
              </button>
              <button
                onClick={handleShareRoomLink}
                type="button"
                className="p-2 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-white transition-all cursor-pointer"
                title="Compartir sala"
              >
                <span className="material-symbols-outlined text-lg">ios_share</span>
              </button>
              <button
                type="button"
                className="p-2 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-white transition-all cursor-pointer"
                title="Ajustes de sala"
              >
                <span className="material-symbols-outlined text-lg">tune</span>
              </button>
            </div>
          </header>

          {/* Synced Live Session Track Bar */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-[#292a2e] via-[#141114] to-[#292a2e] border-b border-[#ef4444]/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() =>
                    playTrack({
                      title: 'Midnight Overdrive (VIP Club Mix)',
                      artist: 'Kavinsky & Sofia Chen',
                    })
                  }
                  type="button"
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] flex items-center justify-center text-white shadow-md shadow-[#ef4444]/40 flex-shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#ef4444] font-bold uppercase tracking-wider">
                      SESIÓN COMPARTIDA ACTIVA
                    </span>
                    <span className="material-symbols-outlined text-xs text-[#ef4444]">sensors</span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">
                    Midnight Overdrive (VIP Club Mix)
                  </p>
                </div>
              </div>

              {/* Participant Facepile */}
              <div className="flex items-center -space-x-1.5 flex-shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANH9_rjSL94vq_L393znO3G4bqF5X2fKjfNKYoe-uAh3xAL8v2sMJ2YDtB4D-pKaHY2W8XdpI0s1JQ_G-aTznfbGCGlGrlFzRr14i838hGo3pK3Sp8RDTylc0lvm3y_u2RfqPH-44QD3xXmbO7MOu2Mw5j1c5sb8z-h0zZB-SHLNanEhCqLYJpRWUtHflrYvgXa0ddumoW7qJgUwfq2SG5pi2UbWmr5xLXoYnw7Ucd2wvvA2Tm3mEg"
                  alt="Sara V"
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-[#121317]"
                />
                <div className="w-6 h-6 rounded-full bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#121317]">
                  KN
                </div>
                <div className="w-6 h-6 rounded-full bg-[#343439] text-[#ef4444] text-[9px] font-bold flex items-center justify-center ring-2 ring-[#121317]">
                  TÚ
                </div>
              </div>
            </div>

            {/* Live Waveform Scrubber */}
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#ef4444] font-bold">01:42</span>
              <div className="flex-1 flex items-end gap-[2px] h-4 py-0.5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ height: `${Math.sin(i * 0.4) * 8 + 8}px` }}
                    className={`flex-1 rounded-full ${
                      i < 13 ? 'bg-gradient-to-t from-[#ef4444] to-[#f43f5e]' : 'bg-[#343439]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-[#ab8986]">03:58</span>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4 min-h-0">
            {/* Date divider */}
            <div className="flex items-center justify-center my-1">
              <span className="px-3 py-1 rounded-full bg-[#292a2e] text-[#ab8986] font-mono text-[10px] font-medium">
                Hoy • Sala de Escucha
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  msg.isMe ? 'self-end flex-row-reverse' : ''
                }`}
              >
                {!msg.isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-[#ef4444]/40">
                    {msg.avatarUrl ? (
                      <img src={msg.avatarUrl} alt={msg.senderName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#891933] text-white flex items-center justify-center text-xs font-bold">
                        {msg.initials || msg.senderName.slice(0, 2)}
                      </div>
                    )}
                  </div>
                )}

                <div className={`flex flex-col gap-1 min-w-0 ${msg.isMe ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{msg.senderName}</span>
                    <span className="text-[10px] font-mono text-[#ab8986]">{msg.time}</span>
                  </div>

                  {msg.text && (
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm ${
                        msg.isMe
                          ? 'rounded-tr-sm bg-gradient-to-r from-[#ef4444] to-[#f43f5e] text-white shadow-md'
                          : 'rounded-tl-sm bg-[#292a2e] text-[#e3e2e7]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Interactive Audio Snippet Card */}
                  {msg.audioSnippet && (
                    <div className="p-3 rounded-2xl bg-[#0d0e12] border border-[#ef4444]/25 shadow-lg flex flex-col gap-2 max-w-sm mt-1">
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() =>
                            playTrack({
                              title: msg.audioSnippet?.title,
                              artist: msg.audioSnippet?.artist,
                              coverUrl: msg.audioSnippet?.coverUrl,
                              duration: 45,
                            })
                          }
                          className="relative w-12 h-12 rounded-xl bg-[#292a2e] overflow-hidden flex-shrink-0 cursor-pointer group"
                        >
                          <img
                            src={msg.audioSnippet.coverUrl}
                            alt={msg.audioSnippet.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[#ef4444]/50 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">play_arrow</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="px-1.5 py-0.2 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-mono text-[9px] font-bold uppercase">
                            Snippet {msg.audioSnippet.duration}
                          </span>
                          <p className="text-xs font-bold text-white truncate">
                            {msg.audioSnippet.title}
                          </p>
                          <p className="text-[11px] text-[#cbc3d7] truncate">
                            {msg.audioSnippet.artist}
                          </p>
                        </div>
                      </div>

                      {/* Mini Waveform */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#141114]">
                        <span className="material-symbols-outlined text-xs text-[#ef4444]">
                          equalizer
                        </span>
                        <div className="flex-1 flex items-center gap-1 h-3">
                          <div className="h-2 w-1 bg-[#ef4444] rounded-full"></div>
                          <div className="h-3 w-1 bg-[#ef4444] rounded-full"></div>
                          <div className="h-1.5 w-1 bg-[#ef4444] rounded-full"></div>
                          <div className="h-3 w-1 bg-[#ef4444] rounded-full"></div>
                          <div className="h-2.5 w-1 bg-[#343439] rounded-full"></div>
                          <div className="h-1.5 w-1 bg-[#343439] rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-mono text-[#ab8986]">0:45</span>
                      </div>

                      {/* Reactions */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => setSnippetLiked(!snippetLiked)}
                          className="px-2 py-0.5 rounded-full bg-[#292a2e] text-xs flex items-center gap-1 hover:bg-[#343439] cursor-pointer"
                        >
                          <span>🔥</span>
                          <span className="text-[10px] font-bold text-[#ef4444]">
                            {snippetLiked ? msg.audioSnippet.reactionFire + 1 : msg.audioSnippet.reactionFire}
                          </span>
                        </button>
                        <button className="px-2 py-0.5 rounded-full bg-[#292a2e] text-xs flex items-center gap-1 hover:bg-[#343439] cursor-pointer">
                          <span>⚡</span>
                          <span className="text-[10px] font-bold text-white">
                            {msg.audioSnippet.reactionLightning}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Voice Note Bubble */}
                  {msg.voiceNote && (
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-[#292a2e] text-white shadow-sm flex items-center gap-3 w-64 sm:w-72 mt-1">
                      <button
                        onClick={() => setIsVoiceNotePlaying(!isVoiceNotePlaying)}
                        type="button"
                        className="w-9 h-9 rounded-full bg-[#ef4444] text-white flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#ef4444]/40 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {isVoiceNotePlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      <div className="flex-1 flex flex-col gap-1">
                        {/* Audio Waveform */}
                        <div className="flex items-center gap-0.5 h-5">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <div
                              key={i}
                              style={{ height: `${Math.sin(i * 0.5) * 8 + 8}px` }}
                              className={`w-1 rounded-full ${
                                i < 7 ? 'bg-[#ef4444]' : 'bg-[#5b403e]'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#cbc3d7] font-mono">
                          <span>{msg.voiceNote.playedDuration} / {msg.voiceNote.duration}</span>
                          <button
                            onClick={toggleSpeed}
                            className="px-1.5 py-0.2 rounded bg-[#1a1b20] text-[#ef4444] font-bold hover:bg-[#343439] cursor-pointer"
                          >
                            {voicePlaybackSpeed}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <footer className="p-3 bg-[#0d0e12]/80 backdrop-blur-xl border-t border-white/5">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1.5 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#ef4444] hover:text-white transition-all cursor-pointer"
                  title="Adjuntar Track / Playlist"
                >
                  <span className="material-symbols-outlined text-base">library_add</span>
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-[#ef4444] transition-all cursor-pointer"
                  title="Grabar Nota de Voz"
                >
                  <span className="material-symbols-outlined text-base">mic</span>
                </button>
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe un mensaje o pega un enlace de canción..."
                  className="w-full pl-3.5 pr-8 py-2 rounded-full bg-[#292a2e] text-white placeholder:text-[#ab8986] text-xs outline-none focus:ring-1 focus:ring-[#ef4444]"
                />
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#ab8986] text-base pointer-events-none">
                  music_note
                </span>
              </div>

              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white flex items-center justify-center shadow-lg shadow-[#ef4444]/40 hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>
          </footer>
        </main>

        {/* RIGHT PANEL: Context Details & Music Deck (Hidden on small tablets, shown on xl) */}
        <aside className="col-span-12 xl:col-span-3 hidden xl:flex flex-col bg-[#1a1b20] rounded-2xl shadow-xl overflow-hidden min-h-0 border border-white/5">
          <div className="p-3.5 bg-[#0d0e12]/80 backdrop-blur-xl flex items-center justify-between border-b border-white/5">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">
              Detalles de Sala
            </span>
            <button type="button" className="text-[#ab8986] hover:text-white">
              <span className="material-symbols-outlined text-base">more_horiz</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 flex flex-col gap-5 min-h-0">
            {/* Shared Music Shelf */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ef4444] text-sm">album</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Música Compartida (8)
                  </span>
                </div>
                <span className="text-[10px] text-[#ef4444] hover:underline cursor-pointer">
                  Ver todo
                </span>
              </div>

              {/* Mosaic */}
              <div className="grid grid-cols-3 gap-2">
                <div
                  onClick={() =>
                    playTrack({
                      title: 'Late Night Synth',
                      artist: 'Playlist compartida',
                    })
                  }
                  className="group relative rounded-xl overflow-hidden aspect-square bg-[#292a2e] shadow-md cursor-pointer"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8mKQbo56TJ0RQgXdq-7vcWjuSs-CytmtFiuaYvTvhOws1CNODm7WLJBkGjnw3el1xSqssyAagliofRCDJW7NSzfd-u5C1DFl8-F1dnVANdijQcGOCYtrzZrERw0Nwfyy11-nnJjSO8p0JGTstoxyM5PVZISZqv4tLwW6NQzh0jypBoSOESE7tDsFveyRg93V0kSYqHhFD0DbRmhOk0xokOx9OFEnU98j6Ojed9B_Bx7cdPJZLSgyd"
                    alt="Late Night Synth"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-1">
                    <span className="text-[9px] text-white font-bold truncate">Late Night</span>
                    <span className="text-[8px] text-[#ef4444]">Playlist</span>
                  </div>
                </div>

                <div
                  onClick={() =>
                    playTrack({
                      title: 'Overdrive Edit',
                      artist: 'Track compartido',
                    })
                  }
                  className="group relative rounded-xl overflow-hidden aspect-square bg-[#292a2e] shadow-md cursor-pointer"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2yWcnHW6PZAnMcpXYkDKPRluA4EEdE8RilVKCkBLsSV81X2sTMiTakYCOpzaXRh6zDhXPQoY-uYIKQ9gWPfvSOjsnc5sjU8WJRpPu3aNJfBTeAs4goW6-88S7hoTaWsnVErSGSabme07Ob6-kT_v3PgN1-dw0NAHpmCVFWKlfYHdCBogMp7MdkCj7aZjaKhw7UWMb_BMq0ig6ZHcJJxNWLB119ff0s_vz47RftuJgUT-M_1dMJpVO"
                    alt="Overdrive Edit"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-1">
                    <span className="text-[9px] text-white font-bold truncate">Overdrive</span>
                    <span className="text-[8px] text-[#ef4444]">Track</span>
                  </div>
                </div>

                <div
                  onClick={() =>
                    playTrack({
                      title: 'Cyber Horizon',
                      artist: 'Álbum compartido',
                    })
                  }
                  className="group relative rounded-xl overflow-hidden aspect-square bg-[#292a2e] shadow-md cursor-pointer"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOuJHGk2iSDN3bp8br06DX-yK1uK-kROXjqGamHUkqVuu9ksWL2lDpr7YqUjsp5245MAQ8lITualx5q7HgytHF6Ss-RJE-A1bDOqN5TAPeMuWfjZEHIJRSOhMDGYQ8KmozaLpgAHQwlaLWt5l14M_Ng4pZXETcsyjBBpLbZ4V7V6jMHi0xUvgF7Tb8Cab67szqN4JPNM1xqS7BREPLPMU9q1rQUxAKWBcAHcushF_CuwHEtbNjon-0"
                    alt="Cyber Horizon"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-1">
                    <span className="text-[9px] text-white font-bold truncate">Cyber Horizon</span>
                    <span className="text-[8px] text-[#ef4444]">Álbum</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Voice Notes */}
            <section className="flex flex-col gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Notas de Voz (5)
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="p-2 rounded-xl bg-[#292a2e]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <button className="w-6 h-6 rounded-full bg-[#ef4444]/20 text-[#ef4444] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-xs">play_arrow</span>
                    </button>
                    <div className="min-w-0">
                      <p className="text-white text-[11px] font-semibold truncate">
                        Idea lead sintetizador
                      </p>
                      <span className="text-[9px] text-[#ab8986]">Kiko • 0:34</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#ab8986]">14:26</span>
                </div>

                <div className="p-2 rounded-xl bg-[#292a2e]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <button className="w-6 h-6 rounded-full bg-[#343439] text-[#cbc3d7] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-xs">play_arrow</span>
                    </button>
                    <div className="min-w-0">
                      <p className="text-white text-[11px] font-semibold truncate">
                        Prueba compresión kick
                      </p>
                      <span className="text-[9px] text-[#ab8986]">Sara V. • 1:12</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#ab8986]">Ayer</span>
                </div>
              </div>
            </section>

            {/* Room Participants */}
            <section className="flex flex-col gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Amigos en esta sala (4)
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE5IL6tPijB15ndwuqQKXYAXn_-9Gtrez_Cm_Utx71jjEfqsgmaOs67KRmv3TqjIba5NiCxQjxZeZ9VQ9jPLXlz13yAH3VlmKVA2QlCO_k9UkCHG8CcIfUjGQ2GsxLwd8zPzs8S27UrYRhOLPwFwZx-FSu4O_f5V-u3e_Nv9uJLbHfki9yGmxpFvEEZ3grE78-mooOyMncYKPRMz8qgqLJs4Ap-D3Y_ghbnPkowS9d4s-mDJO_99OA"
                      alt="Sara V"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#ef4444]"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-xs truncate">Sara V.</p>
                      <span className="text-[9px] text-[#ef4444] truncate block">
                        🎧 Escuchando: Overdrive
                      </span>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-[9px] font-bold">
                    Host
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#891933] text-white flex items-center justify-center text-[10px] font-bold">
                      KN
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-xs truncate">Kiko N.</p>
                      <span className="text-[9px] text-[#ab8986]">En línea</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida/AEtjO1ULDa1U3TnIUarMOLZmH3v8gzp7seioVAjJwa4SG0GFB7U3DZB5JMsOhh9q2Urxl_k7oOJgypos-s5Afl_1ZJfKYM4XUN6YWbFE1rA6GBY6gbnGw_hRqjhAtCWs-COiXWPgs-cuMFXwgjtFGTeJuL1JfqROGx_x7hUG-M2mWvfKXr0_jp_ck6uymYGaF0U5WdL68VE5auVgA5IVsho_yUi2zdvAOSOPOVlsopfVSB-G_Rm3IhwlbcKqvcc"
                      alt="Tú"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#ef4444]"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-xs truncate">Kaelen Voss</p>
                      <span className="text-[9px] text-[#ef4444]">Sincronizado</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#ef4444] font-bold">Tú</span>
                </div>
              </div>
            </section>

            {/* Share link button */}
            <div className="pt-2">
              <button
                onClick={handleShareRoomLink}
                type="button"
                className="w-full py-2 px-3 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#e3e2e7] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#ef4444]">link</span>
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir enlace de sala'}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
