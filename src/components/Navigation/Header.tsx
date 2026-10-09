import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const Header: React.FC = () => {
  const { setCurrentScreen } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 xl:right-72 right-0 h-16 bg-[#0d0e12]/85 backdrop-blur-2xl z-30 border-b border-[#ef4444]/15">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Mobile Brand Logo */}
        <div 
          onClick={() => setCurrentScreen('inicio')} 
          className="flex lg:hidden items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ef4444] to-[#f43f5e] flex items-center justify-center p-1 shadow-[0_0_12px_rgba(239,68,68,0.4)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 10v4" />
              <path d="M8 6v12" />
              <path d="M12 3v18" />
              <path d="M16 6v12" />
              <path d="M20 10v4" />
            </svg>
          </div>
          <span className="font-extrabold text-lg text-[#e3e2e7]">
            Sound<span className="text-[#ef4444]">Vibe</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ab8986] text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tracks, artistas, playlists o amigos..."
            className="w-full pl-10 pr-4 py-2 bg-[#1a1b20]/80 hover:bg-[#292a2e] focus:bg-[#343439] rounded-full text-[#e3e2e7] placeholder:text-[#ab8986] text-xs sm:text-sm transition-all outline-none focus:ring-1 focus:ring-[#ef4444] border border-transparent focus:border-[#ef4444]/40"
          />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Notifications button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-[#cbc3d7] hover:text-white hover:bg-[#292a2e] transition-colors relative cursor-pointer"
              title="Notificaciones"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444] animate-pulse shadow-[0_0_6px_#ef4444]"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 p-3 bg-[#1a1b20] border border-[#ef4444]/25 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                  <span className="text-xs font-bold text-white">Notificaciones (3 nuevas)</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-[#ef4444] font-semibold hover:underline"
                  >
                    Marcar leídas
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#292a2e]/60 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444] mt-1.5 flex-shrink-0"></span>
                    <div>
                      <p className="text-[#e3e2e7]"><strong>Valentina</strong> inició una sesión de Voice Room.</p>
                      <span className="text-[10px] text-[#958ea0]">Hace 5m</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#292a2e]/60 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f43f5e] mt-1.5 flex-shrink-0"></span>
                    <div>
                      <p className="text-[#e3e2e7]"><strong>Mateo Rivas</strong> te mencionó en una reseña sonora.</p>
                      <span className="text-[10px] text-[#958ea0]">Hace 22m</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="p-2 rounded-full text-[#cbc3d7] hover:text-white hover:bg-[#292a2e] transition-colors hidden sm:flex cursor-pointer"
            title="Añadir amigos"
            onClick={() => setCurrentScreen('chats')}
          >
            <span className="material-symbols-outlined text-xl">group_add</span>
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => setCurrentScreen('biblioteca')}
            className="flex items-center gap-2 pl-1 sm:pl-2 cursor-pointer group"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1ULDa1U3TnIUarMOLZmH3v8gzp7seioVAjJwa4SG0GFB7U3DZB5JMsOhh9q2Urxl_k7oOJgypos-s5Afl_1ZJfKYM4XUN6YWbFE1rA6GBY6gbnGw_hRqjhAtCWs-COiXWPgs-cuMFXwgjtFGTeJuL1JfqROGx_x7hUG-M2mWvfKXr0_jp_ck6uymYGaF0U5WdL68VE5auVgA5IVsho_yUi2zdvAOSOPOVlsopfVSB-G_Rm3IhwlbcKqvcc"
              alt="Kaelen Voss Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ef4444]/60 group-hover:ring-[#ef4444] transition-all shadow-[0_0_12px_rgba(239,68,68,0.35)]"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#e3e2e7] leading-tight group-hover:text-white">
                Kaelen Voss
              </span>
              <span className="text-[9px] font-mono text-[#ef4444] font-bold tracking-wider">
                PRO CREATOR
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
