import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic } from 'lucide-react';
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

  // MLB team IDs mapping
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
    <div className="flex h-screen bg-gray-50 dark:bg-mlb-navy/95">
      <AppSidebar />
      
      <main className="flex-1 flex flex-col min-h-0">
        {/* Game Stats Panel */}
        <div className="bg-white dark:bg-gray-800/30 border-b border-gray-200 dark:border-white/10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between gap-12">
              {/* Away Team */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center p-3">
                  <img 
                    src={getTeamLogo(awayTeam)}
                    alt={`${awayTeam} logo`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-600 dark:text-white/80">{awayTeam}</h3>
                  <p className="text-6xl font-bold text-mlb-red mt-1">3</p>
                </div>
              </div>

              {/* Game Info */}
              <div className="text-center flex-1">
                <div className="text-xl font-medium text-gray-500 dark:text-white/60 mb-4">{gameState.inning}</div>
                <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-400 dark:text-white/40 mb-1">BALLS</span>
                    <span className="text-2xl font-bold text-mlb-red">{gameState.count.balls}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-400 dark:text-white/40 mb-1">STRIKES</span>
                    <span className="text-2xl font-bold text-mlb-red">{gameState.count.strikes}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-400 dark:text-white/40 mb-1">OUTS</span>
                    <span className="text-2xl font-bold text-mlb-red">{gameState.outs}</span>
                  </div>
                </div>
              </div>

              {/* Home Team */}
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-600 dark:text-white/80">{homeTeam}</h3>
                  <p className="text-6xl font-bold text-mlb-red mt-1">5</p>
                </div>
                <div className="w-20 h-20 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center p-3">
                  <img 
                    src={getTeamLogo(homeTeam)}
                    alt={`${homeTeam} logo`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Assistant Section */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Ask anything about the game
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Use your voice to get real-time insights and stats
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
        <div className="flex-1 min-h-0 px-8 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live Timeline
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-6 pr-4">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className="relative pl-6 before:absolute before:left-0 before:top-[22px] before:-translate-y-1/2 before:w-2 before:h-2 before:bg-mlb-red before:rounded-full"
                >
                  <Card className="bg-white/50 dark:bg-white/5 border-0 p-4">
                    <div className="flex items-center justify-between mb-1">
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
