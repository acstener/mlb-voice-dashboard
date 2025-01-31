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

  const getTeamLogo = (teamName: string) => {
    // This would normally fetch from an API - using placeholder for now
    return `https://www.mlbstatic.com/team-logos/${teamName.toLowerCase()}.svg`;
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