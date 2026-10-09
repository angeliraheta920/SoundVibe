/**
 * Web Audio API Audio Visualization Library for SoundVibe
 * Provides real-time frequency analysis, volume extraction, and canvas visualizers.
 */

export type VisualizerMode = 'bars' | 'wave' | 'radial' | 'matrix';

export interface AudioMetrics {
  volume: number; // 0.0 to 1.0 (RMS amplitude)
  bass: number;   // 0.0 to 1.0 (20Hz - 250Hz)
  mid: number;    // 0.0 to 1.0 (250Hz - 4kHz)
  treble: number; // 0.0 to 1.0 (4kHz - 16kHz)
  peak: number;   // 0.0 to 1.0
  isPlaying: boolean;
}

export interface VisualizerTheme {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  peakColor: string;
}

export const VISUALIZER_THEMES: Record<string, VisualizerTheme> = {
  crimson: {
    primary: '#ef4444',
    secondary: '#f43f5e',
    accent: '#fb7185',
    glow: 'rgba(239, 68, 68, 0.45)',
    peakColor: '#ffffff',
  },
  neonViolet: {
    primary: '#a855f7',
    secondary: '#ec4899',
    accent: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.45)',
    peakColor: '#fdf4ff',
  },
  cyanPulse: {
    primary: '#06b6d4',
    secondary: '#3b82f6',
    accent: '#67e8f9',
    glow: 'rgba(6, 182, 212, 0.45)',
    peakColor: '#ffffff',
  },
};

