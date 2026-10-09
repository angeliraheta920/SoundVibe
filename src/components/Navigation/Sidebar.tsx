import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ScreenView } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, joinVoiceRoom } = usePlayer();

  const navItems: { id: ScreenView; label: string; icon: string; badge?: number }[] = [
    { id: 'inicio', label: 'Inicio', icon: 'feed' },
    { id: 'explorar', label: 'Explorar', icon: 'explore' },
    { id: 'voicerooms', label: 'Voice Rooms', icon: 'graphic_eq' },
    { id: 'biblioteca', label: 'Biblioteca', icon: 'library_music' },
    { id: 'chats', label: 'Chats', icon: 'chat', badge: 4 },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-24 w-64 bg-[#0d0e12]/85 backdrop-blur-2xl z-40 hidden lg:flex flex-col justify-between p-4 border-r border-[#ef4444]/15">
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentScreen('inicio')} 
          className="flex items-center gap-2.5 px-2 cursor-pointer group"
        >
          {/* SoundVibe Logo SVG matching image 14 */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ef4444] to-[#f43f5e] flex items-center justify-center p-1.5 shadow-[0_0_16px_rgba(239,68,68,0.5)] group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 10v4" />
              <path d="M8 6v12" />
              <path d="M12 3v18" />
              <path d="M16 6v12" />
              <path d="M20 10v4" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#e3e2e7]">
            Sound<span className="text-[#ef4444] font-black">Vibe</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-full font-medium text-sm transition-all text-left ${
                  isActive
                    ? 'bg-[#dc2626] text-white font-semibold shadow-[0_0_20px_rgba(239,68,68,0.45)]'
                    : 'text-[#cbc3d7] hover:bg-[#292a2e] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-black/30 text-white' : 'bg-[#dc2626] text-white shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Live Session Promo Box */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#1a1b20]/70 backdrop-blur-xl border border-[#ef4444]/25 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#ef4444] font-bold uppercase tracking-wider">
            Live Session
          </span>
          <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse shadow-[0_0_8px_#f43f5e]"></span>
        </div>
        <p className="text-xs text-[#cbc3d7] line-clamp-2">
          Club Resonance with DJ Aura streaming now
        </p>
        <button
          onClick={() => {
            joinVoiceRoom('vr-featured', 'Synthwave Night Live & Feedback');
            setCurrentScreen('voicerooms');
          }}
          type="button"
          className="w-full py-1.5 px-3 rounded-full bg-[#292a2e] hover:bg-[#343439] hover:text-[#ef4444] text-[#e3e2e7] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm text-[#ef4444]">podcasts</span>
          <span>Unirse</span>
        </button>
      </div>
    </aside>
  );
};
