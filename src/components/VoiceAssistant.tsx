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
    <Card className="p-4 bg-white dark:bg-gray-800/30 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Status: {isConnected ? 
              <span className="text-green-500">Connected</span> : 
              <span className="text-red-500">Disconnected</span>
            }
          </span>
        </div>

        <div className="h-[200px] overflow-y-auto p-4 space-y-4 border rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendText}
            disabled={!isConnected || !textInput.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
