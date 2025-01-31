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

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-mlb-navy"
      onClick={() => navigate(`/game/${homeTeam}-vs-${awayTeam}`)}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-mlb-gray">{time}</span>
        {isLive && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-mlb-red animate-pulse"></span>
            <span className="text-sm font-medium text-mlb-red">LIVE</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{awayTeam}</span>
          {score && <span className="font-bold">{score.away}</span>}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">{homeTeam}</span>
          {score && <span className="font-bold">{score.home}</span>}
        </div>
      </div>
    </Card>
  );
};

export default GameCard;