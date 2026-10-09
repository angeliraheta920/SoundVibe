/**
 * ============================================================================
 * YOUTUBE IFRAME PLAYER API INTEGRATION - SOUNDVIBE
 * Carpeta: /player/
 * Archivo: youtubePlayer.js
 * ============================================================================
 * Este módulo gestiona la carga asíncrona de la API oficial de YouTube IFrame,
 * el ciclo de vida del reproductor (onReady, onStateChange, onError), sincronización
 * con los controles del reproductor persistente de SoundVibe (play/pause, seek,
 * volumen, mute) y biblioteca curada de temas con soporte para URLs personalizadas.
 */

// Biblioteca curada de tracks con IDs reales de YouTube
export const YOUTUBE_TRACK_LIBRARY = {
  't-cybernetic': {
    videoId: 'p81lR_9L7K4', // Kiasmos - Looped
    title: 'Cybernetic Horizon (Looped)',
    artist: 'Kiasmos • Sonic Rituals [FLAC]',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC2drgAMhpuq2pbyTH6Pk6zv4Yjuh5pF16LSd6GtZ73xchmQENvZ9__z7xH_XKZjMSD_PWN8cA0bpBIvcAMM9AbMI0Cj171lmw0NHe-LxOmRne6ousrdmlPowidEcPjneP_9ab3-jXWIjgCMQeicg4bnkru4RJHcdl8RGjF2KgjHyF0XWn2VuAjondW3qs36hjtVRjJHrme78Sby5JlL8-RJd9rr75DixqlWwI_7v3RawfnYA6-MW5'
  },
  't-midnight': {
    videoId: 'MV_3Dpw-BRY', // Kavinsky - Nightcall
    title: 'Midnight Overdrive (VIP Mix)',
    artist: 'Kavinsky & Sofia Chen',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe-jrxSB7tfASqAcR5OG56NMWcB5HrVQKmTWtPGgAyBrCBWP8ArG_m_nW77brAn0gjKp7TcVLdQKiVWO8kAdv75AAdyDx5kbPyS-AzNsNXj7pzx45v9DWbzVNKU7JKMiQOb2eScQ12zGDnOHnz7BNOYiVMQyogccgTlZdUuz7XDUTuRUmeU3H_tEZWrrxr6fGWl9lJ1HfYoEXXxmB7X24aq06f11oSis_pHfiYXJOD4q5csFw5R2uY'
  },
  't-sunset': {
    videoId: 'rDBbaGCCIhk', // The Midnight - Sunset
    title: 'Sunset (Late Night Synthwave)',
    artist: 'The Midnight',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1sEPJJ53nDUFQI3_u5M-dTxggCUlwJ0X5i6lFgFgEgphJxyl701_9kkJdTdpfgQiJoO_2JOtxrOKMsNEQKKAROl7aSPy3py7goHFVfwCqKcvMclfleTB5fsvOowAy7Y4RPpm0VikXjfP7vu7SWevLmxK4ZXcEaUATpBSaFclaWgejw6aw7FZqBG60scTet3T2Lv6HMOEsPjAWb2i5ZrQEdhC1F-LTmvSyC1-Q0uM17FBA5NvKOqIo'
  },
  't-resonance': {
    videoId: '8GW6sLrK40k', // HOME - Resonance
    title: 'Resonance',
    artist: 'HOME • Odyssey [FLAC 24-bit]',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuN0Vozz608OXJO3B_eLSrMdVKw4O_dmI_JrjzNtIQ9ueI3MCiUb0JnqUVAizfL8jV3i_97wIlx45K4cBDZ43XRX-JaddjFnIGRpsjp0R3HtP71Ht5JF2BiblUIKkvKw-7XiQLjE54rN38_k3M6jVfYTxrIYk757C7k5iqjTv_GZ8TsuLCaOpz-D3WSVsEgHo73Z9po8OIL9dqZm9TngGsvhlGipkDMRCaqY3ZjKn3KUBgvhp57dyv'
  },
  't-glue': {
    videoId: 'spsX3K2Pnmg', // Bicep - Glue
    title: 'Glue (Extended Club Mix)',
    artist: 'Bicep',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauyVP2gTdwvbKk2bud93LZFDYO34aTIUNnoSy9m2UKCrlWZE8I2wqMLZ5vQUnZR0dSrWaIRYp7Gof2RizWzU73JoP19Sz0vuA_yiGcRtuFZHuUYxLBxLDokLt7GZxEveGNshmFS_jo1G_Vb66cqtoLgpQvDLctt3akitMCU0-r1YxKfxDpbjjoV2NMhrJmuQEnRSWhHpRt9mAyFVjAmeLEZJVw-HuhlXMNyCwC3C2lTTLRciSRffS'
  },
  't-hopkins': {
    videoId: 'bOzF-3n0u6I', // Jon Hopkins - Singularity
    title: 'Ritual Sonoro (Singularity)',
    artist: 'Jon Hopkins',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVYKE5gjkf-rxLoq_KeOm1iOfA79VLyN3ThBAiLxvWb1FS3siSx1JpcoLguqgAzX5gxwV7_oVD2jfd53Lp4vLi31qjHbZZM2g4pYNcziMOYYtqsfbvUwy68RWza8Pk4RDaWShYImCRBTVeZ9yf762pFlBjO4flfBc0OcbCRuAmGersYb0qHxiOgT9QS7a9v3mcIMzmurRkzz_0wy4G0hQZQv_3LhCJkLpXvZSfVJWL5inZyESjmuCA'
  },
  't-tycho': {
    videoId: 'z49xmhFLdLw', // Tycho - Awake
    title: 'Epoch / Awake',
    artist: 'Tycho',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1k4EuAGEXm6FJ3CKk4KuYOwaYWPie2-gQjwkC5WUe08oPWQFf5l3ifBUp0_PoAbYmtmg5EYPktojrB4tPxDvA4Wa9xzz716AY3oapXLBlftwbkPWox0DfqlFZHOIUxcDOzKKWITxMI-YQGqS_uCg3YfPRBrw3z-7bS_J9grJcBckScWSsdstpS_Uc2-hofSms4qrayya3MyEhCFs7_9VLJk1Vn2Ax2W7hFTVdil7sMclFwjD-yrS7'
  },
  't-synthradio': {
    videoId: '4xDzrJKXOOY', // Synthwave Radio Live Stream
    title: 'Synthwave Radio Chill & Retro Beats',
    artist: 'Lofi Girl / Synthwave Live',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlsWYBB4lFL2QTiJ9mRWLb70ZXRRBsdOjLqBq0BJnmWWpqlGF_8Ao9JtzG4U34AXaekvx7NkNuFZ6p1mv8FOj6PLj7rDZwhVTP1HM_yB-89KP3WzEnl5L9hwU0sDKcVNL82ZVmzfhLBvKelS-P2mgHjbal1Fr-lWzOCgwrkE0a91ulwhDYqDbMIKLvvK9O6N3CzYaWT8eesIQVP4EFRIJePUQNaERN_TeCdwyVY-oWhc5F7jExCNUL'
  }
};

