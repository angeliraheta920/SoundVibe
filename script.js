/**
 * SOUNDVIBE — LÓGICA DE INTERACCIÓN, NAVEGACIÓN SPA Y MOTOR DE AUDIO
 * Integración con YouTube IFrame Player API desde la carpeta /player/
 */

import { youtubePlayer, YOUTUBE_TRACK_LIBRARY } from './player/youtubePlayer.js';
import { webAudioVisualizer } from './player/webAudioVisualizer.js';

// Estado global de la aplicación
const AppState = {
  currentView: 'inicio',
  isPlaying: false,
  isLiked: true,
  isMuted: false,
  currentTime: 134, // 02:14
  duration: 342,    // 05:42
  volume: 80,
  connectedRoom: 'Synthwave Night Live & Feedback Sessions',
  isHandRaised: false,
  isMicMuted: true,
  isSpatialAudio: true,
  isVideoMode: true,
  currentTrack: {
    title: 'Cybernetic Horizon (Looped)',
    artist: 'Kiasmos • Sonic Rituals [FLAC]',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC2drgAMhpuq2pbyTH6Pk6zv4Yjuh5pF16LSd6GtZ73xchmQENvZ9__z7xH_XKZjMSD_PWN8cA0bpBIvcAMM9AbMI0Cj171lmw0NHe-LxOmRne6ousrdmlPowidEcPjneP_9ab3-jXWIjgCMQeicg4bnkru4RJHcdl8RGjF2KgjHyF0XWn2VuAjondW3qs36hjtVRjJHrme78Sby5JlL8-RJd9rr75DixqlWwI_7v3RawfnYA6-MW5',
    videoId: '4xDzrJKXOOY'
  }
};

// Exponer AppState inmediatamente en window para evitar ReferenceError en eventos inline
window.AppState = AppState;

document.addEventListener('DOMContentLoaded', () => {
  initPlayerTicker();
  initGlobalEvents();
  renderWaveforms();
  initYouTubeIntegration();
  initGlobalSearch();
  initWebAudioVisualizerUI();
});

/* ==========================================================================
   VISUALIZADOR WEB AUDIO API EN EL REPRODUCTOR INFERIOR
   ========================================================================== */
function initWebAudioVisualizerUI() {
  const bpCanvas = document.getElementById('bottomPlayerVisualizerCanvas');
  if (bpCanvas) {
    webAudioVisualizer.registerCanvas(bpCanvas);
    bpCanvas.addEventListener('click', cycleBottomVisualizerMode);
  }

  const modalCanvas = document.getElementById('modalVisualizerCanvas');
  if (modalCanvas) {
    webAudioVisualizer.registerCanvas(modalCanvas);
  }

  webAudioVisualizer.setVolume(AppState.volume);

  // Muestreo reactivo de métricas de audio (volumen y bandas de frecuencias)
  setInterval(() => {
    const metrics = webAudioVisualizer.getMetrics();
    const volPill = document.getElementById('bpVisVolPill');
    if (volPill) {
      volPill.textContent = `VOL ${Math.round(metrics.volume * 100)}%`;
    }

    const bassPill = document.getElementById('bpVisBassPill');
    if (bassPill) {
      bassPill.textContent = `BASS ${Math.round(metrics.bass * 100)}%`;
      if (metrics.bass > 0.45) {
        bassPill.style.backgroundColor = 'rgba(239, 68, 68, 0.6)';
        bassPill.style.borderColor = '#ef4444';
      } else {
        bassPill.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
        bassPill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      }
    }

    // Modal metrics
    const modalBass = document.getElementById('modalBassMetric');
    if (modalBass) modalBass.textContent = `${Math.round(metrics.bass * 100)}%`;
    const modalMid = document.getElementById('modalMidMetric');
    if (modalMid) modalMid.textContent = `${Math.round(metrics.mid * 100)}%`;
    const modalTreble = document.getElementById('modalTrebleMetric');
    if (modalTreble) modalTreble.textContent = `${Math.round(metrics.treble * 100)}%`;
  }, 75);
}

function cycleBottomVisualizerMode() {
  const newMode = webAudioVisualizer.cycleMode();
  const iconEl = document.getElementById('bpVisModeIcon');
  const labelEl = document.getElementById('bpVisModeLabel');

  const modeData = {
    bars: { icon: 'equalizer', label: 'Barras EQ' },
    wave: { icon: 'graphic_eq', label: 'Onda Neón' },
    radial: { icon: 'radio_button_checked', label: 'Pulso 3D' },
    matrix: { icon: 'grid_view', label: 'Matriz LED' }
  };

  const current = modeData[newMode] || modeData.bars;
  if (iconEl) iconEl.textContent = current.icon;
  if (labelEl) labelEl.textContent = current.label;
}

/* ==========================================================================
   INTEGRACIÓN CON YOUTUBE IFRAME PLAYER API
   ========================================================================== */
