import React, { useEffect } from 'react';

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      }, HTMLElement>;
    }
  }
}

export const ElevenLabsWidget: React.FC = () => {
  useEffect(() => {
    // Add the script to the head to ensure it loads first
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <elevenlabs-convai agent-id="jZhTKu0fL6HoHd843JXZ"></elevenlabs-convai>
    </div>
  );
};
