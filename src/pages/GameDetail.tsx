import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Circle } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

const GameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  // Mock timeline data
  const timelineEvents = [
    { time: "19:42", event: "Strike swinging", player: "Mike Trout", details: "87 MPH Slider" },
    { time: "19:40", event: "Ball", player: "Mike Trout", details: "Outside fastball" },
    { time: "19:38", event: "Foul Ball", player: "Mike Trout", details: "95 MPH Fastball" },
    { time: "19:35", event: "Pitching Change", player: "Yankees", details: "G. Cole replaces N. Cortes" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-mlb-navy">
      <AppSidebar />
      
      <main className="flex-1">
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-mlb-navy dark:text-white">
                {gameId?.replace('-vs-', ' vs ')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Ask anything about the game
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-mlb-red hover:bg-mlb-red/90 text-white"
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Speaking
            </Button>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-mlb-navy dark:text-white">
              Live Timeline
            </h2>
            <div className="flex items-center gap-2">
              <Circle className="h-2.5 w-2.5 text-green-500 animate-pulse" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className="relative pl-6 border-l-2 border-gray-200 dark:border-white/10"
                >
                  <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-mlb-red ring-4 ring-white dark:ring-mlb-navy" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-mlb-red">
                        {event.time}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {event.player}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {event.event}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {event.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default GameDetail;