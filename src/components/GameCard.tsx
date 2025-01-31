import React from 'react';
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  homeTeam: string;
  awayTeam: string;
  time: string;
  isLive?: boolean;
  score?: {
    home: number;
    away: number;
  };
}

const GameCard = ({ homeTeam, awayTeam, time, isLive, score }: GameCardProps) => {
  const navigate = useNavigate();

  // MLB team IDs mapping (this would normally come from an API)
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
    <Card 
      className="p-6 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-mlb-navy relative overflow-hidden group"
      onClick={() => navigate(`/game/${homeTeam}-vs-${awayTeam}`)}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-mlb-red/10 px-3 py-1 rounded-full">
          <span className="h-2 w-2 rounded-full bg-mlb-red animate-pulse"></span>
          <span className="text-sm font-medium text-mlb-red">LIVE</span>
        </div>
      )}
      
      {/* Time */}
      <div className="mb-6">
        <span className="text-sm text-mlb-gray font-medium">{time}</span>
      </div>
      
      {/* Teams */}
      <div className="space-y-6">
        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center">
              <img 
                src={getTeamLogo(awayTeam)}
                alt={`${awayTeam} logo`}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <span className="font-semibold text-lg">{awayTeam}</span>
          </div>
          {score && (
            <span className="font-bold text-xl">{score.away}</span>
          )}
        </div>
        
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 dark:bg-mlb-navy/50 rounded-full flex items-center justify-center">
              <img 
                src={getTeamLogo(homeTeam)}
                alt={`${homeTeam} logo`}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <span className="font-semibold text-lg">{homeTeam}</span>
          </div>
          {score && (
            <span className="font-bold text-xl">{score.home}</span>
          )}
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-mlb-red/0 to-mlb-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
};

export default GameCard;