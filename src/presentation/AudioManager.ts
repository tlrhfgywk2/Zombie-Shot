import type { AmmoType } from '../combat/types';
import { DEFAULT_AUDIO_PREFERENCES, type AudioPreferences, clampVolume } from './AudioPreferences';

export class AudioManager {
  private context?: AudioContext;
  private masterGain?: GainNode;
  private preferences: AudioPreferences = { ...DEFAULT_AUDIO_PREFERENCES };
  private active = true;
  private activityRevision = 0;
  private unavailable = false;

  prepare(): void {
    if (!this.active || this.preferences.muted || this.preferences.volume === 0) return;
    const context = this.getContext();
    if (context) this.resumeContext(context);
  }

  setPreferences(preferences: AudioPreferences): void {
    this.preferences = { muted: preferences.muted, volume: clampVolume(preferences.volume) };
    this.applyMasterGain();
  }

  setActive(active: boolean): void {
    this.active = active;
    const revision = ++this.activityRevision;
    const context = this.context;
    if (!context) return;
    if (!active) {
      this.applyMasterGain(true);
      if (context.state === 'running') void context.suspend().then(() => {
        if (this.active && revision !== this.activityRevision) this.resumeContext(context);
      }).catch(() => undefined);
    } else if (!this.preferences.muted && this.preferences.volume > 0) this.resumeContext(context);
  }

  insertRound(ammoType: AmmoType, index: number): void {
    const frequency: Record<AmmoType, number> = { standard: 430, tracer: 540, fragmenting: 360, incendiary: 620 };
    this.tone(frequency[ammoType] + index * 18, 0.045, 0.045, 'square');
    this.tone(180, 0.028, 0.025, 'triangle', 0.022);
  }

  magazineSeat(): void {
    this.noise(0.055, 0.05, 760);
    this.tone(145, 0.07, 0.08, 'square');
    this.tone(520, 0.035, 0.035, 'triangle', 0.045);
  }

  slidePull(): void {
    this.noise(0.13, 0.035, 980);
    this.tone(165, 0.1, 0.04, 'sawtooth');
  }

  slideRelease(): void {
    this.noise(0.045, 0.06, 1250);
    this.tone(245, 0.055, 0.075, 'square');
    this.tone(720, 0.025, 0.028, 'triangle', 0.025);
  }

  shot(ammoType: AmmoType): void {
    const lowFrequency: Record<AmmoType, number> = { standard: 92, tracer: 112, fragmenting: 76, incendiary: 102 };
    const volume = ammoType === 'fragmenting' ? 0.16 : 0.135;
    this.noise(ammoType === 'fragmenting' ? 0.16 : 0.12, volume, ammoType === 'tracer' ? 1800 : 1250);
    this.tone(lowFrequency[ammoType], 0.11, 0.09, 'sawtooth');
    if (ammoType === 'tracer') this.tone(880, 0.055, 0.025, 'sine', 0.015);
    if (ammoType === 'incendiary') this.noise(0.2, 0.028, 2400, 0.055);
  }

  impact(ammoType: AmmoType): void {
    if (ammoType === 'fragmenting') {
      this.noise(0.09, 0.065, 2100);
      this.tone(285, 0.06, 0.035, 'square');
    } else if (ammoType === 'incendiary') {
      this.noise(0.16, 0.04, 2800);
      this.tone(460, 0.09, 0.025, 'sawtooth');
    } else this.tone(ammoType === 'tracer' ? 390 : 310, 0.045, 0.035, 'triangle');
  }

  burn(): void {
    this.noise(0.32, 0.035, 3200);
    this.tone(240, 0.22, 0.02, 'sawtooth');
  }

  growl(): void {
    this.tone(72, 0.18, 0.024, 'sawtooth');
  }

  death(): void {
    this.noise(0.24, 0.04, 480);
    this.tone(105, 0.35, 0.045, 'sawtooth');
    this.tone(62, 0.42, 0.035, 'square', 0.13);
  }

  private getContext(): AudioContext | undefined {
    if (this.unavailable || typeof AudioContext === 'undefined') return undefined;
    try {
      this.context ??= new AudioContext();
      if (!this.masterGain) {
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
      }
      this.applyMasterGain(true);
      return this.context;
    } catch {
      this.unavailable = true;
      return undefined;
    }
  }

  private tone(frequency: number, duration: number, volume: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', delay = 0): void {
    const context = this.getPlayableContext();
    if (!context) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.72), start + duration);
    gain.gain.setValueAtTime(Math.max(volume, 0.001), start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(this.masterGain!);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  private noise(duration: number, volume: number, filterFrequency: number, delay = 0): void {
    const context = this.getPlayableContext();
    if (!context) return;
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) channel[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / length, 2.4);
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = 'lowpass';
    filter.frequency.value = filterFrequency;
    gain.gain.value = volume;
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(this.masterGain!);
    source.start(context.currentTime + delay);
  }

  private getPlayableContext(): AudioContext | undefined {
    if (!this.active || this.preferences.muted || this.preferences.volume === 0) return undefined;
    const context = this.getContext();
    if (!context || context.state !== 'running') return undefined;
    return context;
  }

  private applyMasterGain(immediate = false): void {
    if (!this.masterGain || !this.context) return;
    const target = this.active && !this.preferences.muted ? this.preferences.volume : 0;
    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    if (immediate) this.masterGain.gain.setValueAtTime(target, now);
    else this.masterGain.gain.setTargetAtTime(target, now, 0.025);
  }

  private resumeContext(context: AudioContext): void {
    if (!this.active || this.preferences.muted || this.preferences.volume === 0 || context.state !== 'suspended') return;
    void context.resume().then(() => this.applyMasterGain()).catch(() => undefined);
  }
}
