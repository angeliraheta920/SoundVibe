import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const CreateVoiceRoomModal: React.FC = () => {
  const { showCreateRoomModal, setShowCreateRoomModal, joinVoiceRoom } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'dj' | 'debates' | 'parties'>('dj');

  if (!showCreateRoomModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    joinVoiceRoom(`vr-${Date.now()}`, title);
    setShowCreateRoomModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-[#1a1b20] border border-[#ef4444]/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-2xl">mic</span>
            <h2 className="text-lg font-bold text-white">Crear Nueva Voice Room</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateRoomModal(false)}
            className="w-8 h-8 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-[#e3e2e7] block mb-1">Nombre de la Sala</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ej. Sesión Nocturna de Sintetizadores Analógicos"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0e12] border border-[#ef4444]/20 text-white placeholder:text-[#ab8986] text-xs outline-none focus:ring-1 focus:ring-[#ef4444]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#e3e2e7] block mb-1">Descripción & Temática</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explica de qué trata la sala o qué tracks se van a escuchar..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0e12] border border-[#ef4444]/20 text-white placeholder:text-[#ab8986] text-xs outline-none focus:ring-1 focus:ring-[#ef4444]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#e3e2e7] block mb-1">Categoría</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setCategory('dj')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                category === 'dj' ? 'bg-[#ef4444] text-white shadow-sm' : 'bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              Sesión DJ
            </button>
            <button
              type="button"
              onClick={() => setCategory('debates')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                category === 'debates' ? 'bg-[#ef4444] text-white shadow-sm' : 'bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              Debate Álbum
            </button>
            <button
              type="button"
              onClick={() => setCategory('parties')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                category === 'parties' ? 'bg-[#ef4444] text-white shadow-sm' : 'bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              Listening Party
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white text-xs font-bold transition-all shadow-[0_0_18px_rgba(239,68,68,0.4)] cursor-pointer mt-2"
        >
          Lanzar Sala en Directo
        </button>
      </form>
    </div>
  );
};
