import React, { createContext, useContext, useState, useEffect } from 'react';
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
        score: 1,
        leagueRecord: {
          wins: 70,
          losses: 66,
          pct: '.515'
        }
      },
      score: 1,
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

// Initial plays for game context
const initialPlays = [
  {
    type: 'single',
    description: 'Masataka Yoshida leads off with a single to right field',
    player: 'Masataka Yoshida',
    inning: 1,
    inningHalf: 'top'
  },
  {
    type: 'strikeout',
    description: 'Gerrit Cole strikes out Rafael Devers on three pitches',
    player: 'Gerrit Cole',
    inning: 1,
    inningHalf: 'top'
  },
  {
    type: 'double_play',
    description: 'Justin Turner grounds into a 6-4-3 double play',
    player: 'Justin Turner',
    inning: 1,
    inningHalf: 'top'
  },
  {
    type: 'home_run',
    description: 'Aaron Judge crushes a solo home run to Monument Park!',
    player: 'Aaron Judge',
    inning: 1,
    inningHalf: 'bottom'
  },
  {
    type: 'strikeout',
    description: 'Chris Sale gets Giancarlo Stanton looking on a slider away',
    player: 'Chris Sale',
    inning: 1,
    inningHalf: 'bottom'
  },
  {
    type: 'groundout',
    description: 'Anthony Rizzo grounds out to second base',
    player: 'Anthony Rizzo',
    inning: 1,
    inningHalf: 'bottom'
  }
];

// Pre-defined scenarios
const scenarios = {
  single: {
    description: 'Single',
    action: (state: GameState) => {
      const players = {
        away: ['Justin Turner', 'Rafael Devers', 'Masataka Yoshida', 'Trevor Story', 'Alex Verdugo', 'Triston Casas'],
        home: ['Aaron Judge', 'Giancarlo Stanton', 'Anthony Rizzo', 'Gleyber Torres', 'DJ LeMahieu', 'Harrison Bader']
      };
      const descriptions = [
        'lines a single to right field',
        'hits a sharp grounder through the left side',
        'bloops a single to center',
        'drives one up the middle',
        'slaps one past the diving shortstop'
      ];
      const team = state.currentPlay?.inningHalf === 'top' ? 'away' : 'home';
      const player = players[team][Math.floor(Math.random() * players[team].length)];
      
      const play = {
        type: 'single',
        description: `${player} ${descriptions[Math.floor(Math.random() * descriptions.length)]}`,
        player,
        inning: state.currentPlay?.inning || 1,
        inningHalf: state.currentPlay?.inningHalf || 'top'
      };
      
      return {
        ...state,
        plays: [play, ...(state.plays || [])]
      };
    }
  },
  strikeout: {
    description: 'Strikeout',
    action: (state: GameState) => {
      const pitchers = {
        away: ['Chris Sale', 'Kenley Jansen', 'Josh Winckowski'],
        home: ['Gerrit Cole', 'Clay Holmes', 'Tommy Kahnle']
      };
      const batters = {
        away: ['Justin Turner', 'Rafael Devers', 'Masataka Yoshida', 'Trevor Story'],
        home: ['Aaron Judge', 'Giancarlo Stanton', 'Anthony Rizzo', 'Gleyber Torres']
      };
      
      const pitchingTeam = state.currentPlay?.inningHalf === 'top' ? 'home' : 'away';
      const battingTeam = state.currentPlay?.inningHalf === 'top' ? 'away' : 'home';
      const pitcher = pitchers[pitchingTeam][Math.floor(Math.random() * pitchers[pitchingTeam].length)];
      const batter = batters[battingTeam][Math.floor(Math.random() * batters[battingTeam].length)];
      
      const play = {
        type: 'strikeout',
        description: `${pitcher} strikes out ${batter} swinging`,
        player: pitcher,
        inning: state.currentPlay?.inning || 1,
        inningHalf: state.currentPlay?.inningHalf || 'top'
      };
      
      return {
        ...state,
        currentPlay: {
          ...state.currentPlay!,
          outs: Math.min((state.currentPlay?.outs || 0) + 1, 2),
          strikes: 0,
          balls: 0
        },
        plays: [play, ...(state.plays || [])]
      };
    }
  },
  homeRun: {
    description: 'Home Run',
    action: (state: GameState) => {
      const players = {
        away: ['Rafael Devers', 'Trevor Story'],
        home: ['Aaron Judge', 'Giancarlo Stanton']
      };
      const team = state.currentPlay?.inningHalf === 'top' ? 'away' : 'home';
      const player = players[team][Math.floor(Math.random() * players[team].length)];
      
      const play = {
        type: 'home_run',
        description: `${player} ${[
          'launches a towering home run to left field',
          'crushes one into the second deck',
          'sends one into Monument Park',
          'hits a laser beam into the right field seats',
          'demolishes a fastball for a home run'
        ][Math.floor(Math.random() * 5)]}!`,
        player,
        inning: state.currentPlay?.inning || 1,
        inningHalf: state.currentPlay?.inningHalf || 'top'
      };
      
      const runs = Math.floor(Math.random() * 3) + 1; // 1-3 run homer
      
      return {
        ...state,
        teams: {
          ...state.teams,
          [team]: {
            ...state.teams[team],
            score: state.teams[team].score + runs
          }
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
        inning: state.currentPlay?.inning || 1,
        inningHalf: state.currentPlay?.inningHalf || 'top'
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
  const [gameState, setGameState] = useState<GameState>({
    ...initialGameState,
    plays: initialPlays
  });

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

  // Automatic game progression
  useEffect(() => {
    const progressGame = () => {
      setGameState(current => {
        // Check if we need to change innings
        let newState = { ...current };
        if (current.currentPlay?.outs === 2) {
          if (current.currentPlay.inningHalf === 'top') {
            newState.currentPlay = {
              ...current.currentPlay,
              inningHalf: 'bottom',
              outs: 0,
              balls: 0,
              strikes: 0
            };
          } else {
            newState.currentPlay = {
              ...current.currentPlay,
              inning: (current.currentPlay.inning || 1) + 1,
              inningHalf: 'top',
              outs: 0,
              balls: 0,
              strikes: 0
            };
          }
        }

        // Randomly select a scenario
        const scenarioKeys = Object.keys(scenarios) as (keyof typeof scenarios)[];
        const randomScenario = scenarios[scenarioKeys[Math.floor(Math.random() * scenarioKeys.length)]];
        return randomScenario.action(newState);
      });
    };

    const interval = setInterval(progressGame, 20000);
    return () => clearInterval(interval);
  }, []);

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
