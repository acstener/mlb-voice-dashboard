import React, { useState, useEffect, useRef } from 'react';

interface Play {
  description: string;
  type: string;
  player: string;
  inning: number;
  inningHalf: string;
}

interface PlayTooltipProps {
  play: Play;
  className?: string;
}

// Separate components for better organization
const LoadingState = () => (
  <div className="flex flex-col items-start space-y-3">
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-100" />
      <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-200" />
    </div>
    <div className="flex items-center space-x-2">
      <div className="animate-spin h-4 w-4 rounded-full border-2 border-white/20 border-t-white/80" />
      <div className="text-white/70 text-xs font-medium">AI is analyzing this play...</div>
    </div>
  </div>
);

const formatExplanation = (text: string) => {
  // Split by asterisks and map each part
  const parts = text.split(/\*(.*?)\*/);
  return parts.map((part, index) => {
    // Every odd index was between asterisks
    return index % 2 === 1 ? (
      <span key={index} className="font-bold text-white">{part}</span>
    ) : part;
  });
};

const AnalysisContent = ({ play, explanation }: { play: Play; explanation: string }) => (
  <div className="animate-fadeIn space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="text-white/60 text-xs font-medium tracking-wider">REAL-TIME ANALYSIS</div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      </div>
    </div>
    
    <div className="text-white/90 font-medium leading-relaxed">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 font-semibold">
        {play.player}'s {play.type}
      </span>
      <br />
      {formatExplanation(explanation)}
    </div>
    
    <div className="pt-2 flex items-center space-x-2 text-xs text-white/40">
      <span>Inning {play.inning} {play.inningHalf}</span>
      <span>•</span>
      <span>Powered by Gemini</span>
    </div>
  </div>
);

const InfoIcon = () => (
  <svg className="w-3.5 h-3.5 text-purple-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.25 12h5.5M12 9.25v5.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// WebSocket singleton for connection reuse
class WebSocketManager {
  private static instance: WebSocket | null = null;
  private static explanationCache = new Map<string, string>();

  static getConnection(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if (this.instance?.readyState === WebSocket.OPEN) {
        resolve(this.instance);
        return;
      }

      const ws = new WebSocket('ws://localhost:8765');
      ws.addEventListener('open', () => {
        this.instance = ws;
        resolve(ws);
      });
      ws.addEventListener('error', reject);
    });
  }

  static getCachedExplanation(key: string): string | undefined {
    return this.explanationCache.get(key);
  }

  static setCachedExplanation(key: string, value: string): void {
    this.explanationCache.set(key, value);
  }
}

export const PlayTooltip: React.FC<PlayTooltipProps> = ({ play, className }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket>();
  const [hasStartedFetch, setHasStartedFetch] = useState(false);

  const handleHover = () => {
    if (hasStartedFetch) return; // Only fetch once
    setHasStartedFetch(true);

    const getExplanation = async () => {
      const cachedExplanation = WebSocketManager.getCachedExplanation(play.description);
      if (cachedExplanation) {
        setExplanation(cachedExplanation);
        return;
      }

      try {
        setIsLoading(true);
        const ws = await WebSocketManager.getConnection();
        wsRef.current = ws;

        const handleMessage = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.type === 'explanation') {
            setExplanation(data.content);
            WebSocketManager.setCachedExplanation(play.description, data.content);
            setIsLoading(false);
          }
        };

        const handleError = () => {
          setExplanation('Failed to get explanation');
          setIsLoading(false);
        };

        ws.addEventListener('message', handleMessage);
        ws.addEventListener('error', handleError);

        ws.send(JSON.stringify({
          type: 'explain_play',
          content: play.description,
          play_type: play.type
        }));

        return () => {
          ws.removeEventListener('message', handleMessage);
          ws.removeEventListener('error', handleError);
        };
      } catch (error) {
        setExplanation('Failed to get explanation');
        setIsLoading(false);
      }
    };

    if (play.description) {
      getExplanation();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1">{play.description}</div>
      
      <div className="group/tooltip relative shrink-0" onMouseEnter={handleHover}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-fuchsia-500/5 
          flex items-center justify-center cursor-help border border-purple-300/10 backdrop-blur-sm
          transition-all duration-200 hover:scale-105 hover:from-blue-500/10 hover:via-purple-500/10 hover:to-fuchsia-500/10 
          hover:border-purple-300/20 hover:shadow-lg hover:shadow-purple-500/5">
          <InfoIcon />
        </div>

        <div className="invisible group-hover/tooltip:visible absolute z-50 w-96 p-6 text-sm rounded-2xl shadow-2xl 
          transition-all duration-200 origin-right transform opacity-0 translate-x-2 scale-95
          group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 group-hover/tooltip:scale-100
          right-full top-1/2 -translate-y-1/2 mr-4
          bg-gradient-to-br from-blue-600/95 via-purple-600/95 to-fuchsia-600/95 backdrop-blur-xl border border-white/10">
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 rounded-sm
            bg-gradient-to-br from-blue-600/95 via-purple-600/95 to-fuchsia-600/95 border-r border-t border-white/10" />
          
          <div className="relative">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              <div className="text-white/40 text-[10px] font-medium tracking-wider">AI BETA</div>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                <LoadingState />
              ) : (
                <AnalysisContent play={play} explanation={explanation} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}