/**
 * Synthesizes gentle celestial chimes, ambient background music, and interaction sound effects
 * using the browser's Web Audio API. Zero external network dependencies.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private musicIndex: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isMusicPlaying) {
      this.pauseBackgroundMusic();
    } else if (!this.isMuted && !this.isMusicPlaying) {
      this.startBackgroundMusic();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying && !this.isMuted;
  }

  // Play a gentle musical note
  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.08) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.003, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio not permitted yet
    }
  }

  // Screen 1: Very subtle click sound
  public playSubtleClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  public playSoftClick() {
    this.playSubtleClick();
  }

  public playChime(freq = 523.25, duration = 2.4, type: OscillatorType = 'sine') {
    this.playTone(freq, duration, type, 0.08);
  }

  public playArpeggio() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.0, 'sine', 0.07);
      }, idx * 100);
    });
  }

  public playCelebrationChord() {
    this.playCelebrationChime();
  }

  // Screen 2: Small playful sound on each NO tap
  public playNoTap(tapNumber: number) {
    if (this.isMuted) return;
    const notes = [
      [440, 554.37],          // Tap 1: playful little hop
      [554.37, 659.25],       // Tap 2: slightly higher chime
      [659.25, 783.99, 880],  // Tap 3: escalating wobble
    ];

    const chord = notes[Math.min(tapNumber - 1, 2)] || [440];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.45, 'triangle', 0.07);
      }, idx * 70);
    });
  }

  // Screen 2 Tap 4: Larger magical sound
  public playMagicalBurst() {
    this.playCelebratoryUnlockChime();
  }

  // Soft, premium celebratory chime effect when fourth NO is clicked to enhance the 'unlocked' experience
  public playCelebratoryUnlockChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Warm base anchor chord (rich, deep, rounded)
      const baseFreqs = [261.63, 392.00, 523.25]; // C4, G4, C5
      baseFreqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2 + idx * 0.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 3.5);
      });

      // 2. Cascading crystalline high chime arpeggios (sparkling celestial bells)
      const chimeNotes = [
        { freq: 659.25, time: 0.00 }, // E5
        { freq: 783.99, time: 0.12 }, // G5
        { freq: 987.77, time: 0.24 }, // B5
        { freq: 1046.50, time: 0.36 }, // C6
        { freq: 1318.51, time: 0.48 }, // E6
        { freq: 1567.98, time: 0.62 }, // G6
        { freq: 2093.00, time: 0.78 }, // C7 (pure sparkling bell top)
      ];

      chimeNotes.forEach((item) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const chimeStart = now + item.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.freq, chimeStart);
        // Gentle shimmer vibrato
        osc.frequency.exponentialRampToValueAtTime(item.freq * 1.004, chimeStart + 2.0);

        gain.gain.setValueAtTime(0.001, chimeStart);
        gain.gain.exponentialRampToValueAtTime(0.09, chimeStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, chimeStart + 2.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(chimeStart);
        osc.stop(chimeStart + 2.3);
      });

      // 3. Subtle sub-octave golden shimmer bell
      setTimeout(() => {
        if (!this.isMuted && this.ctx) {
          this.playTone(880, 2.5, 'sine', 0.06);
          this.playTone(1174.66, 2.5, 'triangle', 0.05);
        }
      }, 350);

    } catch {
      // Audio fallback
    }
  }

  // Screen 3: Soft celebratory sound
  public playCelebrationChime() {
    if (this.isMuted) return;
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 3.2, 'sine', 0.09);
      }, idx * 110);
    });
  }

  // Soft sparkle / firework burst sound
  public playSparkle() {
    if (this.isMuted) return;
    const notes = [1046.5, 1318.51, 1567.98];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 1.2, 'sine', 0.05);
      }, i * 80);
    });
  }

  // Background ambient music: soothing soft celestial harp loop
  public startBackgroundMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    this.initCtx();
    this.isMusicPlaying = true;

    // Dreamy progression in A Major / F# Minor
    const progression = [
      [440, 554.37, 659.25],       // A major
      [369.99, 440, 554.37],       // F#m
      [493.88, 587.33, 739.99],    // Bm
      [329.63, 415.30, 493.88],    // E
      [440, 659.25, 880],          // A high
    ];

    if (this.musicTimer) clearInterval(this.musicTimer);

    const playChordStep = () => {
      if (!this.isMusicPlaying || this.isMuted) return;
      const currentChord = progression[this.musicIndex % progression.length];
      currentChord.forEach((note, nIdx) => {
        setTimeout(() => {
          this.playTone(note, 3.5, 'sine', 0.035);
        }, nIdx * 250);
      });
      this.musicIndex++;
    };

    playChordStep();
    this.musicTimer = setInterval(playChordStep, 4500);
  }

  public pauseBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public toggleBackgroundMusic(): boolean {
    if (this.isMusicPlaying) {
      this.pauseBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }
}

export const sounds = new SoundSystem();