function initYouTubeIntegration() {
  youtubePlayer.init('youtube-iframe-target').then(() => {
    console.log('[SoundVibe] YouTube IFrame Player API inicializado con éxito.');

    // Sincronizar tiempo y duración en tiempo real
    youtubePlayer.on('timeUpdate', ({ currentTime, duration }) => {
      AppState.currentTime = currentTime;
      if (duration > 0) {
        AppState.duration = duration;
      }
      updatePlayerUI();
    });

    // Sincronizar estado de reproducción (play/pause) con visualizador
    youtubePlayer.on('stateChange', ({ isPlaying }) => {
      AppState.isPlaying = isPlaying;
      updatePlayIcons(isPlaying);
      if (isPlaying) {
        webAudioVisualizer.startPlayback();
      } else {
        webAudioVisualizer.stopPlayback();
      }
    });
  });
}

function updatePlayIcons(isPlaying) {
  const playIcons = document.querySelectorAll('.main-play-icon');
  playIcons.forEach((icon) => {
    icon.textContent = isPlaying ? 'pause' : 'play_arrow';
  });
}

function loadCustomYouTubeVideo(e) {
  if (e) e.preventDefault();
  const inputEl = document.getElementById('customYoutubeUrlInput');
  if (!inputEl || !inputEl.value.trim()) return;

  const urlOrId = inputEl.value.trim();
  const videoId = youtubePlayer.extractVideoId(urlOrId);

  if (!videoId) {
    alert('No se pudo reconocer el ID o URL de YouTube. Introduce una URL válida como https://www.youtube.com/watch?v=... o un ID de 11 caracteres.');
    return;
  }

  const customTitle = `YouTube Audio (${videoId})`;
  const customArtist = 'YouTube Stream';

  playTrack(customTitle, customArtist, '', videoId);
  closeModal('youtubeInputModal');
  inputEl.value = '';
}

/* ==========================================================================
   NAVEGACIÓN SPA ENTRE PANTALLAS
   ========================================================================== */
function switchView(viewName) {
  AppState.currentView = viewName;

  // 1. Ocultar todas las secciones
  const sections = document.querySelectorAll('.view-section');
  sections.forEach((sec) => sec.classList.remove('active'));

  // 2. Mostrar la sección seleccionada
  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
  }

  // 3. Actualizar enlaces en sidebar de escritorio y navegación móvil
  const desktopBtns = document.querySelectorAll('.nav-link-btn');
  desktopBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
  });

  const mobBtns = document.querySelectorAll('.mob-nav-btn');
  mobBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
  });

  // Scroll arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   MOTOR DEL REPRODUCTOR PERSISTENTE
   ========================================================================== */
function initPlayerTicker() {
  setInterval(() => {
    // Si no está reproduciendo por YouTube, avanzar el contador local
    if (AppState.isPlaying && !youtubePlayer.isReady) {
      AppState.currentTime++;
      if (AppState.currentTime > AppState.duration) {
        AppState.currentTime = 0;
      }
      updatePlayerUI();
    }
  }, 1000);
}

