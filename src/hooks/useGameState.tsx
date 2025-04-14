
import { useState, useCallback } from 'react';
import { WordCard, AIAgentData, generateGameBoard, aiAgents } from '../data/gameData';

export type GamePhase = 'home' | 'intro' | 'game' | 'success' | 'failure';

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
    score: 0
  });

  const startNewGame = useCallback(() => {
    // Select 3 random AI agents
    const randomAgents = [...aiAgents]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const gameBoard = generateGameBoard();
    
    setGameState({
      gameId: `mission-${Math.floor(Math.random() * 10000)}`,
      phase: 'intro',
      wordGrid: gameBoard,
      selectedAgents: randomAgents,
      currentClue: '',
      currentNumber: 0,
      remainingBlueWords: 9,
      guessedThisTurn: 0,
      turnsLeft: 10,
      score: 0
    });
  }, []);

  const goToGamePhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'game'
    }));
  }, []);

  const submitClue = useCallback((clue: string, number: number) => {
    setGameState(prev => ({
      ...prev,
      currentClue: clue,
      currentNumber: number,
      guessedThisTurn: 0
    }));
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
    
    if (wordType === 'blue') {
      newRemainingBlueWords -= 1;
      newScore += 100;
      
      // Check for win condition
      if (newRemainingBlueWords === 0) {
        newPhase = 'success';
        newScore += newTurnsLeft * 50; // Bonus points for remaining turns
      }
    } else if (wordType === 'assassin') {
      newPhase = 'failure';
    } else {
      // Red or neutral - end turn
      newTurnsLeft -= 1;
      newGuessedThisTurn = gameState.currentNumber + 1; // Force end turn
      
      if (newTurnsLeft === 0) {
        newPhase = 'failure';
      }
    }
    
    setGameState(prev => ({
      ...prev,
      wordGrid: newGrid,
      phase: newPhase,
      remainingBlueWords: newRemainingBlueWords,
      guessedThisTurn: newGuessedThisTurn,
      turnsLeft: newTurnsLeft,
      score: newScore
    }));
  }, [gameState]);

  const endTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      turnsLeft: prev.turnsLeft - 1,
      currentClue: '',
      currentNumber: 0
    }));
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
    goToGamePhase,
    submitClue,
    guessWord,
    endTurn,
    resetToHome
  };
}
