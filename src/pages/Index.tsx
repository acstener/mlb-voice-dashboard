import React from 'react';
import GameCard from '@/components/GameCard';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import HeaderCard from '@/components/HeaderCard';

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-mlb-navy">
        <AppSidebar />
        <main className="flex-1">
          <div className="max-w-[1920px] mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-mlb-navy dark:text-white">Today's Games</h1>
            </div>
            
            <HeaderCard />
            
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;