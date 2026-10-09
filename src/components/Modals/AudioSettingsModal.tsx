import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const AudioSettingsModal: React.FC = () => {
  const { showAudioSettingsModal, setShowAudioSettingsModal, isSpatialAudio, toggleSpatialAudio } = usePlayer();
  const [bitrate, setBitrate] = useState<'320' | 'flac' | '96k'>('320');
  const [latencyMode, setLatencyMode] = useState<'ultra' | 'balanced'>('ultra');
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [bassBoost, setBassBoost] = useState(65);

  if (!showAudioSettingsModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#1a1b20] border border-[#ef4444]/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-2xl">spatial_audio</span>
            <h2 className="text-lg font-bold text-white">Ajustes de Audio 3D</h2>
          </div>
          <button
            onClick={() => setShowAudioSettingsModal(false)}
            className="w-8 h-8 rounded-full bg-[#292a2e] hover:bg-[#343439] text-[#cbc3d7] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Spatial Audio Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0d0e12] border border-[#ef4444]/20">
          <div>
            <span className="text-sm font-bold text-white block">Audio Espacial Binaural</span>
            <span className="text-xs text-[#958ea0]">Renderizado 3D de sala y posición de oradores</span>
          </div>
          <button
            onClick={toggleSpatialAudio}
            type="button"
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              isSpatialAudio ? 'bg-[#ef4444]' : 'bg-[#292a2e]'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                isSpatialAudio ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Bitrate Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#e3e2e7]">Calidad de Transmisión:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setBitrate('320')}
              type="button"
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                bitrate === '320'
                  ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'bg-[#292a2e] text-[#cbc3d7] hover:bg-[#343439]'
              }`}
            >
              320 Kbps HQ
            </button>
            <button
              onClick={() => setBitrate('flac')}
              type="button"
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                bitrate === 'flac'
                  ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'bg-[#292a2e] text-[#cbc3d7] hover:bg-[#343439]'
              }`}
            >
              FLAC 24-bit
            </button>
            <button
              onClick={() => setBitrate('96k')}
              type="button"
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                bitrate === '96k'
                  ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'bg-[#292a2e] text-[#cbc3d7] hover:bg-[#343439]'
              }`}
            >
              96kHz Studio
            </button>
          </div>
        </div>

        {/* Latency Mode */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#e3e2e7]">Latencia de Voz:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setLatencyMode('ultra')}
              type="button"
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold ${
                latencyMode === 'ultra' ? 'bg-[#ef4444]/20 border border-[#ef4444] text-white' : 'bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              Ultra Baja (18ms)
            </button>
            <button
              onClick={() => setLatencyMode('balanced')}
              type="button"
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold ${
                latencyMode === 'balanced' ? 'bg-[#ef4444]/20 border border-[#ef4444] text-white' : 'bg-[#292a2e] text-[#cbc3d7]'
              }`}
            >
              Buffer Balanceado (40ms)
            </button>
          </div>
        </div>

        {/* Bass / Sub-harmonic slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-[#e3e2e7]">Sub-armónicos de Bajo (32Hz):</span>
            <span className="font-mono text-[#ef4444] font-bold">{bassBoost}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={bassBoost}
            onChange={(e) => setBassBoost(Number(e.target.value))}
            className="w-full accent-[#ef4444] cursor-pointer"
          />
        </div>

        {/* Noise reduction toggle */}
        <div className="flex items-center justify-between p-2">
          <span className="text-xs text-[#cbc3d7]">Cancelación de ruido en micrófono (IA)</span>
          <input
            type="checkbox"
            checked={noiseReduction}
            onChange={(e) => setNoiseReduction(e.target.checked)}
            className="w-4 h-4 accent-[#ef4444] cursor-pointer"
          />
        </div>

        <button
          onClick={() => setShowAudioSettingsModal(false)}
          type="button"
          className="w-full py-2.5 px-4 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold transition-all shadow-[0_0_16px_rgba(239,68,68,0.4)] cursor-pointer mt-2"
        >
          Guardar Ajustes
        </button>
      </div>
    </div>
  );
};
