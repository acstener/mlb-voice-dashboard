import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic } from 'lucide-react';

const GameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mlb-navy">
      <div className="max-w-7xl mx-auto p-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-mlb-navy dark:text-white">
            {gameId?.replace('-vs-', ' vs ')}
          </h1>

          <div className="flex justify-center mt-8">
            <Button className="bg-mlb-red hover:bg-mlb-red/90">
              <Mic className="mr-2 h-4 w-4" />
              Ask Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;