function updatePlayerUI() {
  const curTimeEl = document.getElementById('currentTimeDisplay');
  const durTimeEl = document.getElementById('durationTimeDisplay');
  const fillEl = document.getElementById('playerScrubberFill');

  if (curTimeEl) curTimeEl.textContent = formatTime(AppState.currentTime);
  if (durTimeEl) durTimeEl.textContent = formatTime(AppState.duration);

  if (fillEl && AppState.duration > 0) {
    const percent = (AppState.currentTime / AppState.duration) * 100;
    fillEl.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function togglePlay() {
  if (youtubePlayer.isReady) {
    AppState.isPlaying = youtubePlayer.togglePlay();
  } else {
    AppState.isPlaying = !AppState.isPlaying;
  }
  updatePlayIcons(AppState.isPlaying);
  if (AppState.isPlaying) {
    webAudioVisualizer.startPlayback();
  } else {
    webAudioVisualizer.stopPlayback();
  }
}

function toggleLike() {
  AppState.isLiked = !AppState.isLiked;
  const likeBtns = document.querySelectorAll('.main-like-btn');
  likeBtns.forEach((btn) => {
    btn.style.color = AppState.isLiked ? '#ef4444' : '';
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.style.fontVariationSettings = AppState.isLiked ? "'FILL' 1" : "'FILL' 0";
    }
  });
}

function playTrack(title, artist, coverUrl = '', videoId = '') {
  AppState.currentTrack.title = title;
  AppState.currentTrack.artist = artist;
  if (coverUrl) AppState.currentTrack.cover = coverUrl;

  // Buscar si existe en la biblioteca curada de YouTube
  let targetVideoId = videoId;
  if (!targetVideoId) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('midnight') || lowerTitle.includes('kavinsky')) {
      targetVideoId = YOUTUBE_TRACK_LIBRARY['t-midnight'].videoId;
    } else if (lowerTitle.includes('sunset')) {
      targetVideoId = YOUTUBE_TRACK_LIBRARY['t-sunset'].videoId;
    } else if (lowerTitle.includes('resonance')) {
      targetVideoId = YOUTUBE_TRACK_LIBRARY['t-resonance'].videoId;
    } else if (lowerTitle.includes('glue') || lowerTitle.includes('bicep')) {
      targetVideoId = YOUTUBE_TRACK_LIBRARY['t-glue'].videoId;
    } else if (lowerTitle.includes('ritual') || lowerTitle.includes('hopkins')) {
      targetVideoId = YOUTUBE_TRACK_LIBRARY['t-hopkins'].videoId;
    } else if (lowerTitle.includes('tycho') || lowerTitle.includes('epoch')) {
      targetVideoId = YOUTUBE_TRACK_LIBRARY['t-tycho'].videoId;
    } else if (lowerTitle.includes('hardstyle') || lowerTitle.includes('synthwave')) {
      targetVideoId = YOUTUBE_TRACK_LIBRARY['t-synthradio'].videoId;
    } else {
      targetVideoId = AppState.currentTrack.videoId || '4xDzrJKXOOY';
    }
  }

  AppState.currentTrack.videoId = targetVideoId;
  AppState.currentTime = 0;
  AppState.isPlaying = true;
  updatePlayIcons(true);
  webAudioVisualizer.startPlayback();

  // Cargar en YouTube IFrame Player
  if (youtubePlayer.isReady) {
    if (videoId) {
      youtubePlayer.loadVideo(videoId);
    } else if (targetVideoId && targetVideoId !== '4xDzrJKXOOY') {
      youtubePlayer.loadVideo(targetVideoId);
    } else {
      youtubePlayer.searchAndPlay(`${title} ${artist}`);
    }
  }

  // 1. Actualizar Reproductor Persistente Inferior
  const titleEl = document.getElementById('currentTrackTitle');
  const artistEl = document.getElementById('currentTrackArtist');
  const coverEl = document.getElementById('currentTrackCover');

  if (titleEl) titleEl.textContent = title;
  if (artistEl) artistEl.textContent = artist;
  if (coverEl && coverUrl) coverEl.src = coverUrl;

  // 2. Actualizar Modal Inmersivo / Visualizador
  const visTitle = document.getElementById('visualizerTrackTitle');
  const visArtist = document.getElementById('visualizerTrackArtist');
  if (visTitle) visTitle.textContent = title;
  if (visArtist) visArtist.textContent = artist;

  // 3. Actualizar Dock Flotante de YouTube
  const ytDock = document.getElementById('youtube-player-dock');
  if (ytDock) ytDock.classList.remove('hidden');
  const ytDockName = document.getElementById('ytDockTrackName');
  if (ytDockName) ytDockName.textContent = title;

  const ytFeaturedTitle = document.getElementById('ytVideoCurrentTitle');
  if (ytFeaturedTitle) ytFeaturedTitle.textContent = title;

  // 4. Actualizar BANNER DE LIVE SESSION en el feed de Inicio
  const liveBannerTitle = document.getElementById('liveSessionBannerTitle');
  const liveBannerSub = document.getElementById('liveSessionBannerSubtitle');
  const liveBannerCover = document.getElementById('liveSessionBannerCover');

  if (liveBannerTitle) liveBannerTitle.textContent = title;
  if (liveBannerSub) liveBannerSub.textContent = `${artist} • En vivo con audio espacial 3D`;
  if (liveBannerCover && coverUrl) liveBannerCover.src = coverUrl;

  // 5. Actualizar Live Session en la barra lateral izquierda
  const sidebarLiveText = document.getElementById('sidebarLiveSessionText');
  if (sidebarLiveText) sidebarLiveText.textContent = `${title} • ${artist}`;

  // 6. Activar la Barra Dock de Conexión de Sala en Vivo
  const connDock = document.getElementById('connectionDock');
  const connTitle = document.getElementById('connectedRoomTitle');
  if (connDock) connDock.style.display = 'flex';
  if (connTitle) connTitle.textContent = `LIVE SESSION • ${title}`;

  updatePlayIcons(true);
  updatePlayerUI();
}

function toggleYouTubeDockVisibility(forceOpen = null) {
  const dock = document.getElementById('youtube-player-dock');
  if (!dock) return;
  if (forceOpen === true) {
    dock.classList.remove('hidden');
  } else if (forceOpen === false) {
    dock.classList.add('hidden');
  } else {
    dock.classList.toggle('hidden');
  }
}

function toggleYouTubeMiniPlayer() {
  const dock = document.getElementById('youtube-player-dock');
  if (!dock) return;
  dock.classList.toggle('expanded');
}

