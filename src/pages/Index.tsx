import React from 'react';
import GameCard from '@/components/GameCard';

const Index = () => {
  // Mock data - in real app this would come from an API
  const games = [
    {
      homeTeam: "Yankees",
      awayTeam: "Red Sox",
      time: "Now",
      isLive: true,
      score: { home: 3, away: 2 }
    },
    {
      homeTeam: "Dodgers",
      awayTeam: "Giants",
      time: "7:05 PM",
      isLive: false
    },
    {
      homeTeam: "Cubs",
      awayTeam: "Cardinals",
      time: "8:10 PM",
      isLive: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mlb-navy p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-mlb-navy dark:text-white">MLB Games</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <GameCard
              key={index}
              homeTeam={game.homeTeam}
              awayTeam={game.awayTeam}
              time={game.time}
              isLive={game.isLive}
              score={game.score}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;