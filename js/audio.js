/**
 * Royal Indian Wedding Audio Synthesizer
 * Built with Web Audio API - Provides an authentic Shehnai & Tanpura classical ambiance (Raag Yaman / Mangal Dhwani)
 * Zero external audio file dependencies, 100% reliable offline & online!
 */

class WeddingAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.volume = 0.5;
    this.droneGain = null;
    this.melodyGain = null;
    this.masterGain = null;
    this.droneOscillators = [];
    this.timerId = null;

    // Raag Yaman notes (frequencies in Hz around D key for festive shehnai timbre)
    // D4, E4, F#4, G#4 (Tivra Ma), A4, B4, C#5, D5
    this.scale = [
      293.66, // Sa (D4)
      329.63, // Re (E4)
      369.99, // Ga (F#4)
      415.30, // Ma tivra (G#4)
      440.00, // Pa (A4)
      493.88, // Dha (B4)
      554.37, // Ni (C#5)
      587.33, // Taar Sa (D5)
      659.25  // Taar Re (E5)
    ];

    // Melodic phrases characteristic of Indian wedding celebration
    this.melodyPhrases = [
      [0, 1, 2, 4, 3, 2, 1, 0],
      [2, 3, 4, 6, 7, 6, 4, 2],
      [4, 6, 7, 8, 7, 6, 4, 2, 0],
      [0, 2, 4, 6, 7, 7, 7],
      [7, 6, 4, 3, 2, 1, 0]
    ];
    this.currentPhraseIndex = 0;
    this.currentNoteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Drone Gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.droneGain.connect(this.masterGain);

      // Melody Gain
      this.melodyGain = this.ctx.createGain();
      this.melodyGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.melodyGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startTanpuraDrone() {
    this.stopTanpuraDrone();
    // Indian Tanpura Pa-Sa-Sa-Sa drone on D (146.83 Hz) and A (220 Hz)
    const freqs = [146.83, 220.00, 293.66, 293.66 * 1.002]; // subtle chorusing detune

    this.droneOscillators = freqs.map((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Warm rich saw + triangle combination
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Low pass filter to simulate wooden gourd acoustic body
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + (idx * 120), this.ctx.currentTime);

      // Subtle slow amplitude breathing (Tanpura pluck cycle)
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2 + (idx * 0.08), this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);
      osc.start();

      return { osc, lfo };
    });
  }

  stopTanpuraDrone() {
    if (this.droneOscillators.length > 0) {
      this.droneOscillators.forEach(({ osc, lfo }) => {
        try {
          osc.stop();
          osc.disconnect();
          lfo.stop();
          lfo.disconnect();
        } catch (e) {}
      });
      this.droneOscillators = [];
    }
  }

  playShehnaiNote(freq, durationSec) {
    if (!this.ctx || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    
    // Shehnai uses a double reed with rich reedy harmonics and expressive vibrato
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    // Vibrato (Indian classical gamak / meend)
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
    const vibratoGain = this.ctx.createGain();
    vibratoGain.gain.setValueAtTime(freq * 0.015, now); // gentle pitch modulation
    vibrato.connect(osc.frequency);
    vibrato.start(now);

    // Bandpass and resonance for nasal shehnai acoustic tube
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(2.5, now);

    // Envelope (soft attack, sustained, smooth release)
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.exponentialRampToValueAtTime(0.35, now + 0.15); // breath-in
    env.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.melodyGain);

    osc.start(now);
    osc.stop(now + durationSec + 0.05);
    vibrato.stop(now + durationSec + 0.05);
  }

  stepMelody() {
    if (!this.isPlaying) return;

    const phrase = this.melodyPhrases[this.currentPhraseIndex];
    const noteDegree = phrase[this.currentNoteIndex];
    const freq = this.scale[noteDegree];
    const noteDuration = (Math.random() > 0.4 ? 1.2 : 0.8);

    this.playShehnaiNote(freq, noteDuration);

    this.currentNoteIndex++;
    if (this.currentNoteIndex >= phrase.length) {
      this.currentNoteIndex = 0;
      this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.melodyPhrases.length;
      // Pause between phrases (sweet pause)
      this.timerId = setTimeout(() => this.stepMelody(), (noteDuration + 1.2) * 1000);
    } else {
      this.timerId = setTimeout(() => this.stepMelody(), (noteDuration + 0.15) * 1000);
    }
  }

  play() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startTanpuraDrone();
    this.stepMelody();
    this.updateUI(true);
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopTanpuraDrone();
    this.updateUI(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  updateUI(playing) {
    const soundwaves = document.querySelector('.soundwaves');
    const musicBtn = document.getElementById('music-toggle-btn');
    if (soundwaves) {
      soundwaves.classList.toggle('playing', playing);
    }
    if (musicBtn) {
      musicBtn.setAttribute('title', playing ? 'Pause Shehnai Music' : 'Play Indian Wedding Shehnai');
      musicBtn.setAttribute('aria-label', playing ? 'Pause Music' : 'Play Music');
    }
  }
}

// Global instance
window.weddingAudio = new WeddingAudioPlayer();