function selectCuratedYouTubeTrack(trackKey) {
  const item = YOUTUBE_TRACK_LIBRARY[trackKey];
  if (!item) return;
  playTrack(item.title, item.artist, item.cover, item.videoId);
  closeModal('youtubeInputModal');
  toggleYouTubeDockVisibility(true);
}

function skipTime(seconds) {
  const current = AppState.currentTime || 0;
  const dur = AppState.duration || 300;
  const target = Math.max(0, Math.min(dur, current + seconds));
  AppState.currentTime = target;
  if (youtubePlayer.isReady) {
    youtubePlayer.seek(target);
  }
  updatePlayerUI();
}

function seekFromScrubber(e) {
  const scrubber = e.currentTarget;
  const rect = scrubber.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const newSeconds = Math.floor(ratio * AppState.duration);
  AppState.currentTime = newSeconds;

  if (youtubePlayer.isReady) {
    youtubePlayer.seek(newSeconds);
  }
  updatePlayerUI();
}

function handleVolumeChange(e) {
  AppState.volume = Number(e.target.value);
  if (youtubePlayer.isReady) {
    youtubePlayer.setVolume(AppState.volume);
  }

  const volIcon = document.getElementById('volumeIcon');
  if (volIcon) {
    if (AppState.volume === 0) volIcon.textContent = 'volume_off';
    else if (AppState.volume < 50) volIcon.textContent = 'volume_down';
    else volIcon.textContent = 'volume_up';
  }
}

/* ==========================================================================
   VOICE ROOMS: INTERACCIÓN Y CONEXIÓN
   ========================================================================== */
function joinVoiceRoom(roomName) {
  AppState.connectedRoom = roomName;
  const dock = document.getElementById('connectionDock');
  const titleEl = document.getElementById('connectedRoomTitle');

  if (titleEl) titleEl.textContent = `CONECTADO • ${roomName}`;
  if (dock) dock.style.display = 'flex';

  playTrack(`Sesión en vivo: ${roomName}`, 'Audio Espacial 3D Activo');
}

function leaveVoiceRoom() {
  AppState.connectedRoom = null;
  const dock = document.getElementById('connectionDock');
  if (dock) dock.style.display = 'none';
  AppState.isHandRaised = false;
}

function toggleHandRaise() {
  AppState.isHandRaised = !AppState.isHandRaised;
  const btn = document.getElementById('btnHandRaise');
  if (btn) {
    btn.style.color = AppState.isHandRaised ? '#ef4444' : '';
  }
}

function toggleMicMute() {
  AppState.isMicMuted = !AppState.isMicMuted;
  const btn = document.getElementById('btnMicMute');
  if (btn) {
    btn.innerHTML = `
      <span class="material-symbols-outlined text-sm">${AppState.isMicMuted ? 'mic_off' : 'mic'}</span>
      <span>${AppState.isMicMuted ? 'Silenciado' : 'Hablando'}</span>
    `;
    btn.className = AppState.isMicMuted ? 'btn-secondary' : 'btn-primary';
  }
}

/* ==========================================================================
   MODALES
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

/* ==========================================================================
   CHAT EN TIEMPO REAL Y REACCIONES
   ========================================================================== */
function sendChatMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chatTextInput');
  if (!input || !input.value.trim()) return;

  const messagesContainer = document.getElementById('chatMessagesStream');
  if (!messagesContainer) return;

  const text = input.value.trim();
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble me';
  bubble.innerHTML = `
    <div style="font-size: 0.72rem; color: #fff; font-weight: 700; margin-bottom: 2px;">Tú • Ahora</div>
    <div>${text}</div>
  `;

  messagesContainer.appendChild(bubble);
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendVisualizerReaction(emoji) {
  const countEl = document.getElementById(`reaction-count-${emoji}`);
  if (countEl) {
    countEl.textContent = Number(countEl.textContent || 0) + 1;
  }
}

/* ==========================================================================
   FORMAS DE ONDA
   ========================================================================== */
function renderWaveforms() {
  const containers = document.querySelectorAll('.dynamic-waveform-bars');
  containers.forEach((box) => {
    box.innerHTML = '';
    const totalBars = 36;
    for (let i = 0; i < totalBars; i++) {
      const bar = document.createElement('div');
      bar.className = 'w-bar' + (i < 18 ? ' active' : '');
      bar.style.height = `${Math.sin(i * 0.4) * 14 + 14}px`;
      box.appendChild(bar);
    }
  });
}

function initGlobalEvents() {
  // Atajo de teclado Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal('youtubeInputModal');
    }
  });
}

/* ==========================================================================
   MOTOR DEL BUSCADOR DE MÚSICA (GLOBAL SEARCH ENGINE)
   ========================================================================== */
