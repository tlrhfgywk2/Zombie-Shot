export class AudioManager {
  private context?: AudioContext;

  private getContext(): AudioContext | undefined {
    if (typeof AudioContext === 'undefined') return undefined;
    this.context ??= new AudioContext();
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  click(frequency = 460): void {
    this.tone(frequency, 0.035, 0.055, 'square');
  }

  rack(): void {
    this.tone(190, 0.08, 0.08, 'sawtooth');
    window.setTimeout(() => this.click(620), 110);
  }

  shot(): void {
    const context = this.getContext();
    if (!context) return;
    const length = Math.floor(context.sampleRate * 0.12);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = 0.12;
    source.connect(gain).connect(context.destination);
    source.start();
  }

  private tone(frequency: number, duration: number, volume: number, type: 'square' | 'sawtooth'): void {
    const context = this.getContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }
}
