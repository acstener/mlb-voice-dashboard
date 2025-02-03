import React, { createContext, useContext, useState } from 'react';
import { GameState, Team } from '../types/game';

// Initial game state matching MLB data structure
const initialGameState: GameState = {
  gamePk: 1,
  gameDate: new Date().toISOString(),
  status: {
    abstractGameState: 'Live',
    detailedState: 'In Progress'
  },
  teams: {
    away: {
      team: {
        id: 111,
        name: 'Red Sox',
        score: 0,
        leagueRecord: {
          wins: 76,
          losses: 60,
          pct: '.559'
        }
      },
      score: 0,
      isWinner: false
    },
    home: {
      team: {
        id: 147,
        name: 'Yankees',
        score: 0,
        leagueRecord: {
          wins: 70,
          losses: 66,
          pct: '.515'
        }
      },
      score: 0,
      isWinner: false
    }
  },
  venue: {
    id: 3313,
    name: 'Yankee Stadium'
  },
  currentPlay: {
    inning: 1,
    inningHalf: 'top',
    outs: 0,
    balls: 0,
    strikes: 0
  },
  plays: [] // Array to store play history
};

// Pre-defined scenarios
const scenarios = {
  homeRun: {
    description: 'Judge hits 3-run homer',
    action: (state: GameState) => {
      const play = {
        type: 'home_run',
        description: 'Aaron Judge hits a 3-run home run to deep center field!',
        player: 'Aaron Judge',
        timestamp: new Date().toISOString()
      };
      
      return {
        ...state,
        teams: {
          ...state.teams,
          home: {
            ...state.teams.home,
            score: state.teams.home.score + 3
          }
        },
        plays: [play, ...(state.plays || [])]
      };
    }
  },
  strikeout: {
    description: 'Cole strikes out Devers',
    action: (state: GameState) => {
      const play = {
        type: 'strikeout',
        description: 'Gerrit Cole strikes out Rafael Devers swinging!',
        player: 'Gerrit Cole',
        timestamp: new Date().toISOString()
      };
      
      return {
        ...state,
        currentPlay: {
          ...state.currentPlay!,
          outs: (state.currentPlay?.outs || 0) + 1,
          strikes: 0,
          balls: 0
        },
        plays: [play, ...(state.plays || [])]
      };
    }
  },
  doublePlay: {
    description: 'Torres to Rizzo',
    action: (state: GameState) => {
      const play = {
        type: 'double_play',
        description: 'Torres fields, throws to Rizzo for the double play!',
        player: 'Gleyber Torres',
        timestamp: new Date().toISOString()
      };
      
      return {
        ...state,
        currentPlay: {
          ...state.currentPlay!,
          outs: Math.min((state.currentPlay?.outs || 0) + 2, 3),
        },
        plays: [play, ...(state.plays || [])]
      };
    }
  }
};

// Create context
type GameStateContextType = {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  triggerScenario: (scenarioKey: keyof typeof scenarios) => void;
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// Custom hook for using game state
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

// Provider component
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(current => ({ ...current, ...updates }));
  };

  const advanceInning = () => {
    setGameState(current => ({
      ...current,
      currentPlay: {
        ...current.currentPlay!,
        inning: current.currentPlay?.inningHalf === 'bottom' ? (current.currentPlay.inning + 1) : current.currentPlay!.inning,
        inningHalf: current.currentPlay?.inningHalf === 'top' ? 'bottom' : 'top',
        outs: 0,
        balls: 0,
        strikes: 0
      }
    }));
  };

  const addOut = () => {
    setGameState(current => {
      const newOuts = (current.currentPlay?.outs || 0) + 1;
      if (newOuts >= 3) {
        return {
          ...current,
          currentPlay: {
            ...current.currentPlay!,
            outs: 0,
            balls: 0,
            strikes: 0,
            inning: current.currentPlay?.inningHalf === 'bottom' ? (current.currentPlay.inning + 1) : current.currentPlay!.inning,
            inningHalf: current.currentPlay?.inningHalf === 'top' ? 'bottom' : 'top'
          }
        };
      }
      return {
        ...current,
        currentPlay: {
          ...current.currentPlay!,
          outs: newOuts
        }
      };
    });
  };

  const triggerScenario = (scenarioKey: keyof typeof scenarios) => {
    const scenario = scenarios[scenarioKey];
    setGameState(current => scenario.action(current));
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState, triggerScenario }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Main controller component
const GameStateController: React.FC = () => {
  const { gameState, updateGameState, triggerScenario } = useGameState();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <div className="grid grid-cols-2 gap-6">
        {/* Game Status Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Game Status</h2>
          
          {/* Score Display */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>{gameState.teams.away.team.name}</span>
              <span>{gameState.teams.away.score}</span>
            </div>
            <div className="flex justify-between">
              <span>{gameState.teams.home.team.name}</span>
              <span>{gameState.teams.home.score}</span>
            </div>
          </div>

          {/* Inning Display */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <p>Inning: {gameState.currentPlay?.inning} {gameState.currentPlay?.inningHalf}</p>
            <p>Outs: {gameState.currentPlay?.outs}</p>
            <p>Count: {gameState.currentPlay?.balls}-{gameState.currentPlay?.strikes}</p>
          </div>

          {/* Last Play */}
          {gameState.plays && gameState.plays.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Last Play</h3>
              <p>{gameState.plays[0].description}</p>
            </div>
          )}
        </div>

        {/* Controls Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Controls</h2>
          
          {/* Basic Controls */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => addOut()}
              className="bg-red-600 hover:bg-red-700 p-2 rounded"
            >
              Add Out
            </button>
            <button
              onClick={() => updateGameState({
                currentPlay: {
                  ...gameState.currentPlay!,
                  balls: Math.min((gameState.currentPlay?.balls || 0) + 1, 4)
                }
              })}
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
            >
              Add Ball
            </button>
            <button
              onClick={() => updateGameState({
                currentPlay: {
                  ...gameState.currentPlay!,
                  strikes: Math.min((gameState.currentPlay?.strikes || 0) + 1, 3)
                }
              })}
              className="bg-green-600 hover:bg-green-700 p-2 rounded"
            >
              Add Strike
            </button>
          </div>

          {/* Scenario Buttons */}
          <div className="space-y-2">
            <h3 className="font-bold">Scenarios</h3>
            <button
              onClick={() => triggerScenario('homeRun')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded mb-2"
            >
              Home Run
            </button>
            <button
              onClick={() => triggerScenario('strikeout')}
              className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded mb-2"
            >
              Strikeout
            </button>
            <button
              onClick={() => triggerScenario('doublePlay')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded"
            >
              Double Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStateController;
