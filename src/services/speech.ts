export class SpeechService {
  private static speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  private static voices: SpeechSynthesisVoice[] = [];
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static initialize() {
    // Load voices
    const loadVoices = () => {
      this.voices = this.speechSynthesis.getVoices();
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  static speak(text: string, onEnd?: () => void) {
    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a natural-sounding voice (preferably male)
    const preferredVoice = this.voices.find(
      voice => voice.lang === 'en-US' && voice.name.includes('Male')
    ) || this.voices.find(
      voice => voice.lang === 'en-US'
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Configure speech parameters
    utterance.rate = 1.1; // Slightly faster than normal
    utterance.pitch = 1;
    utterance.volume = 1;

    // Handle speech end
    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance = utterance;
    this.speechSynthesis.speak(utterance);
  }

  static stop() {
    if (this.currentUtterance) {
      this.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  static isPaused() {
    return this.speechSynthesis.paused;
  }

  static pause() {
    this.speechSynthesis.pause();
  }

  static resume() {
    this.speechSynthesis.resume();
  }
}
