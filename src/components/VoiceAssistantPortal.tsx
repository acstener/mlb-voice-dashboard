import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { VoiceAssistant } from './VoiceAssistant';
import type { GameState } from '@/types/game';

interface VoiceAssistantPortalProps {
  gameState: GameState;
  onVoiceCommand?: (command: string) => void;
}

export const VoiceAssistantPortal: React.FC<VoiceAssistantPortalProps> = ({ gameState, onVoiceCommand }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create portal container if it doesn't exist
    let container = document.getElementById('voice-assistant-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'voice-assistant-portal';
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Cleanup on unmount
      if (container && container.parentElement) {
        container.parentElement.removeChild(container);
      }
    };
  }, []);

  if (!portalContainer) return null;

  return createPortal(
    <div className="fixed bottom-8 right-8 w-96 z-50">
      <VoiceAssistant gameContext={gameState} onVoiceCommand={onVoiceCommand} />
    </div>,
    portalContainer
  );
};
