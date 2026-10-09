/**
 * Web Audio API Audio Visualization Library for SoundVibe
 * Handles real-time frequency analysis, volume extraction, and multi-canvas rendering.
 */

export class WebAudioVisualizer {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.gainNode = null;
    this.masterGain = null;

    this.oscSubBass = null;
    this.oscMid = null;
    this.oscTreble = null;
    this.filterNode = null;
    this.synthGain = null;

    this.isRunning = false;
    this.volume = 0.8;
    this.isMuted = false;
    this.currentBpm = 126;

    this.freqData = new Uint8Array(128);
    this.timeData = new Uint8Array(128);
    this.peakCaps = new Array(64).fill(0);

    this.mode = 'bars'; // 'bars' | 'wave' | 'radial' | 'matrix'
    this.canvases = [];
    this.animId = null;

    this.theme = {
      primary: '#ef4444',
      secondary: '#f43f5e',
      accent: '#fb7185',
      glow: 'rgba(239, 68, 68, 0.45)',
      peakColor: '#ffffff',
    };

    this.smoothedVol = 0;
    this.smoothedBass = 0;
    this.smoothedMid = 0;
    this.smoothedTreble = 0;
  }

  init() {
    if (this.audioCtx) return true;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;

      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime); // Inaudible monitor tone to feed analyser

      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeData = new Uint8Array(this.analyser.fftSize);

      return true;
    } catch (e) {
      console.warn('[WebAudioVisualizer] Init error:', e);
      return false;
    }
  }

  async resume() {
    if (!this.init()) return;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (e) {
        console.warn('[WebAudioVisualizer] Resume error:', e);
      }
    }
  }

  startPlayback(bpm = 126) {
    this.currentBpm = bpm;
    this.isRunning = true;
    this.resume();

    if (!this.init() || !this.audioCtx || !this.analyser || !this.gainNode) return;

    this.stopSynthesizer();

    try {
      const now = this.audioCtx.currentTime;

      this.oscSubBass = this.audioCtx.createOscillator();
      this.oscSubBass.type = 'sine';
      this.oscSubBass.frequency.setValueAtTime(55, now);

      this.oscMid = this.audioCtx.createOscillator();
      this.oscMid.type = 'triangle';
      this.oscMid.frequency.setValueAtTime(220, now);

      this.oscTreble = this.audioCtx.createOscillator();
      this.oscTreble.type = 'sawtooth';
      this.oscTreble.frequency.setValueAtTime(880, now);

      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(3200, now);
      this.filterNode.Q.setValueAtTime(3, now);

      this.synthGain = this.audioCtx.createGain();
      const effVol = this.isMuted ? 0 : this.volume;
      this.synthGain.gain.setValueAtTime(effVol * 0.7, now);

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

      this.startModulation();
    } catch (err) {
      console.warn('[WebAudioVisualizer] Synthesis start error:', err);
    }
  }

  startModulation() {
    if (this.modTimer) clearInterval(this.modTimer);
    const stepMs = Math.round((60000 / (this.currentBpm || 120)) / 2);

    let step = 0;
    this.modTimer = setInterval(() => {
      if (!this.isRunning || !this.audioCtx || !this.oscSubBass || !this.oscMid || !this.filterNode) return;
      try {
        const t = this.audioCtx.currentTime;
        step = (step + 1) % 16;

        if (step % 4 === 0) {
          this.oscSubBass.frequency.cancelScheduledValues(t);
          this.oscSubBass.frequency.setValueAtTime(110, t);
          this.oscSubBass.frequency.exponentialRampToValueAtTime(45, t + 0.18);
        }

        const chordNotes = [220, 261.63, 329.63, 392, 440, 329.63, 261.63, 196];
        this.oscMid.frequency.setTargetAtTime(chordNotes[step % chordNotes.length], t, 0.08);

        const filterCutoff = 1500 + Math.sin(step * 0.7) * 1200;
        this.filterNode.frequency.setTargetAtTime(filterCutoff, t, 0.1);
      } catch {}
    }, stepMs);
  }

  stopPlayback() {
    this.isRunning = false;
    if (this.modTimer) {
      clearInterval(this.modTimer);
      this.modTimer = null;
    }
    this.stopSynthesizer();
  }

  stopSynthesizer() {
    try {
      if (this.oscSubBass) { this.oscSubBass.stop(); this.oscSubBass.disconnect(); this.oscSubBass = null; }
      if (this.oscMid) { this.oscMid.stop(); this.oscMid.disconnect(); this.oscMid = null; }
      if (this.oscTreble) { this.oscTreble.stop(); this.oscTreble.disconnect(); this.oscTreble = null; }
    } catch {}
  }

  setVolume(volPercent) {
    this.volume = Math.max(0, Math.min(100, volPercent)) / 100;
    this.updateGain();
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.updateGain();
  }

  updateGain() {
    if (!this.gainNode || !this.audioCtx) return;
    const targetGain = this.isMuted ? 0 : this.volume;
    try {
      this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.gainNode.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.05);
    } catch {
      this.gainNode.gain.value = targetGain;
    }
  }

  getMetrics() {
    if (!this.analyser || !this.isRunning || this.isMuted || this.volume === 0) {
      this.smoothedVol *= 0.85;
      this.smoothedBass *= 0.85;
      this.smoothedMid *= 0.85;
      this.smoothedTreble *= 0.85;
      return {
        volume: Number(this.smoothedVol.toFixed(3)),
        bass: Number(this.smoothedBass.toFixed(3)),
        mid: Number(this.smoothedMid.toFixed(3)),
        treble: Number(this.smoothedTreble.toFixed(3)),
        peak: 0,
        isPlaying: this.isRunning
      };
    }

    this.analyser.getByteFrequencyData(this.freqData);
    this.analyser.getByteTimeDomainData(this.timeData);

    const binCount = this.analyser.frequencyBinCount;

    let sumSq = 0;
    for (let i = 0; i < this.timeData.length; i++) {
      const norm = (this.timeData[i] - 128) / 128;
      sumSq += norm * norm;
    }
    const rawRms = Math.sqrt(sumSq / this.timeData.length) * (this.volume * 1.6);
    const volume = Math.min(1, Math.max(0, rawRms));

    let bassSum = 0;
    const bassEnd = Math.min(8, binCount);
    for (let i = 1; i < bassEnd; i++) bassSum += this.freqData[i];
    const rawBass = (bassSum / (bassEnd - 1)) / 255 * (this.volume * 1.3);

    let midSum = 0;
    const midEnd = Math.min(40, binCount);
    for (let i = 8; i < midEnd; i++) midSum += this.freqData[i];
    const rawMid = (midSum / (midEnd - 8)) / 255 * (this.volume * 1.2);

    let trebleSum = 0;
    const trebleEnd = Math.min(100, binCount);
    for (let i = 40; i < trebleEnd; i++) trebleSum += this.freqData[i];
    const rawTreble = (trebleSum / (trebleEnd - 40)) / 255 * (this.volume * 1.1);

    const smooth = 0.25;
    this.smoothedVol = this.smoothedVol * (1 - smooth) + volume * smooth;
    this.smoothedBass = this.smoothedBass * (1 - smooth) + rawBass * smooth;
    this.smoothedMid = this.smoothedMid * (1 - smooth) + rawMid * smooth;
    this.smoothedTreble = this.smoothedTreble * (1 - smooth) + rawTreble * smooth;

    return {
      volume: Number(this.smoothedVol.toFixed(3)),
      bass: Number(this.smoothedBass.toFixed(3)),
      mid: Number(this.smoothedMid.toFixed(3)),
      treble: Number(this.smoothedTreble.toFixed(3)),
      peak: Math.min(1, Math.max(...this.freqData) / 255 * this.volume),
      isPlaying: this.isRunning
    };
  }

  registerCanvas(canvasEl) {
    if (!canvasEl) return;
    if (!this.canvases.includes(canvasEl)) {
      this.canvases.push(canvasEl);
    }
    if (!this.animId) {
      this.startLoop();
    }
  }

  cycleMode() {
    const modes = ['bars', 'wave', 'radial', 'matrix'];
    const idx = (modes.indexOf(this.mode) + 1) % modes.length;
    this.mode = modes[idx];
    return this.mode;
  }

  startLoop() {
    const render = () => {
      this.drawAll();
      this.animId = requestAnimationFrame(render);
    };
    this.animId = requestAnimationFrame(render);
  }

  drawAll() {
    const metrics = this.getMetrics();
    const effVol = this.isMuted ? 0 : this.volume;
    const isSilenced = !this.isRunning || effVol === 0;

    for (const canvas of this.canvases) {
      if (!canvas || !canvas.isConnected) continue;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) continue;

      ctx.clearRect(0, 0, w, h);

      switch (this.mode) {
        case 'bars':
          this.renderBars(ctx, w, h, metrics, isSilenced);
          break;
        case 'wave':
          this.renderWave(ctx, w, h, metrics, isSilenced);
          break;
        case 'radial':
          this.renderRadial(ctx, w, h, metrics, isSilenced);
          break;
        case 'matrix':
          this.renderMatrix(ctx, w, h, metrics, isSilenced);
          break;
        default:
          this.renderBars(ctx, w, h, metrics, isSilenced);
      }
    }
  }

  renderBars(ctx, w, h, metrics, isSilenced) {
    const barCount = Math.min(36, Math.floor(w / 8));
    const gap = 2;
    const barW = Math.max(2, (w - (barCount - 1) * gap) / barCount);
    const theme = this.theme;

    if (this.analyser && !isSilenced) {
      this.analyser.getByteFrequencyData(this.freqData);
    }

    const step = Math.floor((this.freqData.length || 128) / barCount);

    for (let i = 0; i < barCount; i++) {
      const rawVal = isSilenced ? 0 : this.freqData[i * step] || 0;
      const norm = rawVal / 255;
      const boost = i < 6 ? 1 + metrics.bass * 0.4 : 1;
      let barH = norm * h * 0.95 * boost * (this.isMuted ? 0 : this.volume);
      if (barH < 2) barH = 2;

      const x = i * (barW + gap);
      const y = h - barH;

      const grad = ctx.createLinearGradient(0, h, 0, y);
      grad.addColorStop(0, theme.primary);
      grad.addColorStop(0.7, theme.secondary);
      grad.addColorStop(1, theme.accent);

      ctx.fillStyle = grad;
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = metrics.bass > 0.4 ? 6 : 2;

      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [1, 1, 0, 0]);
      ctx.fill();

      // Peak cap
      if (!this.peakCaps[i]) this.peakCaps[i] = 0;
      if (barH > this.peakCaps[i]) {
        this.peakCaps[i] = barH;
      } else {
        this.peakCaps[i] = Math.max(2, this.peakCaps[i] - 0.6);
      }

      ctx.fillStyle = theme.peakColor;
      ctx.fillRect(x, Math.max(0, h - this.peakCaps[i] - 1), barW, 1.2);
    }
    ctx.shadowBlur = 0;
  }

  renderWave(ctx, w, h, metrics, isSilenced) {
    const theme = this.theme;
    const centerY = h / 2;

    if (this.analyser && !isSilenced) {
      this.analyser.getByteTimeDomainData(this.timeData);
    }

    const sliceW = w / (this.timeData.length - 1);
    const amp = (isSilenced ? 0 : metrics.volume * 1.5) * (h / 2.2);

    ctx.beginPath();
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 8;

    for (let i = 0; i < this.timeData.length; i++) {
      const v = (this.timeData[i] - 128) / 128;
      const x = i * sliceW;
      const y = centerY + v * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  renderRadial(ctx, w, h, metrics, isSilenced) {
    const theme = this.theme;
    const cx = w / 2;
    const cy = h / 2;
    const baseR = Math.min(cx, cy) * 0.4;
    const maxR = Math.min(cx, cy) * 0.9;
    const pulseR = baseR + (isSilenced ? 0 : metrics.bass * 8 * this.volume);

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(3, pulseR), 0, Math.PI * 2);
    ctx.fillStyle = theme.glow;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 8;
    ctx.fill();

    const count = 24;
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const f = isSilenced ? 0 : (this.freqData[i * 2] || 0) / 255;
      const len = f * (maxR - baseR) * (this.isMuted ? 0 : this.volume);
      const a = i * step;
      const x1 = cx + Math.cos(a) * pulseR;
      const y1 = cy + Math.sin(a) * pulseR;
      const x2 = cx + Math.cos(a) * (pulseR + Math.max(2, len));
      const y2 = cy + Math.sin(a) * (pulseR + Math.max(2, len));

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = i % 2 === 0 ? theme.primary : theme.secondary;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  renderMatrix(ctx, w, h, metrics, isSilenced) {
    const cols = Math.min(24, Math.floor(w / 10));
    const rows = 6;
    const gapX = 2;
    const gapY = 1.5;
    const blockW = Math.max(2, (w - (cols - 1) * gapX) / cols);
    const blockH = Math.max(2, (h - (rows - 1) * gapY) / rows);
    const theme = this.theme;

    for (let c = 0; c < cols; c++) {
      const f = isSilenced ? 0 : (this.freqData[c * 3] || 0) / 255;
      const activeRows = Math.round(f * rows * (this.isMuted ? 0 : this.volume));

      for (let r = 0; r < rows; r++) {
        const invR = rows - 1 - r;
        const isActive = invR < activeRows;
        const x = c * (blockW + gapX);
        const y = r * (blockH + gapY);

        if (isActive) {
          ctx.fillStyle = r < 2 ? theme.accent : theme.primary;
          ctx.fillRect(x, y, blockW, blockH);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(x, y, blockW, blockH);
        }
      }
    }
  }
}

export const webAudioVisualizer = new WebAudioVisualizer();