export class AudioVisualizerEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Synthesis nodes for active playback frequency simulation
  private oscSubBass: OscillatorNode | null = null;
  private oscMid: OscillatorNode | null = null;
  private oscTreble: OscillatorNode | null = null;
  private synthGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  private isRunning: boolean = false;
  private currentVolume: number = 0.8;
  private isMuted: boolean = false;
  private currentBpm: number = 126;

  // Frequency and time-domain data buffers
  private freqData: Uint8Array<ArrayBuffer> = new Uint8Array(128);
  private timeData: Uint8Array<ArrayBuffer> = new Uint8Array(128);
  private peakCaps: number[] = new Array(64).fill(0);

  // Animation frame ID
  private animFrameId: number | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private currentMode: VisualizerMode = 'bars';
  private currentTheme: VisualizerTheme = VISUALIZER_THEMES.crimson;

  // Smoothing buffers for visual realism
  private smoothedVolume: number = 0;
  private smoothedBass: number = 0;
  private smoothedMid: number = 0;
  private smoothedTreble: number = 0;

  constructor() {
    // Lazy initialize on first interaction
  }

  private initAudioContext(): boolean {
    if (this.audioCtx) return true;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('[AudioVisualizer] Web Audio API no está soportada en este navegador.');
        return false;
      }

      this.audioCtx = new AudioContextClass();

      // Analyser Node setup
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256; // 128 bins
      this.analyser.smoothingTimeConstant = 0.82;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      // Master Gain Node for volume control
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.audioCtx.currentTime);

      // Low output gain to destination (keeps audio comfortable/ambient while feeding analyser full energy)
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime); // Inaudible or gentle background tone to prevent clash with YouTube

      // Buffers
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeData = new Uint8Array(this.analyser.fftSize);

      return true;
    } catch (err) {
      console.warn('[AudioVisualizer] Error al inicializar AudioContext:', err);
      return false;
    }
  }

  /**
   * Resumes or starts the Web Audio engine
   */
  public async resume(): Promise<void> {
    if (!this.initAudioContext()) return;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (e) {
        console.warn('[AudioVisualizer] No se pudo reanudar AudioContext:', e);
      }
    }
  }

  /**
   * Connects an HTML audio element directly to the Web Audio analyser
   */
  public connectMediaElement(element: HTMLMediaElement): void {
    if (!this.initAudioContext() || !this.audioCtx || !this.analyser || !this.gainNode) return;
    try {
      const source = this.audioCtx.createMediaElementSource(element);
      source.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn('[AudioVisualizer] Error conectando MediaElementSource:', e);
    }
  }

  /**
   * Starts synthesizing real musical audio frequencies synced with playback state & BPM
   */
  public startPlayback(trackBpm: number = 126): void {
    this.currentBpm = trackBpm;
    this.isRunning = true;
    this.resume();

    if (!this.initAudioContext() || !this.audioCtx || !this.analyser || !this.gainNode) return;

    this.stopSynthesizer();

    try {
      const now = this.audioCtx.currentTime;

      // Sub-bass frequency oscillator (Kick / Bassline)
      this.oscSubBass = this.audioCtx.createOscillator();
      this.oscSubBass.type = 'sine';
      this.oscSubBass.frequency.setValueAtTime(55, now); // A1 note (55 Hz)

      // Melodic mid frequency oscillator
      this.oscMid = this.audioCtx.createOscillator();
      this.oscMid.type = 'triangle';
      this.oscMid.frequency.setValueAtTime(220, now); // A3 note (220 Hz)

      // Treble shimmer oscillator
      this.oscTreble = this.audioCtx.createOscillator();
      this.oscTreble.type = 'sawtooth';
      this.oscTreble.frequency.setValueAtTime(880, now); // A5 note (880 Hz)

      // Lowpass Filter for warmth
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(3200, now);
      this.filterNode.Q.setValueAtTime(3, now);

      // Synth Gain
      this.synthGain = this.audioCtx.createGain();
      const effectiveVol = this.isMuted ? 0 : this.currentVolume;
      this.synthGain.gain.setValueAtTime(effectiveVol * 0.7, now);

      // Connect graph: Oscillators -> Filter -> SynthGain -> GainNode -> Analyser -> MasterGain -> Destination
      this.oscSubBass.connect(this.synthGain);
      this.oscMid.connect(this.filterNode);
      this.filterNode.connect(this.synthGain);
      this.oscTreble.connect(this.filterNode);

      this.synthGain.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      if (this.masterGain) {
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
      }

      this.oscSubBass.start(now);
      this.oscMid.start(now);
      this.oscTreble.start(now);

      // Modulate frequencies periodically to mimic song dynamics (kick, snare, melody)
      this.startFrequencyModulation();
    } catch (err) {
      console.warn('[AudioVisualizer] Error arrancando sintetizador:', err);
    }
  }

  private modInterval: number | null = null;
  private startFrequencyModulation(): void {
    if (this.modInterval) clearInterval(this.modInterval);
    const stepMs = Math.round((60000 / (this.currentBpm || 120)) / 2); // 8th notes

    let step = 0;
    this.modInterval = window.setInterval(() => {
      if (!this.isRunning || !this.audioCtx || !this.oscSubBass || !this.oscMid || !this.filterNode) {
        return;
      }
      try {
        const t = this.audioCtx.currentTime;
        step = (step + 1) % 16;

        // Sub bass kick on 1, 5, 9, 13
        if (step % 4 === 0) {
          this.oscSubBass.frequency.cancelScheduledValues(t);
          this.oscSubBass.frequency.setValueAtTime(110, t);
          this.oscSubBass.frequency.exponentialRampToValueAtTime(45, t + 0.18);
        }

        // Chords / Melody shifts
        const chordNotes = [220, 261.63, 329.63, 392, 440, 329.63, 261.63, 196];
        const nextFreq = chordNotes[step % chordNotes.length];
        this.oscMid.frequency.setTargetAtTime(nextFreq, t, 0.08);

        // Filter sweeps
        const filterCutoff = 1500 + Math.sin(step * 0.7) * 1200;
        this.filterNode.frequency.setTargetAtTime(filterCutoff, t, 0.1);
      } catch {
        // audio context might be transitioning
      }
    }, stepMs);
  }

  public stopPlayback(): void {
    this.isRunning = false;
    if (this.modInterval) {
      clearInterval(this.modInterval);
      this.modInterval = null;
    }
    this.stopSynthesizer();
  }

  private stopSynthesizer(): void {
    try {
      if (this.oscSubBass) {
        this.oscSubBass.stop();
        this.oscSubBass.disconnect();
        this.oscSubBass = null;
      }
      if (this.oscMid) {
        this.oscMid.stop();
        this.oscMid.disconnect();
        this.oscMid = null;
      }
      if (this.oscTreble) {
        this.oscTreble.stop();
        this.oscTreble.disconnect();
        this.oscTreble = null;
      }
    } catch {
      // already stopped
    }
  }

  /**
   * Updates master playback volume (0 to 100)
   */
  public setVolume(val: number): void {
    this.currentVolume = Math.max(0, Math.min(100, val)) / 100;
    this.updateGain();
  }

  /**
   * Sets mute state
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.updateGain();
  }

  private updateGain(): void {
    if (!this.gainNode || !this.audioCtx) return;
    const targetGain = this.isMuted ? 0 : this.currentVolume;
    try {
      this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.gainNode.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.05);
    } catch {
      this.gainNode.gain.value = targetGain;
    }
  }

  /**
   * Extracts real-time audio statistics (Volume, Bass, Mid, Treble, Peak)
   */
  public getMetrics(): AudioMetrics {
    if (!this.analyser || !this.isRunning || this.isMuted || this.currentVolume === 0) {
      // Smooth decay down to zero
      this.smoothedVolume *= 0.85;
      this.smoothedBass *= 0.85;
      this.smoothedMid *= 0.85;
      this.smoothedTreble *= 0.85;
      return {
        volume: Number(this.smoothedVolume.toFixed(3)),
        bass: Number(this.smoothedBass.toFixed(3)),
        mid: Number(this.smoothedMid.toFixed(3)),
        treble: Number(this.smoothedTreble.toFixed(3)),
        peak: 0,
        isPlaying: this.isRunning,
      };
    }

    // Read frequency & time data
    this.analyser.getByteFrequencyData(this.freqData);
    this.analyser.getByteTimeDomainData(this.timeData);

    const binCount = this.analyser.frequencyBinCount; // 128

    // 1. RMS Volume Calculation from time-domain
    let sumSquares = 0;
    for (let i = 0; i < this.timeData.length; i++) {
      const norm = (this.timeData[i] - 128) / 128;
      sumSquares += norm * norm;
    }
    const rawRms = Math.sqrt(sumSquares / this.timeData.length) * (this.currentVolume * 1.6);
    const volume = Math.min(1.0, Math.max(0.0, rawRms));

    // 2. Frequency bands
    // Bass: bins 1 to 8 (~20Hz - ~250Hz)
    let bassSum = 0;
    const bassEnd = Math.min(8, binCount);
    for (let i = 1; i < bassEnd; i++) bassSum += this.freqData[i];
    const rawBass = (bassSum / (bassEnd - 1)) / 255 * (this.currentVolume * 1.3);

    // Mids: bins 9 to 40 (~250Hz - ~4000Hz)
    let midSum = 0;
    const midEnd = Math.min(40, binCount);
    for (let i = 8; i < midEnd; i++) midSum += this.freqData[i];
    const rawMid = (midSum / (midEnd - 8)) / 255 * (this.currentVolume * 1.2);

    // Treble: bins 41 to 100 (~4000Hz - ~16000Hz)
    let trebleSum = 0;
    const trebleEnd = Math.min(100, binCount);
    for (let i = 40; i < trebleEnd; i++) trebleSum += this.freqData[i];
    const rawTreble = (trebleSum / (trebleEnd - 40)) / 255 * (this.currentVolume * 1.1);

    // Max Peak
    let peakVal = 0;
    for (let i = 0; i < binCount; i++) {
      if (this.freqData[i] > peakVal) peakVal = this.freqData[i];
    }
    const peak = Math.min(1.0, (peakVal / 255) * this.currentVolume);

    // Smooth values for fluid visual rendering
    const smoothFactor = 0.25;
    this.smoothedVolume = this.smoothedVolume * (1 - smoothFactor) + volume * smoothFactor;
    this.smoothedBass = this.smoothedBass * (1 - smoothFactor) + rawBass * smoothFactor;
    this.smoothedMid = this.smoothedMid * (1 - smoothFactor) + rawMid * smoothFactor;
    this.smoothedTreble = this.smoothedTreble * (1 - smoothFactor) + rawTreble * smoothFactor;

    return {
      volume: Number(this.smoothedVolume.toFixed(3)),
      bass: Number(this.smoothedBass.toFixed(3)),
      mid: Number(this.smoothedMid.toFixed(3)),
      treble: Number(this.smoothedTreble.toFixed(3)),
      peak: Number(peak.toFixed(3)),
      isPlaying: this.isRunning,
    };
  }

  /**
   * Attaches canvas for continuous requestAnimationFrame visualization
   */
  public attachCanvas(canvas: HTMLCanvasElement, mode: VisualizerMode = 'bars'): void {
    this.canvas = canvas;
    this.currentMode = mode;
    this.startRendering();
  }

  public setMode(mode: VisualizerMode): void {
    this.currentMode = mode;
  }

  public getMode(): VisualizerMode {
    return this.currentMode;
  }

  public setTheme(themeName: keyof typeof VISUALIZER_THEMES): void {
    if (VISUALIZER_THEMES[themeName]) {
      this.currentTheme = VISUALIZER_THEMES[themeName];
    }
  }

  public detachCanvas(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.canvas = null;
  }

  private startRendering(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const renderLoop = () => {
      this.draw();
      this.animFrameId = requestAnimationFrame(renderLoop);
    };

    this.animFrameId = requestAnimationFrame(renderLoop);
  }

  private draw(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    if (width === 0 || height === 0) return;

    // Clear frame with transparent or slight fade
    ctx.clearRect(0, 0, width, height);

    const metrics = this.getMetrics();
    const effectiveVol = this.isMuted ? 0 : this.currentVolume;
    const isSilenced = !this.isRunning || effectiveVol === 0;

    switch (this.currentMode) {
      case 'bars':
        this.renderBars(ctx, width, height, metrics, isSilenced);
        break;
      case 'wave':
        this.renderWave(ctx, width, height, metrics, isSilenced);
        break;
      case 'radial':
        this.renderRadial(ctx, width, height, metrics, isSilenced);
        break;
      case 'matrix':
        this.renderMatrix(ctx, width, height, metrics, isSilenced);
        break;
      default:
        this.renderBars(ctx, width, height, metrics, isSilenced);
    }
  }

  /**
   * Mode: Frequency Bars (Spectrum Analyzer with floating peak caps)
   */
  private renderBars(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    metrics: AudioMetrics,
    isSilenced: boolean
  ): void {
    const barCount = 36;
    const gap = 2;
    const barWidth = Math.max(2, (width - (barCount - 1) * gap) / barCount);
    const theme = this.currentTheme;

    if (this.analyser && !isSilenced) {
      this.analyser.getByteFrequencyData(this.freqData);
    }

    const step = Math.floor((this.freqData.length || 128) / barCount);

    for (let i = 0; i < barCount; i++) {
      let rawVal = isSilenced ? 0 : this.freqData[i * step] || 0;
      // Add slight volume & bass scaling
      const freqNorm = rawVal / 255;
      const boost = i < 6 ? 1 + metrics.bass * 0.4 : 1;
      let barHeight = freqNorm * height * 0.95 * boost * (this.isMuted ? 0 : this.currentVolume);

      // Floor height for nice aesthetic even when idle
      if (barHeight < 3) barHeight = 2.5;

      const x = i * (barWidth + gap);
      const y = height - barHeight;

      // Dynamic Gradient based on bar height & volume
      const gradient = ctx.createLinearGradient(0, height, 0, y);
      gradient.addColorStop(0, theme.primary);
      gradient.addColorStop(0.65, theme.secondary);
      gradient.addColorStop(1, theme.accent);

      ctx.fillStyle = gradient;
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = metrics.bass > 0.4 ? 8 : 4;

      // Rounded top bar
      const radius = Math.min(barWidth / 2, 2);
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
      ctx.fill();

      // Peak Cap line with gravity falloff
      if (!this.peakCaps[i]) this.peakCaps[i] = 0;
      if (barHeight > this.peakCaps[i]) {
        this.peakCaps[i] = barHeight;
      } else {
        this.peakCaps[i] = Math.max(2, this.peakCaps[i] - 0.7); // gravity decay
      }

      const peakY = height - this.peakCaps[i] - 2;
      ctx.fillStyle = theme.peakColor;
      ctx.shadowBlur = 3;
      ctx.fillRect(x, Math.max(0, peakY), barWidth, 1.5);
    }

    ctx.shadowBlur = 0;
  }

  /**
   * Mode: Oscilloscope Wave (Fluid Bezier Curve)
   */
  private renderWave(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    metrics: AudioMetrics,
    isSilenced: boolean
  ): void {
    const theme = this.currentTheme;
    const centerY = height / 2;

    if (this.analyser && !isSilenced) {
      this.analyser.getByteTimeDomainData(this.timeData);
    }

    const sliceWidth = width / (this.timeData.length - 1);
    const ampScale = (isSilenced ? 0 : metrics.volume * 1.5) * (height / 2.2);

    // Primary Wave
    ctx.beginPath();
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 10;

    for (let i = 0; i < this.timeData.length; i++) {
      const v = (this.timeData[i] - 128) / 128;
      const x = i * sliceWidth;
      const y = centerY + v * ampScale;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary Harmonic Wave (Violet / Accent)
    ctx.beginPath();
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 4;

    for (let i = 0; i < this.timeData.length; i++) {
      const v = (this.timeData[i] - 128) / 128;
      const x = i * sliceWidth;
      // Phase shifted wave
      const y = centerY - v * ampScale * 0.7 + Math.sin(i * 0.15) * (metrics.bass * 4);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /**
   * Mode: Radial Pulse (Circular Audio Reactor)
   */
  private renderRadial(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    metrics: AudioMetrics,
    isSilenced: boolean
  ): void {
    const theme = this.currentTheme;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.45;
    const maxRadius = Math.min(centerX, centerY) * 0.95;

    // Bass reactive central circle pulse
    const pulseRadius = baseRadius + (isSilenced ? 0 : metrics.bass * 14 * this.currentVolume);

    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(4, pulseRadius), 0, Math.PI * 2);
    ctx.fillStyle = theme.glow;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 12;
    ctx.fill();

    // Radiating spikes
    const spikeCount = 32;
    const angleStep = (Math.PI * 2) / spikeCount;

    for (let i = 0; i < spikeCount; i++) {
      const freqVal = isSilenced ? 0 : (this.freqData[i * 2] || 0) / 255;
      const spikeLength = freqVal * (maxRadius - baseRadius) * (this.isMuted ? 0 : this.currentVolume);

      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * pulseRadius;
      const y1 = centerY + Math.sin(angle) * pulseRadius;
      const x2 = centerX + Math.cos(angle) * (pulseRadius + Math.max(2, spikeLength));
      const y2 = centerY + Math.sin(angle) * (pulseRadius + Math.max(2, spikeLength));

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = i % 2 === 0 ? theme.primary : theme.secondary;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }

  /**
   * Mode: Cyberpunk Matrix LED Blocks
   */
  private renderMatrix(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    metrics: AudioMetrics,
    isSilenced: boolean
  ): void {
    const cols = 24;
    const rows = 8;
    const blockGapX = 2;
    const blockGapY = 2;
    const blockW = Math.max(2, (width - (cols - 1) * blockGapX) / cols);
    const blockH = Math.max(2, (height - (rows - 1) * blockGapY) / rows);
    const theme = this.currentTheme;

    for (let c = 0; c < cols; c++) {
      const freqVal = isSilenced ? 0 : (this.freqData[c * 4] || 0) / 255;
      const activeRows = Math.round(freqVal * rows * (this.isMuted ? 0 : this.currentVolume));

      for (let r = 0; r < rows; r++) {
        // r = 0 is top, r = rows - 1 is bottom
        const invRow = rows - 1 - r;
        const isActive = invRow < activeRows;

        const x = c * (blockW + blockGapX);
        const y = r * (blockH + blockGapY);

        if (isActive) {
          if (r < 2) ctx.fillStyle = theme.accent;
          else if (r < 5) ctx.fillStyle = theme.secondary;
          else ctx.fillStyle = theme.primary;
          ctx.shadowColor = theme.glow;
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(x, y, blockW, blockH);
      }
    }
    ctx.shadowBlur = 0;
  }

  public destroy(): void {
    this.stopPlayback();
    this.detachCanvas();
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

// Global Singleton for sharing across components
let globalAudioVisualizerEngine: AudioVisualizerEngine | null = null;

export function getAudioVisualizerEngine(): AudioVisualizerEngine {
  if (!globalAudioVisualizerEngine) {
    globalAudioVisualizerEngine = new AudioVisualizerEngine();
  }
  return globalAudioVisualizerEngine;
}
