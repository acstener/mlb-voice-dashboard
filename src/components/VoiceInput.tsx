import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const VoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState('');
  const recognition = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

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
          const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
            body: { prompt: transcript },
          });

          if (error) throw error;

          setResponse(data.generatedText);
          toast({
            title: "Success",
            description: "Response generated successfully",
          });
        } catch (error) {
          console.error('Error calling Gemini API:', error);
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
      <div className="flex justify-center">
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