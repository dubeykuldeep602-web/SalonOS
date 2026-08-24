/**
 * SalonOS Soundbox Audio & Voice Announcement Engine
 * Uses Web Audio API for payment soundbox chime and Web Speech API for voice announcement.
 */

class SoundboxEngine {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play realistic double-tone soundbox chime (e.g. Paytm/PhonePe Soundbox)
   */
  playChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Tone 1: High note
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Tone 2: Ascending confirmation note
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.15); // A5
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  /**
   * Speak voice payment confirmation
   * @param {number|string} amount
   * @param {string} method
   * @param {string} lang
   */
  announcePayment(amount, method = 'UPI', lang = 'en-IN') {
    // 1. Play soundbox chime first
    this.playChime();

    // 2. Speak announcement after 400ms chime
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      const text = `Payment of ${Number(amount).toLocaleString()} rupees received on SalonOS ${method}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;

      // Select high-quality English (India) or English (US) voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.includes('en-IN') || v.lang.includes('hi-IN') || v.lang.includes('en-GB')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 350);
    }
  }
}

export const soundbox = new SoundboxEngine();