export const MUSIC_CATALOG = [
  {
    id: 't-cybernetic',
    title: 'Cybernetic Horizon (Looped)',
    artist: 'Kiasmos • Sonic Rituals',
    album: 'Sonic Rituals',
    genre: 'Synthwave / Ambient',
    duration: '05:42',
    videoId: '4xDzrJKXOOY',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC2drgAMhpuq2pbyTH6Pk6zv4Yjuh5pF16LSd6GtZ73xchmQENvZ9__z7xH_XKZjMSD_PWN8cA0bpBIvcAMM9AbMI0Cj171lmw0NHe-LxOmRne6ousrdmlPowidEcPjneP_9ab3-jXWIjgCMQeicg4bnkru4RJHcdl8RGjF2KgjHyF0XWn2VuAjondW3qs36hjtVRjJHrme78Sby5JlL8-RJd9rr75DixqlWwI_7v3RawfnYA6-MW5'
  },
  {
    id: 't-midnight',
    title: 'Midnight Overdrive (VIP Mix)',
    artist: 'Kavinsky & Sofia Chen',
    album: 'Drive Night Edition',
    genre: 'Synthwave / Retro Electro',
    duration: '04:18',
    videoId: 'MV_3Dpw-BRY',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe-jrxSB7tfASqAcR5OG56NMWcB5HrVQKmTWtPGgAyBrCBWP8ArG_m_nW77brAn0gjKp7TcVLdQKiVWO8kAdv75AAdyDx5kbPyS-AzNsNXj7pzx45v9DWbzVNKU7JKMiQOb2eScQ12zGDnOHnz7BNOYiVMQyogccgTlZdUuz7XDUTuRUmeU3H_tEZWrrxr6fGWl9lJ1HfYoEXXxmB7X24aq06f11oSis_pHfiYXJOD4q5csFw5R2uY'
  },
  {
    id: 't-sunset',
    title: 'Sunset (Late Night Synthwave)',
    artist: 'The Midnight',
    album: 'Endless Summer',
    genre: 'Synthwave / Retrowave',
    duration: '05:26',
    videoId: 'rDBbaGCCIhk',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1sEPJJ53nDUFQI3_u5M-dTxggCUlwJ0X5i6lFgFgEgphJxyl701_9kkJdTdpfgQiJoO_2JOtxrOKMsNEQKKAROl7aSPy3py7goHFVfwCqKcvMclfleTB5fsvOowAy7Y4RPpm0VikXjfP7vu7SWevLmxK4ZXcEaUATpBSaFclaWgejw6aw7FZqBG60scTet3T2Lv6HMOEsPjAWb2i5ZrQEdhC1F-LTmvSyC1-Q0uM17FBA5NvKOqIo'
  },
  {
    id: 't-resonance',
    title: 'Resonance',
    artist: 'HOME • Odyssey',
    album: 'Odyssey [Mastered]',
    genre: 'Chillwave / Synthwave',
    duration: '03:32',
    videoId: '8GW6sLrK40k',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuN0Vozz608OXJO3B_eLSrMdVKw4O_dmI_JrjzNtIQ9ueI3MCiUb0JnqUVAizfL8jV3i_97wIlx45K4cBDZ43XRX-JaddjFnIGRpsjp0R3HtP71Ht5JF2BiblUIKkvKw-7XiQLjE54rN38_k3M6jVfYTxrIYk757C7k5iqjTv_GZ8TsuLCaOpz-D3WSVsEgHo73Z9po8OIL9dqZm9TngGsvhlGipkDMRCaqY3ZjKn3KUBgvhp57dyv'
  },
  {
    id: 't-glue',
    title: 'Glue (Extended Club Mix)',
    artist: 'Bicep',
    album: 'Bicep LP',
    genre: 'Electronic / Breaks',
    duration: '04:29',
    videoId: 'spsX3K2Pnmg',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauyVP2gTdwvbKk2bud93LZFDYO34aTIUNnoSy9m2UKCrlWZE8I2wqMLZ5vQUnZR0dSrWaIRYp7Gof2RizWzU73JoP19Sz0vuA_yiGcRtuFZHuUYxLBxLDokLt7GZxEveGNshmFS_jo1G_Vb66cqtoLgpQvDLctt3akitMCU0-r1YxKfxDpbjjoV2NMhrJmuQEnRSWhHpRt9mAyFVjAmeLEZJVw-HuhlXMNyCwC3C2lTTLRciSRffS'
  },
  {
    id: 't-hopkins',
    title: 'Ritual Sonoro (Singularity)',
    artist: 'Jon Hopkins',
    album: 'Singularity LP',
    genre: 'Ambient / Techno',
    duration: '06:01',
    videoId: 'bOzF-3n0u6I',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVYKE5gjkf-rxLoq_KeOm1iOfA79VLyN3ThBAiLxvWb1FS3siSx1JpcoLguqgAzX5gxwV7_oVD2jfd53Lp4vLi31qjHbZZM2g4pYNcziMOYYtqsfbvUwy68RWza8Pk4RDaWShYImCRBTVeZ9yf762pFlBjO4flfBc0OcbCRuAmGersYb0qHxiOgT9QS7a9v3mcIMzmurRkzz_0wy4G0hQZQv_3LhCJkLpXvZSfVJWL5inZyESjmuCA'
  },
  {
    id: 't-tycho',
    title: 'Epoch / Awake',
    artist: 'Tycho',
    album: 'Awake / Epoch',
    genre: 'IDM / Post-Rock',
    duration: '04:43',
    videoId: 'z49xmhFLdLw',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1k4EuAGEXm6FJ3CKk4KuYOwaYWPie2-gQjwkC5WUe08oPWQFf5l3ifBUp0_PoAbYmtmg5EYPktojrB4tPxDvA4Wa9xzz716AY3oapXLBlftwbkPWox0DfqlFZHOIUxcDOzKKWITxMI-YQGqS_uCg3YfPRBrw3z-7bS_J9grJcBckScWSsdstpS_Uc2-hofSms4qrayya3MyEhCFs7_9VLJk1Vn2Ax2W7hFTVdil7sMclFwjD-yrS7'
  },
  {
    id: 't-synthradio',
    title: 'Synthwave Radio Chill & Retro Beats (24/7 Live)',
    artist: 'Lofi Girl / Synthwave Live',
    album: 'Live 24/7 Stream',
    genre: 'Lo-Fi / Synthwave',
    duration: 'EN VIVO',
    videoId: '4xDzrJKXOOY',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlsWYBB4lFL2QTiJ9mRWLb70ZXRRBsdOjLqBq0BJnmWWpqlGF_8Ao9JtzG4U34AXaekvx7NkNuFZ6p1mv8FOj6PLj7rDZwhVTP1HM_yB-89KP3WzEnl5L9hwU0sDKcVNL82ZVmzfhLBvKelS-P2mgHjbal1Fr-lWzOCgwrkE0a91ulwhDYqDbMIKLvvK9O6N3CzYaWT8eesIQVP4EFRIJePUQNaERN_TeCdwyVY-oWhc5F7jExCNUL'
  },
  {
    id: 't-crimson',
    title: 'Neon Waves LP',
    artist: 'Crimson Echoes',
    album: 'Semana 11 Exclusive',
    genre: 'Cyberpunk Synth',
    duration: '05:12',
    videoId: '4xDzrJKXOOY',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlsWYBB4lFL2QTiJ9mRWLb70ZXRRBsdOjLqBq0BJnmWWpqlGF_8Ao9JtzG4U34AXaekvx7NkNuFZ6p1mv8FOj6PLj7rDZwhVTP1HM_yB-89KP3WzEnl5L9hwU0sDKcVNL82ZVmzfhLBvKelS-P2mgHjbal1Fr-lWzOCgwrkE0a91ulwhDYqDbMIKLvvK9O6N3CzYaWT8eesIQVP4EFRIJePUQNaERN_TeCdwyVY-oWhc5F7jExCNUL'
  },
  {
    id: 't-afterlife',
    title: 'Afterlife Melodic Waves',
    artist: 'Anyma (con Mireia S.)',
    album: 'Afterlife Recordings',
    genre: 'Melodic Techno',
    duration: '04:55',
    videoId: '4xDzrJKXOOY',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDayojfI2TB_3ztBS3VSwa5SCt7GDtU98RDWZbtcx9kQYxqWea-zHgCg0PIyJ6f1XtWNLaPqqHWVRNZFDBGrdjJ8BDzwkzo5PPLBOGUM8dlppdEHT0npLiy1xShroHQznGXsMHAvGGYXjSLrbhS0Y7_-y-kPEvJ3pjoe5DptowjW4-GE1UBegDej4siDW3wthqmRBo5ojMbPO5tpH5WwYcYMD2eB1lg9N8xj7YMg8RgqJK1sbMhY1n3'
  }
];

