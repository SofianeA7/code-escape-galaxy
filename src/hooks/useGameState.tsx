
import { useState, useCallback } from 'react';
import { WordCard, AIAgentData, generateGameBoard, aiAgents, generateGameId } from '../data/gameData';

export type GamePhase = 'home' | 'intro' | 'agents' | 'game' | 'success' | 'failure';

export interface GameState {
  gameId: string;
  phase: GamePhase;
  wordGrid: WordCard[];
  selectedAgents: AIAgentData[];
  currentClue: string;
  currentNumber: number;
  remainingBlueWords: number;
  guessedThisTurn: number;
  turnsLeft: number;
  score: number;
  agentReasoning: string;
  activeAgentIndex: number;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    gameId: '',
    phase: 'home',
    wordGrid: [],
    selectedAgents: [],
    currentClue: '',
    currentNumber: 0,
    remainingBlueWords: 9,
    guessedThisTurn: 0,
    turnsLeft: 10,
    score: 0,
    agentReasoning: '',
    activeAgentIndex: 0
  });

  const startNewGame = useCallback(() => {
    // Select 3 random AI agents
    const randomAgents = [...aiAgents]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const gameBoard = generateGameBoard();
    
    setGameState({
      gameId: generateGameId(),
      phase: 'intro',
      wordGrid: gameBoard,
      selectedAgents: randomAgents,
      currentClue: '',
      currentNumber: 0,
      remainingBlueWords: 9,
      guessedThisTurn: 0,
      turnsLeft: 10,
      score: 0,
      agentReasoning: '',
      activeAgentIndex: 0
    });
  }, []);

  const goToAgentsPhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'agents'
    }));
  }, []);

  const goToGamePhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'game'
    }));
  }, []);

  const submitClue = useCallback((clue: string, number: number) => {
    setGameState(prev => {
      const activeAgent = prev.selectedAgents[prev.activeAgentIndex];
      const reasoning = activeAgent.reasoningStyle(clue, prev.wordGrid);
      
      return {
        ...prev,
        currentClue: clue,
        currentNumber: number,
        guessedThisTurn: 0,
        agentReasoning: reasoning
      };
    });
  }, []);

  const guessWord = useCallback((index: number) => {
    const newGrid = [...gameState.wordGrid];
    
    // If already revealed, do nothing
    if (newGrid[index].revealed) return;
    
    // Reveal the word
    newGrid[index].revealed = true;
    
    // Calculate new state based on the word type
    const wordType = newGrid[index].type;
    let newPhase = gameState.phase;
    let newRemainingBlueWords = gameState.remainingBlueWords;
    let newScore = gameState.score;
    let newTurnsLeft = gameState.turnsLeft;
    let newGuessedThisTurn = gameState.guessedThisTurn + 1;
    let newActiveAgentIndex = (gameState.activeAgentIndex + 1) % gameState.selectedAgents.length;
    let newAgentReasoning = '';
    
    if (wordType === 'blue') {
      newRemainingBlueWords -= 1;
      newScore += 100;
      
      // Check for win condition
      if (newRemainingBlueWords === 0) {
        newPhase = 'success';
        newScore += newTurnsLeft * 50; // Bonus points for remaining turns
      } else if (newGuessedThisTurn >= gameState.currentNumber) {
        // Si on a fini nos tentatives pour ce tour, générer un nouveau raisonnement
        const nextAgent = gameState.selectedAgents[newActiveAgentIndex];
        newAgentReasoning = nextAgent.reasoningStyle(gameState.currentClue, newGrid);
      }
    } else if (wordType === 'assassin') {
      newPhase = 'failure';
    } else {
      // Neutral - end turn
      newTurnsLeft -= 1;
      newGuessedThisTurn = gameState.currentNumber + 1; // Force end turn
      
      if (newTurnsLeft === 0) {
        newPhase = 'failure';
      } else {
        // Générer un nouveau raisonnement pour le prochain agent
        const nextAgent = gameState.selectedAgents[newActiveAgentIndex];
        newAgentReasoning = nextAgent.reasoningStyle(gameState.currentClue, newGrid);
      }
    }
    
    setGameState(prev => ({
      ...prev,
      wordGrid: newGrid,
      phase: newPhase,
      remainingBlueWords: newRemainingBlueWords,
      guessedThisTurn: newGuessedThisTurn,
      turnsLeft: newTurnsLeft,
      score: newScore,
      activeAgentIndex: newActiveAgentIndex,
      agentReasoning: newAgentReasoning
    }));
  }, [gameState]);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      const newActiveAgentIndex = (prev.activeAgentIndex + 1) % prev.selectedAgents.length;
      const nextAgent = prev.selectedAgents[newActiveAgentIndex];
      const newReasoning = nextAgent.reasoningStyle('', prev.wordGrid);
      
      return {
        ...prev,
        turnsLeft: prev.turnsLeft - 1,
        currentClue: '',
        currentNumber: 0,
        activeAgentIndex: newActiveAgentIndex,
        agentReasoning: newReasoning
      };
    });
  }, []);

  const resetToHome = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'home'
    }));
  }, []);

  return {
    gameState,
    startNewGame,
    goToAgentsPhase,
    goToGamePhase,
    submitClue,
    guessWord,
    endTurn,
    resetToHome
  };
}
