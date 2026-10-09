import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ScreenView } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = usePlayer();

  const navItems: { id: ScreenView; label: string; icon: string; badge?: number }[] = [
    { id: 'inicio', label: 'Inicio', icon: 'feed' },
    { id: 'explorar', label: 'Explorar', icon: 'explore' },
    { id: 'voicerooms', label: 'Voice Rooms', icon: 'graphic_eq' },
    { id: 'biblioteca', label: 'Biblioteca', icon: 'library_music' },
    { id: 'chats', label: 'Chats', icon: 'chat', badge: 4 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0d0e12]/95 backdrop-blur-2xl z-40 lg:hidden flex items-center justify-around px-2 border-t border-[#ef4444]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 relative transition-all cursor-pointer ${
              isActive ? 'text-[#ef4444]' : 'text-[#cbc3d7] hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute top-0 right-2 px-1.5 py-0.2 rounded-full bg-[#ef4444] text-white text-[9px] font-bold shadow-sm">
                {item.badge}
              </span>
            )}
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444] mt-0.5"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
