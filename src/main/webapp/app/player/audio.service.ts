import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private silentOscillator: OscillatorNode | null = null;
  private gainNode: GainNode;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.setValueAtTime(0.0001, this.audioContext.currentTime); // Leise genug, um unhörbar zu sein
    this.gainNode.connect(this.audioContext.destination);

    this.startSilentTone();
  }

  private startSilentTone(): void {
    this.silentOscillator = this.audioContext.createOscillator();
    this.silentOscillator.type = 'sine'; // Sinuswelle
    this.silentOscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A-Ton, 440 Hz

    this.silentOscillator.connect(this.gainNode);
    this.silentOscillator.start();
  }

  async playMP3(mp3Url: string): Promise<void> {
    if (this.silentOscillator) {
      this.silentOscillator.stop();
      this.silentOscillator.disconnect();
      this.silentOscillator = null;
    }

    const response = await fetch(mp3Url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const audioBufferSource = this.audioContext.createBufferSource();
    audioBufferSource.buffer = audioBuffer;
    audioBufferSource.connect(this.audioContext.destination);
    audioBufferSource.start();

    return new Promise(resolve => {
      audioBufferSource.onended = () => {
        this.startSilentTone();
        resolve();
      };
    });
  }
}