class YouTubePlayerService {
  constructor() {
    this.ytPlayer = null;
    this.isReady = false;
    this.isPlaying = false;
    this.currentVideoId = '4xDzrJKXOOY'; // Stream de Synthwave verificado para reproducción embebida universal
    this.listeners = [];
    this.timeUpdateInterval = null;
  }

  /**
   * Carga dinámica de la API IFrame de YouTube
   */
  init(containerId = 'youtube-iframe-target') {
    return new Promise((resolve) => {
      const checkAndCreate = () => {
        if (window.YT && window.YT.Player) {
          this._createPlayerInstance(containerId, resolve);
          return true;
        }
        return false;
      };

      if (checkAndCreate()) return;

      // Si el script ya existe en el DOM, esperar a callback
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      const existingCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof existingCallback === 'function') existingCallback();
        checkAndCreate();
      };

      // Fallback poller en caso de que el script cargue antes del listener
      const poller = setInterval(() => {
        if (checkAndCreate()) {
          clearInterval(poller);
        }
      }, 100);

      // Limitar tiempo de espera
      setTimeout(() => clearInterval(poller), 10000);
    });
  }

  _createPlayerInstance(containerId, resolve) {
    if (this.ytPlayer) {
      resolve(this);
      return;
    }

    const targetEl = document.getElementById(containerId);
    if (!targetEl) {
      console.warn(`[YouTubePlayer] Contenedor #${containerId} no encontrado en el DOM.`);
      resolve(null);
      return;
    }

    try {
      this.ytPlayer = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
        videoId: this.currentVideoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          fs: 1,
          playsinline: 1,
          modestbranding: 1,
          enablejsapi: 1
        },
      events: {
        onReady: (event) => {
          this.isReady = true;
          this._startTimeTracker();
          this._emit('ready', event);
          resolve(this);
        },
        onStateChange: (event) => {
          // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
          if (event.data === window.YT.PlayerState.PLAYING) {
            this.isPlaying = true;
          } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
            this.isPlaying = false;
          }
          this._emit('stateChange', {
            state: event.data,
            isPlaying: this.isPlaying
          });
        },
        onError: (err) => {
          const code = err && err.data;
          console.warn('[YouTubePlayer] Aviso de reproducción:', code, 'en video:', this.currentVideoId);
          // Si el video tiene restricción de inserción en iframe (códigos 150 o 101) o no existe (100)
          if ((code === 150 || code === 101 || code === 100) && this.currentVideoId !== '4xDzrJKXOOY') {
            console.log('[YouTubePlayer] Cambiando a stream embeddable universal...');
            this.loadVideo('4xDzrJKXOOY');
          }
          this._emit('error', err);
        }
      }
    });
    } catch (e) {
      console.warn('[YouTubePlayer] Advertencia al instanciar YT.Player:', e);
      resolve(null);
    }
  }

  play() {
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
        this.isPlaying = true;
      } catch (e) {
        console.warn('Autoplay error', e);
      }
    }
  }

  pause() {
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      this.ytPlayer.pauseVideo();
      this.isPlaying = false;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  seek(seconds) {
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
      this.ytPlayer.seekTo(seconds, true);
    }
  }

  setVolume(vol) {
    // 0 - 100
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      this.ytPlayer.setVolume(vol);
      if (vol === 0) {
        this.ytPlayer.mute();
      } else if (this.ytPlayer.isMuted()) {
        this.ytPlayer.unMute();
      }
    }
  }

  toggleMute() {
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.isMuted === 'function') {
      if (this.ytPlayer.isMuted()) {
        this.ytPlayer.unMute();
        return false;
      } else {
        this.ytPlayer.mute();
        return true;
      }
    }
    return false;
  }

  loadVideo(videoId, startSeconds = 0) {
    this.currentVideoId = videoId;
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
      this.ytPlayer.loadVideoById({
        videoId: videoId,
        startSeconds: startSeconds
      });
      this.isPlaying = true;
    }
  }

  /**
   * Extrae el ID del video a partir de cualquier enlace estándar o corto de YouTube
   */
  extractVideoId(input) {
    if (!input) return null;
    const trimmed = input.trim();
    // Si ya es un ID de 11 caracteres alfanuméricos
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    // Patrones estándar: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = trimmed.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  /**
   * Busca videos reales de YouTube a través de la API backend (/api/youtube/search)
   */
  async searchVideos(query) {
    if (!query || !query.trim()) return [];
    try {
      const resp = await fetch(`/api/youtube/search?q=${encodeURIComponent(query.trim())}`);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          return data.results;
        }
      }
    } catch (e) {
      console.warn('[YouTubePlayer] Fallback de búsqueda:', e);
    }
    return [];
  }

  /**
   * Conecta la búsqueda directamente con YouTube IFrame Player y reproduce en vivo
   */
  async searchAndPlay(query) {
    if (!query) return null;
    const cleanQuery = query.trim();
    if (!cleanQuery) return null;

    // 1. Si es un ID de video o enlace directo de YouTube
    const extractedId = this.extractVideoId(cleanQuery);
    if (extractedId) {
      this.loadVideo(extractedId);
      return { type: 'video', id: extractedId, query: cleanQuery };
    }

    // 2. Buscar en la API de YouTube el video real
    try {
      const results = await this.searchVideos(cleanQuery);
      if (results && results.length > 0) {
        const topVideo = results[0];
        this.loadVideo(topVideo.videoId);
        return {
          type: 'video',
          id: topVideo.videoId,
          title: topVideo.title,
          author: topVideo.author,
          thumbnail: topVideo.thumbnail,
          query: cleanQuery
        };
      }
    } catch (e) {
      console.warn('[YouTubePlayer] Error en búsqueda de video:', e);
    }

    // 3. Si la API IFrame está lista, intentar loadPlaylist si está disponible
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.loadPlaylist === 'function') {
      try {
        this.ytPlayer.loadPlaylist({
          listType: 'search',
          list: cleanQuery,
          index: 0,
          startSeconds: 0
        });
        this.isPlaying = true;
        return { type: 'search', query: cleanQuery };
      } catch (e) {
        console.warn('[YouTubePlayer] Fallback loadPlaylist:', e);
      }
    }

    // 4. Fallback universal
    const fallbackId = this.currentVideoId || '4xDzrJKXOOY';
    this.loadVideo(fallbackId);
    return { type: 'fallback', id: fallbackId, query: cleanQuery };
  }

  /**
   * Consulta las sugerencias oficiales de búsqueda de YouTube en tiempo real mediante JSONP
   */
  fetchSuggestions(query) {
    return new Promise((resolve) => {
      if (!query || query.trim().length === 0) {
        resolve([]);
        return;
      }
      const callbackName = 'yt_suggest_' + Math.random().toString(36).substring(2, 9);
      const script = document.createElement('script');
      let resolved = false;

      window[callbackName] = (data) => {
        if (resolved) return;
        resolved = true;
        try {
          const suggestions = (data && data[1])
            ? data[1].map((item) => (Array.isArray(item) ? item[0] : item))
            : [];
          resolve(suggestions);
        } catch (e) {
          resolve([]);
        } finally {
          delete window[callbackName];
          if (script.parentNode) script.parentNode.removeChild(script);
        }
      };

      script.src = `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}&jsonp=${callbackName}`;
      script.onerror = () => {
        if (!resolved) {
          resolved = true;
          delete window[callbackName];
          if (script.parentNode) script.parentNode.removeChild(script);
          resolve([]);
        }
      };

      document.body.appendChild(script);

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          delete window[callbackName];
          if (script.parentNode) script.parentNode.removeChild(script);
          resolve([]);
        }
      }, 2500);
    });
  }

  getCurrentTime() {
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
      return Math.floor(this.ytPlayer.getCurrentTime() || 0);
    }
    return 0;
  }

  getDuration() {
    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.getDuration === 'function') {
      return Math.floor(this.ytPlayer.getDuration() || 0);
    }
    return 0;
  }

  _startTimeTracker() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);
    this.timeUpdateInterval = setInterval(() => {
      if (this.isPlaying) {
        const cur = this.getCurrentTime();
        const dur = this.getDuration();
        this._emit('timeUpdate', { currentTime: cur, duration: dur });
      }
    }, 1000);
  }

  on(eventName, callback) {
    this.listeners.push({ eventName, callback });
  }

  _emit(eventName, data) {
    this.listeners
      .filter((l) => l.eventName === eventName)
      .forEach((l) => l.callback(data));
  }
}

// Exportar instancia singleton
export const youtubePlayer = new YouTubePlayerService();
