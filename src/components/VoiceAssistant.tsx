import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface VoiceAssistantProps {
  gameContext?: any;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ gameContext }) => {
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant', content: string }>>([]);
  const [textInput, setTextInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Debug gameContext changes
  useEffect(() => {
    console.log('GameContext updated:', gameContext);
  }, [gameContext]);

  useEffect(() => {
    console.log('Attempting to connect to WebSocket...');
    // Initialize WebSocket connection
    wsRef.current = new WebSocket('ws://localhost:8765');

    wsRef.current.onopen = () => {
      console.log('WebSocket connected successfully');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'text') {
          setMessages(prev => [...prev, { type: 'assistant', content: data.content }]);
        } else if (data.type === 'error') {
          console.error('Server error:', data.content);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
    };

    return () => {
      console.log('Cleaning up WebSocket connection');
      wsRef.current?.close();
    };
  }, []);

  const handleSendText = () => {
    if (textInput.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Sending message:', textInput);
      console.log('Current gameContext:', gameContext);
      
      // Add user message to chat
      setMessages(prev => [...prev, { type: 'user', content: textInput }]);
      
      try {
        // Send to server with game context
        wsRef.current.send(JSON.stringify({
          content: textInput,
          gameContext: gameContext || {} // Ensure we always send an object
        }));
        console.log('Message sent successfully');
        
        // Clear input
        setTextInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.log('Cannot send message:', {
        textInput: Boolean(textInput.trim()),
        readyState: wsRef.current?.readyState,
        OPEN: WebSocket.OPEN
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="relative p-4 bg-white/50 dark:bg-gray-800/30 shadow-lg backdrop-blur-sm overflow-hidden mb-4 w-[400px]">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-blue-500/10"></div>
          
          <div className="relative flex flex-col gap-4">
            {/* Close button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        <div className="h-[300px] overflow-y-auto px-4 py-6 space-y-4 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {message.type === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                  AI
                </div>
              )}
              <div
                className={`relative max-w-[80%] p-3 rounded-2xl ${message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 shadow-sm'} 
                  ${message.type === 'assistant' ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
              >
                <div className="text-sm">{message.content}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder="Ask me about the game..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
          />
          <Button
            onClick={handleSendText}
            disabled={!isConnected || !textInput.trim()}
            size="icon"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
          >
            <Send className="h-4 w-4" />
          </Button>
          </div>
        </div>
      </Card>
      )}

      {/* Baseball AI Avatar Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group"
          aria-label="Open AI Assistant"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg ring-1 ring-white/20 cursor-pointer hover:shadow-blue-500/25 transition-all duration-300">
            <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
                {/* Baseball stitching */}
                <path 
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                />
                <path 
                  d="M7 12c0 0 2.5 2 5 2s5-2 5-2M7 12c0 0 2.5-2 5-2s5 2 5 2" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
                {/* Circuit lines */}
                <path 
                  d="M12 7v2M12 15v2M9 12H7M17 12h-2" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
                {/* Center dot */}
                <circle 
                  cx="12" 
                  cy="12" 
                  r="2" 
                  fill="currentColor"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
