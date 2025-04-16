
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

// Étendre l'interface AIAgentData pour inclure la dimension sociale
declare module '../data/gameData' {
  interface AIAgentData {
    socialDimension: number; // 1-10
  }
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
    // Sélectionner 3 agents aléatoires et leur attribuer une dimension sociale
    const randomAgents = [...aiAgents]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(agent => ({
        ...agent,
        // Ajouter une dimension sociale à chaque agent (de 1 à 10)
        socialDimension: Math.floor(Math.random() * 10) + 1
      }));
    
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
    console.log("Submitting clue to game state:", clue, "with number:", number);
    setGameState(prev => {
      // Si le clue est vide, c'est une demande de nouvel indice
      if (!clue.trim()) {
        return {
          ...prev,
          currentClue: '',
          currentNumber: 0,
          guessedThisTurn: 0,
          agentReasoning: ''
        };
      }
      
      // Choisir aléatoirement quel agent va réfléchir à voix haute
      const randomAgentIndex = Math.floor(Math.random() * prev.selectedAgents.length);
      const activeAgent = prev.selectedAgents[randomAgentIndex];
      
      // Générer un raisonnement détaillé basé sur la personnalité de l'agent actif
      const reasoning = activeAgent.reasoningStyle(clue, prev.wordGrid);
      
      return {
        ...prev,
        currentClue: clue,
        currentNumber: number, // Utiliser le nombre sélectionné par l'utilisateur
        guessedThisTurn: 0,
        agentReasoning: reasoning,
        activeAgentIndex: randomAgentIndex
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
    
    // Choisir aléatoirement quel agent parlera ensuite
    let newActiveAgentIndex = Math.floor(Math.random() * gameState.selectedAgents.length);
    let newAgentReasoning = '';
    let newCurrentClue = gameState.currentClue;
    let newCurrentNumber = gameState.currentNumber;
    
    if (wordType === 'blue') {
      newRemainingBlueWords -= 1;
      newScore += 100;
      
      // Check for win condition
      if (newRemainingBlueWords === 0) {
        newPhase = 'success';
        newScore += newTurnsLeft * 50; // Bonus points for remaining turns
      } else if (newGuessedThisTurn >= gameState.currentNumber) {
        // Si on a atteint le nombre maximum de tentatives, on réinitialise pour le prochain tour
        newCurrentClue = '';
        newCurrentNumber = 0;
        newGuessedThisTurn = 0;
      }
    } else if (wordType === 'assassin') {
      newPhase = 'failure';
    } else {
      // Neutral - end turn
      newTurnsLeft -= 1;
      // Réinitialiser pour le prochain indice
      newCurrentClue = '';
      newCurrentNumber = 0;
      newGuessedThisTurn = 0;
      
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
      score: newScore,
      activeAgentIndex: newActiveAgentIndex,
      agentReasoning: newAgentReasoning,
      currentClue: newCurrentClue,
      currentNumber: newCurrentNumber
    }));
  }, [gameState]);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      // Choisir aléatoirement quel agent parlera au prochain tour
      const newActiveAgentIndex = Math.floor(Math.random() * prev.selectedAgents.length);
      
      return {
        ...prev,
        turnsLeft: prev.turnsLeft - 1,
        currentClue: '',
        currentNumber: 0,
        guessedThisTurn: 0,
        activeAgentIndex: newActiveAgentIndex,
        agentReasoning: ''
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
