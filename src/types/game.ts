export interface Team {
    id: number;
    name: string;
    score: number;
    leagueRecord?: {
        wins: number;
        losses: number;
        pct: string;
    };
}

export interface Venue {
    id: number;
    name: string;
}

export interface GameStatus {
    abstractGameState: 'Live' | 'Preview' | 'Final';
    detailedState: string;
}

export interface GameState {
    gamePk: number;
    gameDate: string;
    status: GameStatus;
    teams: {
        away: {
            team: Team;
            score: number;
            isWinner?: boolean;
        };
        home: {
            team: Team;
            score: number;
            isWinner?: boolean;
        };
    };
    venue: Venue;
    currentPlay?: {
        inning: number;
        inningHalf: 'top' | 'bottom';
        outs: number;
        balls: number;
        strikes: number;
        description?: string;
    };
}

// Demo scenarios based on real MLB data structure
export const demoScenarios = {
    gameStart: {
        gamePk: 747060,
        gameDate: "2024-03-28T19:05:00Z",
        status: {
            abstractGameState: "Live",
            detailedState: "In Progress"
        },
        teams: {
            away: {
                team: {
                    id: 108,
                    name: "Los Angeles Angels",
                    score: 0
                },
                score: 0
            },
            home: {
                team: {
                    id: 110,
                    name: "Baltimore Orioles",
                    score: 0
                },
                score: 0
            }
        },
        venue: {
            id: 2,
            name: "Oriole Park at Camden Yards"
        },
        currentPlay: {
            inning: 1,
            inningHalf: "top",
            outs: 0,
            balls: 0,
            strikes: 0,
            description: "Game is about to begin at Camden Yards"
        }
    },
    
    excitingMoment: {
        gamePk: 747060,
        gameDate: "2024-03-28T19:05:00Z",
        status: {
            abstractGameState: "Live",
            detailedState: "In Progress"
        },
        teams: {
            away: {
                team: {
                    id: 108,
                    name: "Los Angeles Angels",
                    score: 3
                },
                score: 3
            },
            home: {
                team: {
                    id: 110,
                    name: "Baltimore Orioles",
                    score: 2
                },
                score: 2
            }
        },
        venue: {
            id: 2,
            name: "Oriole Park at Camden Yards"
        },
        currentPlay: {
            inning: 7,
            inningHalf: "bottom",
            outs: 2,
            balls: 3,
            strikes: 2,
            description: "Full count, runners on second and third, Orioles down by one"
        }
    }
};
