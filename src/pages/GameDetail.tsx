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
    // ... more events would be added here in a real implementation
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-mlb-navy">
      <AppSidebar />
      
      <main className="flex-1 p-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        {/* Voice Assistant Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-mlb-navy dark:text-white">
                {gameId?.replace('-vs-', ' vs ')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Ask anything about the game
              </p>
            </div>
            <Button size="lg" className="bg-mlb-red hover:bg-mlb-red/90">
              <Mic className="mr-2 h-5 w-5" />
              Start Speaking
            </Button>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-mlb-navy dark:text-white">
              Live Timeline
            </h2>
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 text-green-500 animate-pulse" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
            </div>
          </div>
          
          <ScrollArea className="h-[600px]">
            <div className="p-4">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className="relative pl-4 pb-8 last:pb-0 border-l border-gray-200 dark:border-gray-700 ml-4"
                >
                  <div className="absolute left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-mlb-red" />
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
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