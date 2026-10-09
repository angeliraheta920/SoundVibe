import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { FRIENDS_LISTENING } from '../../data/mockData';

export const GroupSessionModal: React.FC = () => {
  const { showGroupSessionModal, setShowGroupSessionModal, currentTrack } = usePlayer();
  const [selectedFriends, setSelectedFriends] = useState<string[]>(['fl-1', 'fl-3']);
  const [isCopied, setIsCopied] = useState(false);

  if (!showGroupSessionModal) return null;

  const toggleSelectFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const copyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#1a1b20] border border-[#ef4444]/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-2xl">sensors</span>
            <h2 className="text-lg font-bold text-white">Iniciar Sesión Grupal</h2>
          </div>
          <button
            onClick={() => setShowGroupSessionModal(false)}
            className="w-8 h-8 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Current Track Preview */}
        <div className="p-3 rounded-2xl bg-[#0d0e12] border border-[#ef4444]/20 flex items-center gap-3">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono text-[#ef4444] font-bold">PISTA EN SINCRONIZACIÓN</span>
            <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
            <span className="text-xs text-[#958ea0] truncate block">{currentTrack.artist}</span>
          </div>
        </div>

        {/* Friends Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#e3e2e7]">Invitar amigos de tu círculo:</label>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
            {FRIENDS_LISTENING.map((f) => {
              const isSelected = selectedFriends.includes(f.id);
              return (
                <div
                  key={f.id}
                  onClick={() => toggleSelectFriend(f.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'bg-[#ef4444]/15 border border-[#ef4444]/40' : 'bg-[#292a2e]/50 hover:bg-[#292a2e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {f.avatarUrl ? (
                      <img src={f.avatarUrl} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-xs font-bold flex items-center justify-center">
                        {f.initials}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block">{f.name}</span>
                      <span className="text-[10px] text-[#958ea0]">
                        {f.isLive ? 'En vivo ahora' : 'En línea'}
                      </span>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-[#ef4444]' : 'text-[#958ea0]'}`}>
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={copyLink}
            type="button"
            className="flex-1 py-2.5 px-4 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#e3e2e7] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">link</span>
            <span>{isCopied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
          </button>
          <button
            onClick={() => setShowGroupSessionModal(false)}
            type="button"
            className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold shadow-[0_0_18px_rgba(239,68,68,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            <span>Comenzar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
