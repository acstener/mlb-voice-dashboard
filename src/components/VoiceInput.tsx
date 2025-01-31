import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [response, setResponse] = useState('');
  const recognition = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef(new Audio());
  const { toast } = useToast();

  const generateSpeech = async (text: string) => {
    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL', name: 'en-US-Neural2-C' },
          audioConfig: { 
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const { audioContent } = await response.json();
      return audioContent;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  };

  const playAudio = async (text: string) => {
    try {
      setIsPlaying(true);
      const audioContent = await generateSpeech(text);
      if (audioRef.current) {
        audioRef.current.src = `data:audio/mp3;base64,${audioContent}`;
        audioRef.current.onended = () => setIsPlaying(false);
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Failed to play audio response",
        variant: "destructive",
      });
    }
  };

  const startListening = () => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        toast({
          title: "Error",
          description: "Speech recognition is not supported in your browser",
          variant: "destructive",
        });
        return;
      }

      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      };

      recognition.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setIsProcessing(true);

        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: transcript }]
              }]
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate AI response');
          }

          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
          
          setResponse(generatedText);
          await playAudio(generatedText);

          toast({
            title: "Success",
            description: "Response generated successfully",
          });
        } catch (error) {
          console.error('Error generating response:', error);
          toast({
            title: "Error",
            description: "Failed to generate response",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "Failed to recognize speech",
          variant: "destructive",
        });
      };

      recognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Button
          size="lg"
          className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-mlb-red hover:bg-mlb-red/90'} text-white`}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : isListening ? (
            <>
              <MicOff className="mr-2 h-5 w-5" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Start Speaking
            </>
          )}
        </Button>

        {response && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => playAudio(response)}
            disabled={isPlaying}
            className="bg-white/10"
          >
            <Volume2 className="mr-2 h-5 w-5" />
            {isPlaying ? 'Playing...' : 'Play Response'}
          </Button>
        )}
      </div>

      {response && (
        <div className="mt-4 p-4 bg-white/50 dark:bg-white/5 rounded-lg">
          <h3 className="font-semibold mb-2">AI Response:</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};