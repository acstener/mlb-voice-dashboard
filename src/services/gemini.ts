import { GoogleGenerativeAI } from '@google/generative-ai';

// Debug logging
console.log('API Key available:', !!import.meta.env.VITE_GEMINI_API_KEY);

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Use Gemini 2.0 Flash for real-time audio interactions
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp"
});

interface GameContext {
  inning: string;
  count: { balls: number; strikes: number };
  outs: number;
  bases: { first: boolean; second: boolean; third: boolean };
  homeTeam: { name: string; score: number };
  awayTeam: { name: string; score: number };
}

interface AudioConfig {
  audioData: ArrayBuffer;
  mimeType: string;
}

export class GeminiService {
  private static chat: any = null;
  private static mediaRecorder: MediaRecorder | null = null;
  private static audioContext: AudioContext | null = null;
  private static audioChunks: Blob[] = [];
  private static onResponseCallback: ((text: string, audio?: ArrayBuffer) => void) | null = null;

  // Helper function to convert ArrayBuffer to base64 in chunks
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer);
    const chunkSize = 32768; // Process 32KB chunks
    let binary = '';
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }

  // Convert audio to 16-bit PCM at 16kHz
  private static async convertToPCM(audioData: ArrayBuffer): Promise<ArrayBuffer> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
    }

    // Decode the audio data
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    
    // Create buffer with correct sample rate
    const pcmBuffer = this.audioContext.createBuffer(
      1, // mono
      audioBuffer.duration * 16000,
      16000
    );

    // Get the audio data
    const inputData = audioBuffer.getChannelData(0);
    const outputData = pcmBuffer.getChannelData(0);

    // Resample the audio
    for (let i = 0; i < outputData.length; i++) {
      const index = Math.floor(i * audioBuffer.sampleRate / 16000);
      outputData[i] = inputData[index];
    }

    // Convert to 16-bit PCM
    const pcmData = new Int16Array(outputData.length);
    for (let i = 0; i < outputData.length; i++) {
      const s = Math.max(-1, Math.min(1, outputData[i]));
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    return pcmData.buffer;
  }

  static async initialize(onResponse: (text: string, audio?: ArrayBuffer) => void) {
    this.onResponseCallback = onResponse;
    
    try {
      // Initialize chat with audio capabilities
      this.chat = await model.startChat({
        history: [
          {
            role: "user",
            parts: [{
              text: "You are an MLB Voice Assistant. You help fans understand baseball by providing real-time insights, explanations, and context during live games. Keep responses concise and conversational. Focus on making complex baseball concepts accessible to new fans."
            }]
          }
        ],
      });
      console.log('Gemini chat initialized successfully');
    } catch (error) {
      console.error('Error initializing Gemini service:', error);
      throw error;
    }
  }

  static async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Got audio stream:', stream.id);
      
      // Always use WebM with Opus for recording
      const mimeType = 'audio/webm;codecs=opus';
      console.log('Using MIME type:', mimeType);
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Received audio chunk:', event.data.size, 'bytes');
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      console.log('Started recording');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  static async stopRecording(): Promise<AudioConfig> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          console.log('Recording stopped, processing chunks...');
          console.log('Total chunks:', this.audioChunks.length);
          
          const audioBlob = new Blob(this.audioChunks, { 
            type: this.mediaRecorder?.mimeType || 'audio/webm'
          });
          console.log('Created audio blob:', audioBlob.size, 'bytes');
          
          const arrayBuffer = await audioBlob.arrayBuffer();
          console.log('Converted to ArrayBuffer:', arrayBuffer.byteLength, 'bytes');
          
          resolve({
            audioData: arrayBuffer,
            mimeType: this.mediaRecorder?.mimeType || 'audio/webm'
          });
        } catch (error) {
          console.error('Error processing audio chunks:', error);
          reject(error);
        }
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  static async processVoiceCommand(audioConfig: AudioConfig, gameContext: GameContext) {
    try {
      console.log('Processing voice command...');
      console.log('Audio config:', {
        mimeType: audioConfig.mimeType,
        size: audioConfig.audioData.byteLength
      });

      // Convert to PCM format
      console.log('Converting to PCM format...');
      const pcmData = await this.convertToPCM(audioConfig.audioData);
      console.log('Converted to PCM, size:', pcmData.byteLength, 'bytes');

      // Convert ArrayBuffer to base64
      console.log('Converting to base64...');
      const base64String = this.arrayBufferToBase64(pcmData);
      console.log('Converted to base64, length:', base64String.length);

      // Process audio with game context
      const contextMessage = `
Current Game State:
- Inning: ${gameContext.inning}
- Count: ${gameContext.count.balls}-${gameContext.count.strikes}
- Outs: ${gameContext.outs}
- Bases: ${this.formatBases(gameContext.bases)}
- Score: ${gameContext.awayTeam.name} ${gameContext.awayTeam.score} - ${gameContext.homeTeam.name} ${gameContext.homeTeam.score}`;

      console.log('Sending audio and context to Gemini...');
      const result = await this.chat.sendMessage([
        {
          inlineData: {
            mimeType: 'audio/x-raw',  // Raw PCM audio
            data: base64String
          }
        },
        {
          text: contextMessage
        }
      ]);

      const response = await result.response;
      const responseText = response.text();
      const responseAudio = response.audio?.data;
      console.log('Got response:', responseText);

      // Call the response callback if available
      if (this.onResponseCallback) {
        this.onResponseCallback(responseText, responseAudio);
      }

      return responseText;
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw error;
    }
  }

  private static formatBases(bases: GameContext['bases']): string {
    const baseStatus = [];
    if (bases.first) baseStatus.push('1st');
    if (bases.second) baseStatus.push('2nd');
    if (bases.third) baseStatus.push('3rd');
    return baseStatus.length ? baseStatus.join(', ') : 'Empty';
  }

  static cleanup() {
    console.log('Cleaning up Gemini service');
    this.onResponseCallback = null;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
