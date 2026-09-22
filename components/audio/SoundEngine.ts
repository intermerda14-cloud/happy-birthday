"use client";
import { getAsset } from "@/assets/manifest";

// Web Audio API sintetis murni (Zero External Assets / No Copyright Issues)
// Menghasilkan efek suara organik: Tiup lilin, balik kertas, sobek kupon, pecah lilin, dan ambient bed hangat.

// Kotak musik lembut: progresi C - G - Am - F, arpeggio pelan (nada dalam Hz)
const AMBIENT_PROGRESSION = [
  { bass: 261.63, notes: [523.25, 659.25, 783.99, 1046.5, 1318.51] },
  { bass: 196.0, notes: [392.0, 493.88, 587.33, 783.99, 987.77] },
  { bass: 220.0, notes: [440.0, 523.25, 659.25, 880.0, 1046.5] },
  { bass: 174.61, notes: [349.23, 440.0, 523.25, 698.46, 880.0] },
];
const AMBIENT_PATTERN = [0, 1, 2, 3, 4, 3, 2, 1];
const AMBIENT_STEP = 0.44; // detik per not (sekitar 68 bpm)

const AMBIENT_FILE_VOLUME = 1.0; // gain amplify musik latar dari file sendiri (via GainNode, bisa > 1)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private enabled = true;
  private ducked = false;
  private ambientEl: HTMLAudioElement | null = null;
  private ambientElSource: MediaElementAudioSourceNode | null = null;
  private ambientElGain: GainNode | null = null;
  private fadeTimer: ReturnType<typeof setInterval> | null = null;
  private ambientTimer: ReturnType<typeof setInterval> | null = null;
  private ambientSend: GainNode | null = null;
  private nextNote = 0;
  private step = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Musik latar dari file sendiri: isi slot audio.ambient di assets/manifest.ts
  private customAmbientSrc(): string | null {
    const f = getAsset("audio.ambient")?.file;
    if (!f) return null;
    return f.startsWith("/") || f.startsWith("http") ? f : `/media/${f}`;
  }

  private startCustomAmbient(src: string) {
    this.initCtx();
    const el = new Audio(src);
    el.loop = true;
    el.volume = 1; // volume native dikunci 1.0, gain dikontrol via GainNode
    el.crossOrigin = "anonymous";
    this.ambientEl = el;
    this.isAmbientPlaying = true;

    if (this.ctx) {
      try {
        const source = this.ctx.createMediaElementSource(el);
        const gain = this.ctx.createGain();
        gain.gain.value = 0;
        source.connect(gain);
        gain.connect(this.ctx.destination);
        this.ambientElSource = source;
        this.ambientElGain = gain;
      } catch {
        // Fallback: kalau Web Audio graph gagal (mis. browser lama), pakai volume element biasa.
        this.ambientElGain = null;
      }
    }

    if (this.enabled && !this.ducked) this.fadeEl(AMBIENT_FILE_VOLUME);
  }

  private fadeEl(target: number) {
    const el = this.ambientEl;
    if (!el) return;
    if (this.fadeTimer) clearInterval(this.fadeTimer);
    if (target > 0 && el.paused) el.play().catch(() => {});

    const FADE_DURATION_MS = 3000; // fade dramatis 3 detik
    const TICK_MS = 50;
    const totalTicks = FADE_DURATION_MS / TICK_MS;
    let tick = 0;

    const gainNode = this.ambientElGain;
    const startLevel = gainNode ? gainNode.gain.value : el.volume;
    const maxLevel = gainNode ? target : Math.min(1, target);

    this.fadeTimer = setInterval(() => {
      tick += 1;
      const progress = Math.min(1, tick / totalTicks);
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const level = Math.max(0, startLevel + (maxLevel - startLevel) * eased);

      if (gainNode) {
        gainNode.gain.value = level;
      } else {
        el.volume = Math.min(1, level);
      }

      if (progress >= 1) {
        if (gainNode) {
          gainNode.gain.value = maxLevel;
        } else {
          el.volume = Math.min(1, maxLevel);
        }
        if (this.fadeTimer) clearInterval(this.fadeTimer);
        this.fadeTimer = null;
        if (target === 0) el.pause();
      }
    }, TICK_MS);
  }

  private applyAmbient() {
    const on = this.enabled && !this.ducked;
    if (this.ambientEl) this.fadeEl(on ? AMBIENT_FILE_VOLUME : 0);
    if (this.ambientGain && this.ctx) this.ambientGain.gain.setTargetAtTime(on ? 0.05 : 0, this.ctx.currentTime, 0.4);
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    this.applyAmbient();
  }

  public getEnabled() {
    return this.enabled;
  }

  // SFX 1: Balik Halaman (Gesekan Kertas Halus)
  public playPageTurn() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.18);
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // SFX 2: Tiup Lilin (Desisan Udara Halus)
  public playBlow() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 1.2;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const env = Math.sin(progress * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.35;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.linearRampToValueAtTime(150, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // SFX 3: Pecah Segel Lilin (Crack / Pop Lembut)
  public playWaxCrack() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // SFX 4: Sobek Kupon
  public playTear() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 0.25;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // SFX 5: Buka Gulungan Kertas (Chime Magis)
  public playChime() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + idx * 0.08);

      gain.gain.setValueAtTime(0, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, t + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.8);
    });
  }

  // Ambient: kotak musik lembut (sintesis murni, tanpa file audio)
  public startAmbient() {
    if (this.isAmbientPlaying) return;
    const custom = this.customAmbientSrc();
    if (custom) {
      this.startCustomAmbient(custom);
      return;
    }
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    this.isAmbientPlaying = true;
    const t = ctx.currentTime;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, t);
    this.ambientGain.gain.linearRampToValueAtTime(this.enabled ? 0.05 : 0, t + 3);
    this.ambientGain.connect(ctx.destination);

    // Gema lembut supaya nada terdengar berongga seperti di ruangan
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.36;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2600;
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    tone.connect(this.ambientGain);
    this.ambientSend = ctx.createGain();
    this.ambientSend.gain.value = 0.55;
    this.ambientSend.connect(delay);

    this.nextNote = t + 0.4;
    this.step = 0;
    this.ambientTimer = setInterval(() => this.tickAmbient(), 120);
  }

  private tickAmbient() {
    const ctx = this.ctx;
    if (!ctx) return;
    if (!this.enabled || this.ducked) {
      this.nextNote = Math.max(this.nextNote, ctx.currentTime + 0.1);
      return;
    }
    while (this.nextNote < ctx.currentTime + 0.6) {
      this.scheduleStep(this.nextNote, this.step);
      this.nextNote += AMBIENT_STEP;
      this.step += 1;
    }
  }

  private scheduleStep(when: number, step: number) {
    const chord = AMBIENT_PROGRESSION[Math.floor(step / 8) % AMBIENT_PROGRESSION.length];
    const pos = step % 8;
    if (pos === 0) this.bell(chord.bass, when, 0.9, 3.2);
    if (pos !== 0 && Math.random() < 0.14) return; // jeda tipis supaya terasa manusiawi
    const jitter = (Math.random() - 0.5) * 0.02;
    this.bell(chord.notes[AMBIENT_PATTERN[pos]], when + jitter, 0.75 + Math.random() * 0.5, 2.2);
  }

  // Satu nada kotak musik: sinus + partial logam tipis, meluruh cepat
  private bell(freq: number, when: number, vel: number, dur: number) {
    const ctx = this.ctx;
    if (!ctx || !this.ambientGain) return;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vel, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

    const o1 = ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.setValueAtTime(freq, when);
    o1.connect(g);

    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.setValueAtTime(freq * 2.756, when);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.16, when);
    g2.gain.exponentialRampToValueAtTime(0.0001, when + 0.5);
    o2.connect(g2);
    g2.connect(g);

    g.connect(this.ambientGain);
    if (this.ambientSend) g.connect(this.ambientSend);

    o1.start(when);
    o2.start(when);
    o1.stop(when + dur + 0.1);
    o2.stop(when + 0.6);
  }

  // Ducking saat Spotify/Lagu berputar
  public duckAmbient(duck: boolean) {
    this.ducked = duck;
    this.applyAmbient();
  }
}

export const sounds = new SoundEngine();