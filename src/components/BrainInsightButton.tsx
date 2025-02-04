import React from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BrainInsightButtonProps {
  className?: string;
  gameContext?: string;
}

export const BrainInsightButton: React.FC<BrainInsightButtonProps> = ({ 
  className,
  gameContext = "In this intense Yankees-Red Sox matchup, Gerrit Cole's first-inning performance against Rafael Devers showcases a fascinating pattern. Cole's ability to strike out Devers on just three pitches demonstrates his elite pitch sequencing, especially considering Devers' career .289 batting average against fastballs. This early dominance sets the tone for the Yankees' defensive strategy."
}) => {
  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="group relative h-8 w-8 rounded-full overflow-hidden hover:w-56 transition-all duration-300 ease-in-out bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-500/10 hover:border-purple-500/20 dark:border-purple-500/20 dark:hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="absolute inset-0 w-8 h-8 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-500/40 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
            <span className="absolute left-10 text-xs font-medium text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              MLB Big Brain Energy
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border-0 shadow-2xl shadow-blue-500/10">
          {/* Gemini-style gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-white rounded-3xl opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-blue-100/20 via-purple-100/20 to-transparent rounded-3xl opacity-30" />
          <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2 tracking-tight">
              MLB Big Brain Energy
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed">
                Want to casually drop some expert-level baseball knowledge? Here's your moment to shine...
              </p>
              <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-xl">
                  <span role="img" aria-label="target" className="text-lg">🎯</span>
                </div>
                <p className="text-sm text-blue-700">
                  Pro Tip: Deliver this insight while casually reaching for chips. The more nonchalant, the better.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => {
                const button = document.getElementById('generate-insight-btn');
                if (button) {
                  button.textContent = 'Analyzing game data...';
                  button.disabled = true;
                  
                  // Simulate loading state
                  setTimeout(() => {
                    const insightElement = document.getElementById('insight-content');
                    if (insightElement) {
                      insightElement.textContent = gameContext;
                    }
                    if (button) {
                      button.textContent = 'Generate Another Insight';
                      button.disabled = false;
                    }
                  }, 2000);
                }
              }} 
              id="generate-insight-btn"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium tracking-wide py-6 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
            >
              Generate Insight
            </Button>
            <div 
              id="insight-content"
              className="min-h-[100px] p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 text-gray-600 text-sm leading-relaxed shadow-sm"
            />
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
