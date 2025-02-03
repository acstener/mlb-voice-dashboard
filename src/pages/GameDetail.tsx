import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { VoiceAssistantPortal } from '@/components/VoiceAssistantPortal';
import { useGameState } from '@/components/GameStateController';

const GameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { gameState, updateGameState, triggerScenario } = useGameState();

  // Convert plays to timeline events
  const timelineEvents = [
    // Current plays from game state
    ...(gameState.plays || []).map(play => ({
      time: new Date(play.timestamp).toLocaleTimeString(),
      event: play.description,
      player: play.player,
      details: play.type
    })),
    // Static historical events
    { time: "19:42", event: "Strike swinging", player: "Mike Trout", details: "87 MPH Slider" },
    { time: "19:40", event: "Ball", player: "Mike Trout", details: "Outside fastball" },
    { time: "19:38", event: "Foul Ball", player: "Mike Trout", details: "95 MPH Fastball" },
    { time: "19:35", event: "Pitching Change", player: "Yankees", details: "G. Cole replaces N. Cortes" },
  ];

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-mlb-navy/95">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Game Stats Panel */}
        <div className="bg-white dark:bg-gray-800/30 border-b border-gray-200 dark:border-white/10 w-full">
          <div className="px-48 py-24 flex items-center justify-between gap-12">
            {/* Away Team */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center p-3">
                <img 
                  src={`/team-logos/${gameState.teams.away.team.id}.svg`}
                  alt={`${gameState.teams.away.team.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{gameState.teams.away.team.name}</h2>
                <p className="text-4xl font-bold dark:text-white">{gameState.teams.away.score}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ({gameState.teams.away.team.leagueRecord?.wins}-{gameState.teams.away.team.leagueRecord?.losses})
                </p>
              </div>
            </div>

            {/* Game Info */}
            <div className="text-center dark:text-white">
              <div className="text-lg font-semibold mb-2">
                Inning {gameState.currentPlay?.inning} {gameState.currentPlay?.inningHalf}
              </div>
              <div className="flex gap-4 justify-center text-sm">
                <span>Outs: {gameState.currentPlay?.outs}</span>
                <span>Count: {gameState.currentPlay?.balls}-{gameState.currentPlay?.strikes}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {gameState.venue.name}
              </div>
            </div>

            {/* Home Team */}
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{gameState.teams.home.team.name}</h2>
                <p className="text-4xl font-bold dark:text-white">{gameState.teams.home.score}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ({gameState.teams.home.team.leagueRecord?.wins}-{gameState.teams.home.team.leagueRecord?.losses})
                </p>
              </div>
              <div className="w-20 h-20 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center p-3">
                <img 
                  src={`/team-logos/${gameState.teams.home.team.id}.svg`}
                  alt={`${gameState.teams.home.team.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="px-48 py-4 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => triggerScenario('homeRun')}
              className="dark:text-white"
            >
              Trigger Home Run
            </Button>
            <Button
              variant="outline"
              onClick={() => triggerScenario('strikeout')}
              className="dark:text-white"
            >
              Trigger Strikeout
            </Button>
            <Button
              variant="outline"
              onClick={() => triggerScenario('doublePlay')}
              className="dark:text-white"
            >
              Trigger Double Play
            </Button>
          </div>
        </div>

        {/* Timeline Section */}
        <ScrollArea className="flex-1">
          <div className="px-48 py-8">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Game Timeline</h3>
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <Card key={index} className="p-4 dark:bg-gray-800/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium dark:text-white">{event.event}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.player}</p>
                      {event.details && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{event.details}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{event.time}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>

        <VoiceAssistantPortal />
      </main>
    </div>
  );
};

export default GameDetail;