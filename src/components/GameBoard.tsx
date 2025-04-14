
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WordGrid from './WordGrid';
import AIAgent from './AIAgent';
import { GameState } from '../hooks/useGameState';
import { Search, Send, Rocket, Clock } from 'lucide-react';
import { getAgentGuess } from '../data/gameData';

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
  const [suggestedIndex, setSuggestedIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (gameState.currentClue) {
      setAgentThinking(true);
      const timer = setTimeout(() => {
        setAgentThinking(false);
        
        // Une fois que l'agent a fini de réfléchir, il suggère un mot
        const guessIndex = getAgentGuess(gameState.wordGrid, gameState.currentClue);
        if (guessIndex >= 0) {
          setSuggestedIndex(guessIndex);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentClue, gameState.wordGrid]);
  
  useEffect(() => {
    if (suggestedIndex !== null && !agentThinking) {
      // Appliquer la suggestion après un court délai
      const timer = setTimeout(() => {
        onGuessWord(suggestedIndex);
        setSuggestedIndex(null);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [suggestedIndex, agentThinking, onGuessWord]);
  
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
      setClue('');
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
        <div className="flex-1">
          <div className="space-card p-4 mb-4">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-space-yellow font-bold text-lg">POSTE DE CONTRÔLE DE MISSION</h2>
                <p className="text-sm text-gray-400">Trouvez tous les mots bleus pour vous échapper</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-space-yellow" />
                <span className="text-space-yellow font-bold">{gameState.turnsLeft}</span>
                <span className="text-xs text-gray-400">tours restants</span>
              </div>
            </div>
            
            {gameState.currentClue && (
              <div className="mb-4 p-3 bg-space-darkblue rounded-md border border-space-blue/50">
                <div className="text-sm text-gray-400">Indice actuel :</div>
                <div className="flex justify-between items-center">
                  <div className="text-space-yellow font-bold text-xl">{gameState.currentClue}</div>
                  <div className="bg-space-blue/20 rounded-full px-2 py-1 text-space-yellow font-bold">
                    {gameState.currentNumber}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {gameState.guessedThisTurn}/{gameState.currentNumber} tentatives effectuées
                </div>
              </div>
            )}
            
            <WordGrid 
              words={gameState.wordGrid} 
              onWordClick={onGuessWord}
              disabled={!isGuessingPhase}
              showSpymasterView={true}
            />
            
            <div className="mt-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-400">Progression de la mission</div>
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
                  Terminer le tour
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-72">
          <div className="space-card p-4 mb-4">
            <h2 className="text-space-yellow font-bold text-lg mb-3">AGENTS REBELLES</h2>
            
            <div className="space-y-3">
              {gameState.selectedAgents.map((agent, i) => {
                // L'agent actif est celui qui parle ou suggère actuellement
                const isActive = i === activeAgent;
                const isSpeaking = agentThinking && isActive;
                const isSuggesting = !agentThinking && suggestedIndex !== null && isActive;
                
                let agentMessage = "";
                if (isSpeaking) {
                  agentMessage = "Analyse en cours... Je réfléchis à l'indice.";
                } else if (isSuggesting && suggestedIndex !== null) {
                  agentMessage = `Je suggère le mot "${gameState.wordGrid[suggestedIndex].word}"!`;
                }
                
                return (
                  <AIAgent 
                    key={agent.id}
                    agent={agent}
                    isActive={isActive}
                    isSpeaking={isSpeaking || isSuggesting}
                    message={agentMessage}
                  />
                );
              })}
            </div>
          </div>
          
          {!isGuessingPhase && (
            <div className="space-card p-4">
              <h2 className="text-space-yellow font-bold text-lg mb-3">TRANSMETTRE UN CODE</h2>
              
              <form onSubmit={handleSubmitClue}>
                <div className="mb-3">
                  <label className="text-sm text-gray-400 mb-1 block">Mot d'indice</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={clue}
                      onChange={(e) => setClue(e.target.value)}
                      className="w-full bg-space-darkblue border border-gray-700 rounded-md pl-9 pr-3 py-2 text-white focus:outline-none focus:border-space-blue"
                      placeholder="Entrez un indice..."
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-1 block">Nombre de mots</label>
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
                  <span>Transmettre l'indice</span>
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
