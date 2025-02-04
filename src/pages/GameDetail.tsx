import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { VoiceAssistantPortal } from '@/components/VoiceAssistantPortal';
import { useGameState } from '@/components/GameStateController';
import { PlayTooltip } from '@/components/PlayTooltip';

const DEMO_PLAYS = [
  {
    inning: 1,
    inningHalf: 'top',
    description: 'Masataka Yoshida leads off with a single to right field',
    player: 'Masataka Yoshida',
    type: 'single'
  },
  {
    inning: 1,
    inningHalf: 'top',
    description: 'Gerrit Cole strikes out Rafael Devers on three pitches',
    player: 'Gerrit Cole',
    type: 'strikeout'
  },
  {
    inning: 1,
    inningHalf: 'top',
    description: 'Justin Turner grounds into a 6-4-3 double play',
    player: 'Justin Turner',
    type: 'double_play'
  },
  {
    inning: 1,
    inningHalf: 'bottom',
    description: 'Aaron Judge crushes a solo home run to Monument Park!',
    player: 'Aaron Judge',
    type: 'home_run'
  },
  {
    inning: 1,
    inningHalf: 'bottom',
    description: 'Chris Sale gets Giancarlo Stanton looking on a slider away',
    player: 'Chris Sale',
    type: 'strikeout'
  },
  {
    inning: 1,
    inningHalf: 'bottom',
    description: 'Anthony Rizzo grounds out to second base',
    player: 'Anthony Rizzo',
    type: 'groundout'
  }
];

const GameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { gameState, updateGameState, triggerScenario } = useGameState();

  React.useEffect(() => {
    // Add each play every 30 seconds
    DEMO_PLAYS.forEach((play, index) => {
      setTimeout(() => {
        updateGameState(prevState => ({
          ...prevState,
          plays: [...(prevState.plays || []), play]
        }));
      }, index * 30000); // 30 seconds between each play
    });
  }, []);

  const timelineEvents = (gameState.plays || []).map(play => ({
    inning: `${play.inning} ${play.inningHalf}`,
    event: play.description,
    player: play.player,
    details: play.type
  }));

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-mlb-navy/95">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Game Stats Panel */}
        <div className="relative overflow-hidden">
          {/* Gemini-inspired gradient background */}
          <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-purple-500/20 to-blue-600/20 dark:from-blue-600/30 dark:via-purple-500/30 dark:to-blue-600/30 opacity-40 dark:opacity-60 blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/10 to-blue-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-blue-500/20 opacity-40 dark:opacity-60"></div>
          
          <div className="relative border-b border-gray-200 dark:border-white/10">
            <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 flex items-center justify-between gap-8 lg:gap-16">
              {/* Away Team */}
              <div className="flex-1">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-white to-gray-100 dark:from-mlb-navy/80 dark:to-mlb-navy/40 rounded-xl lg:rounded-2xl flex items-center justify-center p-3 lg:p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                    <img 
                      src={gameState.teams.away.team.id === 111 
                        ? '/team-logos/RedSoxPrimary_HangingSocks.svg.png'
                        : '/team-logos/New_York_Yankees_logo.png'}
                      alt={`${gameState.teams.away.team.name} logo`}
                      className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold dark:text-white mb-1">{gameState.teams.away.team.name}</h2>
                    <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {gameState.teams.away.score}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ({gameState.teams.away.team.leagueRecord?.wins}-{gameState.teams.away.team.leagueRecord?.losses})
                    </p>
                  </div>
                </div>
              </div>

              {/* Game Info - Baseball Scorecard Style */}
              <div className="px-8 lg:px-10 py-5 lg:py-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                {/* Inning Display with Live Indicator */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 font-mono tracking-tight">
                    <span className="mr-2">{gameState.currentPlay?.inning}</span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <span className="ml-2 uppercase">{gameState.currentPlay?.inningHalf}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 dark:bg-green-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">LIVE</span>
                  </div>
                </div>

                {/* Game Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Outs */}
                  <div className="text-center p-2 lg:p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Outs</div>
                    <div className="flex items-center justify-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${gameState.currentPlay?.outs && gameState.currentPlay?.outs >= 1 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <div className={`w-2.5 h-2.5 rounded-full ${gameState.currentPlay?.outs && gameState.currentPlay?.outs >= 2 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    </div>
                  </div>
                  {/* Count */}
                  <div className="text-center p-2 lg:p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Count</div>
                    <div className="font-mono text-base font-bold text-gray-800 dark:text-gray-200">
                      {gameState.currentPlay?.balls}-{gameState.currentPlay?.strikes}
                    </div>
                  </div>
                </div>
              </div>

              {/* Home Team */}
              <div className="flex-1">
                <div className="flex items-center justify-end gap-4 lg:gap-6">
                  <div className="text-right">
                    <h2 className="text-xl lg:text-2xl font-bold dark:text-white mb-1">{gameState.teams.home.team.name}</h2>
                    <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {gameState.teams.home.score}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ({gameState.teams.home.team.leagueRecord?.wins}-{gameState.teams.home.team.leagueRecord?.losses})
                    </p>
                  </div>
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-white to-gray-100 dark:from-mlb-navy/80 dark:to-mlb-navy/40 rounded-xl lg:rounded-2xl flex items-center justify-center p-3 lg:p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                    <img 
                      src={gameState.teams.home.team.id === 147 
                        ? '/team-logos/New_York_Yankees_logo.png'
                        : '/team-logos/RedSoxPrimary_HangingSocks.svg.png'}
                      alt={`${gameState.teams.home.team.name} logo`}
                      className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Game Timeline */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="container mx-auto px-6 lg:px-12 py-12">
              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold dark:text-white">Game Timeline</h2>
                  {timelineEvents.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-red-500">LIVE</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div 
                      key={index} 
                      className={`
                        flex items-start gap-4 pl-4 relative 
                        ${index === 0 ? 'bg-green-50 dark:bg-green-900/10 rounded-lg p-4 animate-fade-in' : 'border-l-2 border-gray-200 dark:border-gray-700'}
                      `}
                    >
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 w-24 uppercase">
                        {event.inning} {event.inningHalf}
                      </div>
                      <div className="flex-1">
                        <PlayTooltip 
                          play={{
                            type: event.details,
                            description: event.event,
                            player: event.player,
                            inning: parseInt(event.inning.split(' ')[0]),
                            inningHalf: event.inning.split(' ')[1] as 'top' | 'bottom'
                          }} 
                          className="text-gray-900 dark:text-white font-medium"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {event.player}
                        </p>
                      </div>
                      {index === 0 && (
                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Voice Assistant */}
        <VoiceAssistantPortal gameState={gameState} />
      </main>
    </div>
  );
};

export default GameDetail;