// Audio Engine loading First Full-Length Audio Track of "Until I Found You" (Stephen Sanchez)
// Starts directly at the main chorus / mukhda ("I would never fall in love again until I found her...")

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private audioEle: HTMLAudioElement | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  public playTileSwap() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.12); // E5

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  public playPuzzleSolveFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.4);
      });
    } catch {}
  }

  // Play First Full-Length Audio Track starting directly at Main Chorus / Kadva
  public startRomanticMusic() {
    if (this.isMuted) return;
    this.initCtx();

    if (!this.audioEle) {
      this.audioEle = new Audio('/audio/until_i_found_you.m4a');
      this.audioEle.loop = true;
      this.audioEle.volume = 0.8;
    }

    // Jump directly to main chorus / kadva (35s timestamp: "I would never fall in love again until I found her...")
    if (this.audioEle.currentTime < 5) {
      this.audioEle.currentTime = 35;
    }

    const playResult = this.audioEle.play();
    if (playResult !== undefined) {
      playResult.catch(() => {
        this.startSynthesizedMelody();
      });
    }
  }

  private startSynthesizedMelody() {
    if (this.musicInterval) return;

    const chords = [
      { bass: 196.00, chord: [392.00, 493.88, 587.33] }, // G major
      { bass: 246.94, chord: [369.99, 493.88, 587.33] }, // B minor
      { bass: 261.63, chord: [329.63, 392.00, 523.25] }, // C major
      { bass: 261.63, chord: [311.13, 392.00, 523.25] }  // C minor
    ];
    let step = 0;

    const playBar = () => {
      if (this.isMuted || !this.ctx) return;
      const current = chords[step % chords.length];
      step++;

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(current.bass, this.ctx.currentTime);
      bassGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.0);
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start();
      bassOsc.stop(this.ctx.currentTime + 3.0);

      current.chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.25);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime + idx * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.25 + 2.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.25);
        osc.stop(this.ctx.currentTime + idx * 0.25 + 2.2);
      });
    };

    playBar();
    this.musicInterval = window.setInterval(playBar, 3000);
  }

  public stopRomanticMusic() {
    if (this.audioEle) {
      this.audioEle.pause();
    }
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopRomanticMusic();
    } else {
      this.startRomanticMusic();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundFx = new SoundEngine();
