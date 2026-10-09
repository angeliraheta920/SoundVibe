import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { FRIENDS_LISTENING } from '../../data/mockData';

export const RightSidebar: React.FC = () => {
  const { playTrack, setShowGroupSessionModal } = usePlayer();

  return (
    <aside className="fixed right-0 top-0 bottom-24 w-72 bg-[#0d0e12]/85 backdrop-blur-2xl z-40 hidden xl:flex flex-col p-4 border-l border-[#ef4444]/15">
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ef4444] text-lg">headphones</span>
          <span className="text-sm font-bold text-[#e3e2e7]">Amigos Escuchando</span>
        </div>
        <button 
          type="button" 
          className="p-1.5 rounded-full text-[#cbc3d7] hover:text-white hover:bg-[#292a2e] transition-colors"
          title="Filtros de amigos"
        >
          <span className="material-symbols-outlined text-base">tune</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar">
        {FRIENDS_LISTENING.map((friend) => (
          <div
            key={friend.id}
            onClick={() => {
              playTrack({
                title: friend.trackTitle,
                artist: friend.artistName,
              });
            }}
            className="group flex items-center gap-3 p-2.5 rounded-xl bg-[#1a1b20]/50 hover:bg-[#292a2e] transition-all cursor-pointer border border-transparent hover:border-[#ef4444]/25"
          >
            <div className="relative flex-shrink-0">
              {friend.avatarUrl ? (
                <img
                  src={friend.avatarUrl}
                  alt={friend.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-[#ef4444]/40"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center text-xs font-bold text-[#ef4444]">
                  {friend.initials}
                </div>
              )}
              {friend.isLive ? (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#ef4444] ring-2 ring-[#0d0e12] animate-pulse"></span>
              ) : (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#f43f5e] ring-2 ring-[#0d0e12]"></span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#e3e2e7] truncate group-hover:text-[#ef4444] transition-colors">
                  {friend.name}
                </span>
                {friend.isLive ? (
                  <span className="text-[10px] text-[#ef4444] font-extrabold tracking-wider">LIVE</span>
                ) : (
                  <span className="text-[10px] text-[#958ea0]">{friend.statusTime}</span>
                )}
              </div>
              <p className="text-[11px] text-[#cbc3d7] truncate">{friend.trackTitle}</p>
              <span className="text-[10px] text-[#958ea0] truncate block">{friend.artistName}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/5">
        <button
          onClick={() => setShowGroupSessionModal(true)}
          type="button"
          className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_18px_rgba(239,68,68,0.35)] cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined text-sm text-white">sensors</span>
          <span>Iniciar Sesión Grupal</span>
        </button>
      </div>
    </aside>
  );
};
