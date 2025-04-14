
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WordGrid from './WordGrid';
import AIAgent from './AIAgent';
import { GameState } from '../hooks/useGameState';
import { Search, Send, Rocket, Clock } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  onSubmitClue: (clue: string, number: number) => void;
  onGuessWord: (index: number) => void;
  onEndTurn: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onSubmitClue,
  onGuessWord,
  onEndTurn
}) => {
  const [clue, setClue] = useState('');
  const [number, setNumber] = useState(1);
  const [activeAgent, setActiveAgent] = useState(0);
  const [agentThinking, setAgentThinking] = useState(false);
  
  // Handle agent animations
  useEffect(() => {
    if (gameState.currentClue) {
      // Simulate agent thinking about the clue
      setAgentThinking(true);
      const timer = setTimeout(() => {
        setAgentThinking(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentClue]);
  
  // Rotate active agent periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAgent(prev => (prev + 1) % gameState.selectedAgents.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [gameState.selectedAgents.length]);
  
  const handleSubmitClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (clue.trim() && number > 0) {
      onSubmitClue(clue.trim(), number);
    }
  };
  
  const isGuessingPhase = !!gameState.currentClue;
  
  return (
    <motion.div
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left side - Word grid */}
        <div className="flex-1">
          <div className="space-card p-4 mb-4">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-space-yellow font-bold text-lg">MISSION CONTROL</h2>
                <p className="text-sm text-gray-400">Find all blue words to escape</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-space-yellow" />
                <span className="text-space-yellow font-bold">{gameState.turnsLeft}</span>
                <span className="text-xs text-gray-400">turns left</span>
              </div>
            </div>
            
            {gameState.currentClue && (
              <div className="mb-4 p-3 bg-space-darkblue rounded-md border border-space-blue/50">
                <div className="text-sm text-gray-400">Current clue:</div>
                <div className="flex justify-between items-center">
                  <div className="text-space-yellow font-bold text-xl">{gameState.currentClue}</div>
                  <div className="bg-space-blue/20 rounded-full px-2 py-1 text-space-yellow font-bold">
                    {gameState.currentNumber}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {gameState.guessedThisTurn}/{gameState.currentNumber} guesses made
                </div>
              </div>
            )}
            
            {/* Word grid */}
            <WordGrid 
              words={gameState.wordGrid} 
              onWordClick={onGuessWord}
              disabled={!isGuessingPhase}
            />
            
            {/* Progress */}
            <div className="mt-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-400">Mission Progress</div>
                <div className="flex items-center gap-1">
                  <Rocket size={16} className="text-space-blue" />
                  <span className="text-space-yellow font-bold">
                    {9 - gameState.remainingBlueWords}/9
                  </span>
                </div>
              </div>
              
              {isGuessingPhase && gameState.guessedThisTurn < gameState.currentNumber && (
                <button
                  className="star-wars-button text-sm py-1"
                  onClick={onEndTurn}
                >
                  End Turn
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right side - AI team and controls */}
        <div className="md:w-72">
          <div className="space-card p-4 mb-4">
            <h2 className="text-space-yellow font-bold text-lg mb-3">REBEL AGENTS</h2>
            
            <div className="space-y-3">
              {gameState.selectedAgents.map((agent, i) => (
                <AIAgent 
                  key={agent.id}
                  agent={agent}
                  isActive={i === activeAgent}
                  isSpeaking={agentThinking && i === activeAgent}
                />
              ))}
            </div>
          </div>
          
          {!isGuessingPhase && (
            <div className="space-card p-4">
              <h2 className="text-space-yellow font-bold text-lg mb-3">TRANSMIT CODE</h2>
              
              <form onSubmit={handleSubmitClue}>
                <div className="mb-3">
                  <label className="text-sm text-gray-400 mb-1 block">Clue Word</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={clue}
                      onChange={(e) => setClue(e.target.value)}
                      className="w-full bg-space-darkblue border border-gray-700 rounded-md pl-9 pr-3 py-2 text-white focus:outline-none focus:border-space-blue"
                      placeholder="Enter a clue..."
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-1 block">Number of Words</label>
                  <select
                    value={number}
                    onChange={(e) => setNumber(Number(e.target.value))}
                    className="w-full bg-space-darkblue border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-space-blue"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="star-wars-button w-full flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>Transmit Clue</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GameBoard;