let searchDebounceTimer = null;

function initGlobalSearch() {
  const input = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchResultsDropdown');
  const clearBtn = document.getElementById('searchClearBtn');

  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (clearBtn) clearBtn.style.display = query ? 'flex' : 'none';
    if (!query) {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
      return;
    }

    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      renderSearchResults(query);
    }, 180);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      renderSearchResults(input.value.trim());
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearGlobalSearch();
    } else if (e.key === 'Enter') {
      const val = input.value.trim();
      if (val) {
        playYouTubeSearch(val);
        clearGlobalSearch();
      }
    }
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('globalSearchWrapper');
    if (wrap && !wrap.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}

function clearGlobalSearch() {
  const input = document.getElementById('globalSearchInput');
  const dropdown = document.getElementById('searchResultsDropdown');
  const clearBtn = document.getElementById('searchClearBtn');
  if (input) input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  if (dropdown) {
    dropdown.classList.remove('open');
    dropdown.innerHTML = '';
  }
}

async function renderSearchResults(query) {
  const dropdown = document.getElementById('searchResultsDropdown');
  if (!dropdown) return;

  dropdown.classList.add('open');

  const q = query.toLowerCase();
  const localResults = MUSIC_CATALOG.filter((t) => {
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      (t.album && t.album.toLowerCase().includes(q))
    );
  });

  // Estado inicial de carga mientras la API de YouTube responde
  dropdown.innerHTML = `
    <div class="search-yt-direct-action" onclick="playYouTubeSearch('${escapeHtml(query)}'); clearGlobalSearch();">
      <div class="yt-badge-tag"><span class="material-symbols-outlined text-xs">smart_display</span> LIVE YT</div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.82rem; font-weight: 800; color: #fff;">Reproducir "${escapeHtml(query)}" en Live Session</div>
        <div style="font-size: 0.7rem; color: var(--text-dim);">Buscar en YouTube Live y sincronizar reproductor</div>
      </div>
      <span class="material-symbols-outlined text-xl" style="color: #ff0000;">play_circle</span>
    </div>
    <div style="padding: 14px 16px; font-size: 0.75rem; color: var(--text-dim); display: flex; align-items: center; gap: 8px;">
      <span class="material-symbols-outlined text-sm" style="color: #ff0000;">sync</span>
      <span>Buscando en YouTube Live...</span>
    </div>
  `;

  // Consultar en paralelo videos reales de YouTube y sugerencias
  let ytVideos = [];
  let ytSuggestions = [];
  try {
    const [videos, suggestions] = await Promise.all([
      youtubePlayer.searchVideos(query),
      youtubePlayer.fetchSuggestions(query)
    ]);
    ytVideos = videos || [];
    ytSuggestions = suggestions || [];
  } catch (err) {
    console.warn('[SoundVibe] Fallback en búsqueda de YouTube:', err);
  }

  let html = `
    <!-- Acción Principal: Buscar y reproducir en YouTube IFrame Player -->
    <div class="search-yt-direct-action" onclick="playYouTubeSearch('${escapeHtml(query)}'); clearGlobalSearch();">
      <div class="yt-badge-tag"><span class="material-symbols-outlined text-xs">smart_display</span> LIVE YT</div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.82rem; font-weight: 800; color: #fff;">Reproducir "${escapeHtml(query)}" en Live Session</div>
        <div style="font-size: 0.7rem; color: var(--text-dim);">Conectar con YouTube IFrame Player en vivo</div>
      </div>
      <span class="material-symbols-outlined text-xl" style="color: #ff0000;">play_circle</span>
    </div>

    <div class="search-dropdown-list no-scrollbar">
  `;

  // 1. SECCIÓN: Videos en Vivo de YouTube (Resultados Reales de YouTube API)
  if (ytVideos.length > 0) {
    html += `
      <div class="search-section-label" style="display: flex; align-items: center; justify-content: space-between;">
        <span>Videos de YouTube en Vivo</span>
        <span class="yt-live-tag"><span class="material-symbols-outlined text-xs">sensors</span> LIVE YT</span>
      </div>
    `;
    ytVideos.slice(0, 6).forEach((v) => {
      html += `
        <div class="yt-video-result-item" onclick="playYouTubeVideoItem('${escapeHtml(v.title)}', '${escapeHtml(v.author)}', '${v.thumbnail}', '${v.videoId}'); clearGlobalSearch();">
          <div class="yt-thumb-container">
            <img class="yt-thumb-img" src="${v.thumbnail}" alt="${escapeHtml(v.title)}" />
            <span class="yt-thumb-badge">${v.duration || 'LIVE'}</span>
          </div>
          <div class="search-item-info">
            <div class="search-item-title">${highlightMatch(v.title, query)}</div>
            <div class="search-item-artist">${highlightMatch(v.author, query)} • <span style="color: #ff0000; font-weight: 700;">YouTube</span></div>
          </div>
          <div class="search-play-hover-btn">
            <span class="material-symbols-outlined text-lg">play_arrow</span>
          </div>
        </div>
      `;
    });
  }

  // 2. SECCIÓN: Sugerencias de búsqueda de YouTube
  if (ytSuggestions.length > 0) {
    html += `<div class="search-section-label">Sugerencias de YouTube</div>`;
    ytSuggestions.slice(0, 4).forEach((item) => {
      html += `
        <div class="yt-suggestion-item" onclick="playYouTubeSearch('${escapeHtml(item)}'); clearGlobalSearch();">
          <div class="yt-suggestion-left">
            <span class="material-symbols-outlined text-xs" style="color: #ff0000;">search</span>
            <span class="yt-text">${highlightMatch(item, query)}</span>
          </div>
          <span class="material-symbols-outlined text-sm" style="color: var(--text-dim);">play_arrow</span>
        </div>
      `;
    });
  }

  // 3. SECCIÓN: Pistas del catálogo local SoundVibe
  if (localResults.length > 0) {
    html += `<div class="search-section-label">Pistas del Catálogo SoundVibe</div>`;
    localResults.slice(0, 4).forEach((track) => {
      html += `
        <div class="search-result-item" onclick="playTrack('${escapeHtml(track.title)}', '${escapeHtml(track.artist)}', '${track.cover}', '${track.videoId}'); clearGlobalSearch();">
          <img class="search-item-thumb" src="${track.cover}" alt="${escapeHtml(track.title)}" />
          <div class="search-item-info">
            <div class="search-item-title">${highlightMatch(track.title, query)}</div>
            <div class="search-item-artist">${highlightMatch(track.artist, query)} • <span style="color: var(--primary);">${track.genre}</span></div>
          </div>
          <span class="search-item-duration">${track.duration}</span>
          <div class="search-play-hover-btn">
            <span class="material-symbols-outlined text-lg">play_arrow</span>
          </div>
        </div>
      `;
    });
  }

  if (ytVideos.length === 0 && ytSuggestions.length === 0 && localResults.length === 0) {
    html += `
      <div class="search-empty-state">
        <span class="material-symbols-outlined text-3xl" style="color: var(--text-dim);">search_off</span>
        <div style="font-size: 0.85rem; color: #fff; font-weight: 700;">No encontramos coincidencias automáticas</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); max-width: 260px;">Presiona Enter o haz clic arriba para buscar en YouTube y reproducir en Live Session.</div>
      </div>
    `;
  }

  html += `
    </div>
    <div class="search-dropdown-footer">
      <button class="btn-secondary" style="font-size: 0.72rem; padding: 4px 10px; width: 100%;" onclick="openModal('youtubeInputModal'); clearGlobalSearch();">
        <span class="material-symbols-outlined text-xs" style="color: #ff0000;">add_link</span> Cargar URL personalizada o ID de YouTube
      </button>
    </div>
  `;

  dropdown.innerHTML = html;
}

