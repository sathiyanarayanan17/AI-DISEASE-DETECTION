// Web Speech API Voice Synthesis Service for Audio Bulletins

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
  }

  isSupported() {
    return !!this.synth;
  }

  speak(text, onStart, onEnd, onError) {
    if (!this.synth) {
      if (onError) onError(new Error("Web Speech API not supported in this browser"));
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;
    utterance.lang = 'en-IN'; // Indian English cadence

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  setSettings(rate = 1.0, pitch = 1.0, volume = 1.0) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
    this.pitch = Math.max(0.5, Math.min(1.5, pitch));
    this.volume = Math.max(0, Math.min(1.0, volume));
  }
}

export const speechService = new SpeechService();
