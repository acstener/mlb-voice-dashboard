import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Circle } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

const GameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  // Mock game state data
  const gameState = {
    inning: "Top 6th",
    count: { balls: 2, strikes: 1 },
    outs: 1,
    bases: { first: true, second: false, third: true },
    pitchCount: { current: 72, total: 89 },
  };

  // Mock timeline data
  const timelineEvents = [
    { time: "19:42", event: "Strike swinging", player: "Mike Trout", details: "87 MPH Slider" },
    { time: "19:40", event: "Ball", player: "Mike Trout", details: "Outside fastball" },
    { time: "19:38", event: "Foul Ball", player: "Mike Trout", details: "95 MPH Fastball" },
    { time: "19:35", event: "Pitching Change", player: "Yankees", details: "G. Cole replaces N. Cortes" },
  ];

  // Parse team names from gameId
  const [homeTeam, awayTeam] = gameId?.split('-vs-') || ['', ''];

  // MLB team IDs mapping (reusing from GameCard component)
  const teamIds: { [key: string]: number } = {
    "Yankees": 147,
    "Red Sox": 111,
    "Dodgers": 119,
    "Giants": 137,
    "Cubs": 112,
    "Cardinals": 138,
    "Mets": 121,
    "Braves": 144,
    "Astros": 117,
    "Rangers": 140,
    "Blue Jays": 141,
    "Orioles": 110,
    "Phillies": 143,
    "Nationals": 120,
    "Marlins": 146,
    "Padres": 135,
    "Angels": 108,
    "Athletics": 133,
    "Mariners": 136,
    "Rays": 139,
    "Tigers": 116,
    "Twins": 142,
    "White Sox": 145,
    "Royals": 118,
    "Pirates": 134,
    "Brewers": 158,
    "Reds": 113,
    "Rockies": 115,
    "Diamondbacks": 109,
    "Guardians": 114,
  };

  const getTeamLogo = (teamName: string) => {
    const teamId = teamIds[teamName];
    if (!teamId) {
      console.warn(`No team ID found for ${teamName}`);
      return '/placeholder.svg';
    }
    return `https://www.mlbstatic.com/team-logos/${teamId}.svg`;
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-mlb-navy overflow-hidden">
      <AppSidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Game Stats Panel */}
        <div className="bg-white dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Away Team */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center p-2">
                  <img 
                    src={getTeamLogo(awayTeam)}
                    alt={`${awayTeam} logo`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{awayTeam}</h3>
                  <p className="text-4xl font-bold text-mlb-red">3</p>
                </div>
              </div>

              {/* Game Info */}
              <div className="text-center">
                <div className="text-lg font-semibold text-mlb-gray mb-2">{gameState.inning}</div>
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <span className="font-medium">B</span>
                    <span className="text-mlb-red ml-1">{gameState.count.balls}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">S</span>
                    <span className="text-mlb-red ml-1">{gameState.count.strikes}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">O</span>
                    <span className="text-mlb-red ml-1">{gameState.outs}</span>
                  </div>
                </div>
              </div>

              {/* Home Team */}
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{homeTeam}</h3>
                  <p className="text-4xl font-bold text-mlb-red">5</p>
                </div>
                <div className="w-16 h-16 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center p-2">
                  <img 
                    src={getTeamLogo(homeTeam)}
                    alt={`${homeTeam} logo`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Base runners visualization */}
            <div className="flex justify-center mt-4">
              <div className="relative w-24 h-24">
                {/* Home plate */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-gray-400 rotate-45" />
                {/* First base */}
                <div className={`absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 ${gameState.bases.first ? 'bg-mlb-red' : 'border-2 border-gray-400'}`} />
                {/* Second base */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${gameState.bases.second ? 'bg-mlb-red' : 'border-2 border-gray-400'}`} />
                {/* Third base */}
                <div className={`absolute top-1/2 left-0 w-4 h-4 -translate-y-1/2 ${gameState.bases.third ? 'bg-mlb-red' : 'border-2 border-gray-400'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Assistant Section */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10">
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
        <div className="flex-1 overflow-hidden px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-mlb-navy dark:text-white">
              Live Timeline
            </h2>
            <div className="flex items-center gap-2">
              <Circle className="h-2.5 w-2.5 text-green-500 animate-pulse" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-280px)] w-full pr-4">
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className="relative pl-6 border-l-2 border-gray-200 dark:border-white/10"
                >
                  <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-mlb-red ring-4 ring-white dark:ring-mlb-navy" />
                  <Card className="bg-white dark:bg-gray-800/50 p-4">
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
                  </Card>
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
