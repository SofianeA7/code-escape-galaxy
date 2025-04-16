import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WordGrid from './WordGrid';
import AIAgent from './AIAgent';
import { GameState } from '../hooks/useGameState';
import { Search, Send, Rocket, Clock, Brain, MessageSquare, Home, Check, X } from 'lucide-react';
import { getAgentGuess } from '../data/gameData';

interface GameBoardProps {
  gameState: GameState;
  onSubmitClue: (clue: string, number: number) => void;
  onGuessWord: (index: number) => void;
  onEndTurn: () => void;
  onHome: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onSubmitClue,
  onGuessWord,
  onEndTurn,
  onHome
}) => {
  const [clue, setClue] = useState('');
  const [number, setNumber] = useState(1);
  const [agentThinking, setAgentThinking] = useState(false);
  const [suggestedIndex, setSuggestedIndex] = useState<number | null>(null);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const [agentVotes, setAgentVotes] = useState<{[key: number]: number[]}>({});
  const [voteTimer, setVoteTimer] = useState(0);
  const [finalVote, setFinalVote] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<{agentIndex: number; message: string; type: 'reasoning' | 'vote' | 'critique'}[]>([]);
  
  useEffect(() => {
    if (gameState.currentClue) {
      setAgentThinking(true);
      // Montrer automatiquement le panneau de raisonnement
      setShowReasoningPanel(true);
      
      // Réinitialiser les votes et le chat
      setAgentVotes({});
      setFinalVote(null);
      setChatMessages([]);
      
      const timer = setTimeout(() => {
        setAgentThinking(false);
        
        // Ajout des messages de raisonnement
        const newChatMessages = [...chatMessages];
        
        // Raisonnement de l'agent principal
        newChatMessages.push({
          agentIndex: gameState.activeAgentIndex,
          message: gameState.agentReasoning,
          type: 'reasoning'
        });
        
        // Critiques et discussions entre les agents
        gameState.selectedAgents.forEach((agent, idx) => {
          if (idx !== gameState.activeAgentIndex) {
            // Générer une critique ou un commentaire
            const critique = generateAgentCritique(agent, gameState.currentClue);
            newChatMessages.push({
              agentIndex: idx,
              message: critique,
              type: 'critique'
            });
          }
        });
        
        setChatMessages(newChatMessages);
        
        // Simuler le vote des agents
        const votes: {[key: number]: number[]} = {};
        gameState.selectedAgents.forEach((agent, agentIndex) => {
          const guessIndex = getAgentGuess(gameState.wordGrid, gameState.currentClue);
          if (guessIndex >= 0) {
            if (!votes[guessIndex]) votes[guessIndex] = [];
            votes[guessIndex].push(agentIndex);
            
            // Ajouter les votes au chat
            setTimeout(() => {
              setChatMessages(prev => [...prev, {
                agentIndex: agentIndex,
                message: `Je vote pour le mot "${gameState.wordGrid[guessIndex].word}"`,
                type: 'vote'
              }]);
            }, 500 + agentIndex * 700);
          }
        });
        
        setAgentVotes(votes);
        
        // Démarrer le timer de vote
        setVoteTimer(3);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentClue, gameState.wordGrid, gameState.selectedAgents, gameState.activeAgentIndex, gameState.agentReasoning]);
  
  // Timer pour le vote final
  useEffect(() => {
    if (voteTimer > 0) {
      const interval = setInterval(() => {
        setVoteTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (voteTimer === 0 && Object.keys(agentVotes).length > 0 && finalVote === null) {
      // Déterminer le vote final (mot avec le plus de votes)
      let maxVotes = 0;
      let selectedIndex = null;
      
      Object.entries(agentVotes).forEach(([index, votes]) => {
        if (votes.length > maxVotes) {
          maxVotes = votes.length;
          selectedIndex = parseInt(index);
        }
      });
      
      if (selectedIndex !== null) {
        setFinalVote(selectedIndex);
        
        // Ajouter message de consensus final au chat
        setChatMessages(prev => [...prev, {
          agentIndex: gameState.activeAgentIndex,
          message: `Nous avons décidé collectivement de choisir le mot "${gameState.wordGrid[selectedIndex].word}"`,
          type: 'vote'
        }]);
        
        // Appliquer le vote après un court délai
        setTimeout(() => {
          onGuessWord(selectedIndex);
          setSuggestedIndex(null);
          setFinalVote(null);
        }, 1500);
      }
    }
  }, [voteTimer, agentVotes, finalVote, onGuessWord, gameState.wordGrid, gameState.activeAgentIndex]);
  
  const handleSubmitClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (clue.trim()) {
      onSubmitClue(clue.trim(), number);
      setClue('');
    }
  };
  
  const isGuessingPhase = gameState.currentClue ? true : false;
  const activeAgent = gameState.selectedAgents[gameState.activeAgentIndex];

  // Générer une critique basée sur la personnalité de l'agent
  const generateAgentCritique = (agent: AIAgentData, currentClue: string) => {
    switch(agent.name) {
      case 'Yoda':
        return `Hmm, un indice intéressant, "${currentClue}" est. Mais la Force, attention nous devons porter. Plusieurs sens, ce mot peut avoir.`;
      case 'Nicolas Tesla':
        return `En analysant l'indice "${currentClue}", je relève plusieurs associations sémantiques possibles. Procédons par élimination logique.`;
      case 'Jack l\'Éventreur':
        return `"${currentClue}"? J'aimerais trancher immédiatement, mais je dois disséquer toutes les options avant de porter mon coup final.`;
      case 'Gengis Khan':
        return `L'indice "${currentClue}" est comme un territoire à conquérir. Plusieurs mots s'offrent à nous, mais un seul nous mènera à la victoire.`;
      default:
        return `Je réfléchis à l'indice "${currentClue}"...`;
    }
  };
  
  return (
    <motion.div
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={onHome}
          className="star-wars-button text-sm py-1 px-3 flex items-center gap-2"
        >
          <Home size={16} />
          <span>Retour à la base</span>
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Panel de gauche - Grille de mots réduite */}
        <div className="lg:w-1/2">
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
            
            {/* Final Vote Result */}
            {isGuessingPhase && finalVote !== null && (
              <AnimatePresence>
                <motion.div 
                  className="mb-4 p-4 bg-space-darkblue/80 border border-space-yellow/30 rounded-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-3 text-space-yellow">
                    <Check size={20} />
                    <span className="font-bold">Les agents ont choisi:</span>
                    <span className="bg-space-darkblue border border-space-blue px-3 py-1 rounded">
                      {gameState.wordGrid[finalVote].word}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
            
            <WordGrid 
              words={gameState.wordGrid} 
              onWordClick={onGuessWord}
              disabled={!isGuessingPhase || finalVote !== null}
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
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNumber(n)}
                        className={`flex-1 py-2 rounded-md transition-colors ${
                          number === n 
                            ? 'bg-space-yellow text-black' 
                            : 'bg-space-darkblue border border-gray-700 text-gray-400 hover:bg-space-darkblue/50'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
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

        {/* Panel de droite - Chat et discussion des agents */}
        <div className="lg:w-1/2">
          <div className="space-card p-4 h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-space-yellow font-bold text-lg">COMMUNICATION DES AGENTS</h2>
              <div className="bg-space-darkblue/80 rounded-full px-2 py-0.5 text-xs text-gray-400">
                Canal sécurisé
              </div>
            </div>
            
            {/* Affichage des avatars des agents en haut */}
            <div className="flex justify-center mb-4">
              {gameState.selectedAgents.map((agent, idx) => (
                <div 
                  key={idx} 
                  className={`w-10 h-10 rounded-full mx-2 flex items-center justify-center border-2 ${idx === gameState.activeAgentIndex ? 'border-space-yellow bg-space-darkblue' : 'border-gray-600 bg-space-darkblue/50'}`}
                  title={agent.name}
                >
                  {agent.avatar}
                </div>
              ))}
            </div>
            
            {/* Zone de chat */}
            <div 
              className="h-[400px] mb-4 p-3 bg-space-darkblue/50 rounded-md border border-space-blue/20 overflow-y-auto"
              style={{scrollBehavior: 'smooth'}}
            >
              {agentThinking ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-3 h-3 bg-space-blue rounded-full mx-1"
                          style={{
                            animation: `bounce 1.4s infinite ease-in-out both`,
                            animationDelay: `${i * 0.16}s`
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-gray-400">Les agents analysent votre indice...</p>
                  </div>
                </div>
              ) : chatMessages.length > 0 ? (
                <div className="space-y-4">
                  {chatMessages.map((msg, idx) => {
                    const agent = gameState.selectedAgents[msg.agentIndex];
                    const isActiveAgent = msg.agentIndex === gameState.activeAgentIndex;
                    
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-space-darkblue border border-space-blue flex items-center justify-center text-md">
                          {agent.avatar}
                        </div>
                        
                        <div className="flex-grow">
                          <div className={`agent-chat-bubble ${isActiveAgent ? 'left' : 'right'}`}>
                            <div className="text-xs text-space-blue mb-1 font-bold">{agent.name}</div>
                            <div className="text-sm text-gray-300">{msg.message}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Envoyez un indice pour démarrer la discussion des agents</p>
                </div>
              )}
            </div>
            
            {/* Vote summary */}
            {isGuessingPhase && Object.keys(agentVotes).length > 0 && finalVote === null && (
              <div className="p-3 bg-space-darkblue/70 rounded-md border border-space-blue/30 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-space-yellow" />
                    <h3 className="text-space-yellow font-bold">VOTE DES AGENTS</h3>
                  </div>
                  <div className="bg-space-darkblue rounded-full px-2 py-0.5 text-xs text-space-yellow">
                    {voteTimer > 0 ? `Vote dans ${voteTimer}s` : "Vote terminé"}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(agentVotes).map(([wordIndex, agentIndices]) => {
                    const word = gameState.wordGrid[parseInt(wordIndex)].word;
                    return (
                      <div key={wordIndex} className="flex items-center justify-between bg-space-darkblue/50 p-2 rounded">
                        <div className="text-sm text-white">{word}</div>
                        <div className="flex -space-x-2">
                          {agentIndices.map(agentIndex => (
                            <div 
                              key={agentIndex} 
                              className="w-6 h-6 rounded-full bg-space-darkblue border border-space-blue flex items-center justify-center text-xs"
                              title={gameState.selectedAgents[agentIndex].name}
                            >
                              {gameState.selectedAgents[agentIndex].avatar}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Avatars des agents en bas */}
            <div className="flex items-center justify-between">
              {isGuessingPhase ? (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-green-500">Communication active</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-500">En attente d'indice</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameBoard;
