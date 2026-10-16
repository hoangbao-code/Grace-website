// Web Audio API Synthesizer & Soundscape Engine

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNodes: Record<string, { gain: GainNode; source: AudioNode } | null> = {};
  private binauralNodes: { leftOsc: OscillatorNode; rightOsc: OscillatorNode; gain: GainNode } | null = null;
  private masterVolume: number = 0.8;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(volumePercent: number) {
    this.masterVolume = Math.max(0, Math.min(100, volumePercent)) / 100;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  // Generate buffer for Pink / Brown / White noise
  private createNoiseBuffer(type: 'white' | 'pink' | 'brown', durationSeconds = 5): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not ready');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }
    }
    return buffer;
  }

  // Ambient: Rain sound
  public setRainVolume(volPercent: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const volume = volPercent / 100;

    if (volume <= 0) {
      if (this.noiseNodes['rain']) {
        this.noiseNodes['rain'].gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!this.noiseNodes['rain']) {
      const buffer = this.createNoiseBuffer('pink');
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      // Filter for rain tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      src.start();

      this.noiseNodes['rain'] = { source: src, gain };
    } else {
      this.noiseNodes['rain'].gain.gain.setTargetAtTime(volume * 0.35, this.ctx.currentTime, 0.05);
    }
  }

  // Ambient: Brown Noise
  public setBrownNoiseVolume(volPercent: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const volume = volPercent / 100;

    if (volume <= 0) {
      if (this.noiseNodes['brown']) {
        this.noiseNodes['brown'].gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!this.noiseNodes['brown']) {
      const buffer = this.createNoiseBuffer('brown');
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

      src.connect(gain);
      gain.connect(this.masterGain);
      src.start();

      this.noiseNodes['brown'] = { source: src, gain };
    } else {
      this.noiseNodes['brown'].gain.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.05);
    }
  }

  // Ambient: Alpha Wave 10Hz (Binaural Beats: 200Hz left, 210Hz right)
  public setAlphaWavesVolume(volPercent: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const volume = volPercent / 100;

    if (volume <= 0) {
      if (this.binauralNodes) {
        this.binauralNodes.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!this.binauralNodes) {
      const leftOsc = this.ctx.createOscillator();
      const rightOsc = this.ctx.createOscillator();
      leftOsc.frequency.setValueAtTime(200, this.ctx.currentTime);
      rightOsc.frequency.setValueAtTime(210, this.ctx.currentTime);

      const merger = this.ctx.createChannelMerger(2);
      leftOsc.connect(merger, 0, 0);
      rightOsc.connect(merger, 0, 1);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.25, this.ctx.currentTime);

      merger.connect(gain);
      gain.connect(this.masterGain);

      leftOsc.start();
      rightOsc.start();

      this.binauralNodes = { leftOsc, rightOsc, gain };
    } else {
      this.binauralNodes.gain.gain.setTargetAtTime(volume * 0.25, this.ctx.currentTime, 0.05);
    }
  }

  // Sound effects: Task Victory chime (3-note pleasant chord)
  public playTaskVictory() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  // Sound effects: Reaction pop sound
  public playPopSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // TikTok Live: Combo pop with escalating pitch
  public playComboPop(combo: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    // Base freq climbs from 380Hz to 1100Hz as combo increases
    const baseFreq = Math.min(380 + (combo * 18), 1150);
    const endFreq = baseFreq * 1.5;

    osc.type = combo > 20 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Gift VFX: Tomato Splat (Low thud + white noise splat)
  public playTomatoSplat() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);

    // 2. Splat noise burst
    try {
      const buffer = this.createNoiseBuffer('white', 0.2);
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.15);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.2);
    } catch {
      // Audio buffer fallback safe
    }
  }

  // Gift VFX: Thug Life Funk Bass
  public playThugLife() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const notes = [110, 130.81, 164.81, 220]; // A2, C3, E3, A3
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.1;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // Gift VFX: Referee Whistle (Dual high frequency tones)
  public playRefereeWhistle() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [2600, 3100].forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.setValueAtTime(freq + 40, now + 0.1);
      osc.frequency.setValueAtTime(freq, now + 0.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.setValueAtTime(0.18, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }

  // Gift VFX: Royal Crown Fanfare
  public playCrownFanfare() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.75);
    });
  }

  // TikTok Live: Fever Time Mode Chime
  public playFeverTime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const chords = [
      [523.25, 659.25, 783.99], // C
      [587.33, 739.99, 880.00], // D
      [659.25, 830.61, 987.77], // E
      [783.99, 987.77, 1174.66], // G
      [1046.50, 1318.51, 1567.98], // C high
    ];

    chords.forEach((chord, chordIdx) => {
      chord.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + chordIdx * 0.11;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    });
  }
}

export const audioEngine = new AudioEngine();
