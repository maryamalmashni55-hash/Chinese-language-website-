/**
 * Traditional Chinese Music Synthesizer using Web Audio API
 * Plays authentic pentatonic melodies (Guzheng & Bamboo Flute / Xiao simulation)
 * Completely self-contained, no external audio files required.
 */

class ChineseMusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;

  // Traditional Chinese Pentatonic Scale (宫 Gong, 商 Shang, 角 Jiao, 徵 Zhi, 羽 Yu)
  // Key of D / G Pentatonic notes (Hz)
  private pentatonicNotes: number[] = [
    293.66, // D4
    329.63, // E4
    392.0,  // G4
    440.0,  // A4
    493.88, // B4
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.0,  // A5
    987.77, // B5
  ];

  // Serene traditional melody sequence
  private melodyIndices: number[] = [
    2, 4, 5, 4, 2, 1, 0, 2,
    4, 5, 7, 5, 4, 2, 4,
    5, 7, 8, 7, 5, 4, 5, 2,
    1, 2, 4, 2, 1, 0, 2, 0,
  ];

  private noteStep = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Synthesize a plucked Guzheng (Chinese Zither) note
   */
  private playGuzhengNote(freq: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonic blend for traditional zither resonance
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Envelope: quick attack, natural exponential decay
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.35, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);

    // Subtle low-pass filter for warm wooden body acoustic
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 1.9);
  }

  /**
   * Synthesize a soothing Bamboo Flute (Dizi/Xiao) tone
   */
  private playFluteNote(freq: number, time: number, duration: number = 2.0) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Subtle gentle vibrato
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.0, time); // 5Hz vibrato
    vibratoGain.gain.setValueAtTime(3.5, time);
    vibrato.connect(osc.frequency);
    vibrato.start(time + 0.3);
    vibrato.stop(time + duration);

    // Soft breathy envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.25);
    gain.gain.setValueAtTime(0.12, time + duration - 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private scheduleNext() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const noteIdx = this.melodyIndices[this.noteStep % this.melodyIndices.length];
    const freq = this.pentatonicNotes[noteIdx];

    // Pluck Guzheng note
    this.playGuzhengNote(freq, now);

    // Occasionally play a flute sustain on key phrase boundaries
    if (this.noteStep % 4 === 0) {
      const fluteFreq = this.pentatonicNotes[(noteIdx + 5) % this.pentatonicNotes.length] * 0.5;
      this.playFluteNote(fluteFreq, now, 2.4);
    }

    this.noteStep++;

    // Randomize gentle tempo variations typical of Chinese traditional solo music
    const tempoDelay = 800 + Math.sin(this.noteStep * 0.7) * 200;
    this.timer = window.setTimeout(() => {
      this.scheduleNext();
    }, tempoDelay);
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.noteStep = 0;
    this.scheduleNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.25,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const chineseMusic = new ChineseMusicPlayer();