function playYouTubeVideoItem(title, author, thumbnail, videoId) {
  playTrack(title, author, thumbnail, videoId);
  toggleYouTubeDockVisibility(true);
}

async function playYouTubeSearch(query) {
  if (!query) return;
  const trimmed = query.trim();
  if (!trimmed) return;

  // 1. Invocar búsqueda oficial de YouTube
  const result = await youtubePlayer.searchAndPlay(trimmed);

  // 2. Mostrar la ventana de video flotante
  toggleYouTubeDockVisibility(true);

  // 3. Activar y sincronizar en tu reproductor persistente y Live Session
  if (result && result.item) {
    playTrack(result.item.title, result.item.author, result.item.thumbnail, result.item.videoId);
  } else if (result && result.id) {
    const thumb = result.thumbnail || `https://i.ytimg.com/vi/${result.id}/hqdefault.jpg`;
    playTrack(result.title || trimmed, result.author || 'YouTube Live Session', thumb, result.id);
  } else {
    const defaultLiveCover = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlsWYBB4lFL2QTiJ9mRWLb70ZXRRBsdOjLqBq0BJnmWWpqlGF_8Ao9JtzG4U34AXaekvx7NkNuFZ6p1mv8FOj6PLj7rDZwhVTP1HM_yB-89KP3WzEnl5L9hwU0sDKcVNL82ZVmzfhLBvKelS-P2mgHjbal1Fr-lWzOCgwrkE0a91ulwhDYqDbMIKLvvK9O6N3CzYaWT8eesIQVP4EFRIJePUQNaERN_TeCdwyVY-oWhc5F7jExCNUL';
    playTrack(trimmed, 'YouTube Live Session', defaultLiveCover, '4xDzrJKXOOY');
  }
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Exponer funciones globales al objeto window para llamadas onclick en HTML
window.AppState = AppState;
window.updatePlayerUI = updatePlayerUI;
window.skipTime = skipTime;
window.switchView = switchView;
window.togglePlay = togglePlay;
window.toggleLike = toggleLike;
window.playTrack = playTrack;
window.seekFromScrubber = seekFromScrubber;
window.handleVolumeChange = handleVolumeChange;
window.joinVoiceRoom = joinVoiceRoom;
window.leaveVoiceRoom = leaveVoiceRoom;
window.toggleHandRaise = toggleHandRaise;
window.toggleMicMute = toggleMicMute;
window.openModal = openModal;
window.closeModal = closeModal;
window.sendChatMessage = sendChatMessage;
window.sendVisualizerReaction = sendVisualizerReaction;
window.loadCustomYouTubeVideo = loadCustomYouTubeVideo;
window.toggleYouTubeDockVisibility = toggleYouTubeDockVisibility;
window.toggleYouTubeMiniPlayer = toggleYouTubeMiniPlayer;
window.selectCuratedYouTubeTrack = selectCuratedYouTubeTrack;
window.clearGlobalSearch = clearGlobalSearch;
window.playYouTubeSearch = playYouTubeSearch;
window.playYouTubeVideoItem = playYouTubeVideoItem;
