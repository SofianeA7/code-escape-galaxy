
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAgentData } from '../data/gameData';
import AIAgent from './AIAgent';
import { ArrowRight } from 'lucide-react';

interface AgentsPresentationProps {
  agents: AIAgentData[];
  onComplete: () => void;
}

const AgentsPresentation: React.FC<AgentsPresentationProps> = ({ agents, onComplete }) => {
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  
  useEffect(() => {
    // Afficher la citation après un court délai
    const timer = setTimeout(() => {
      setShowQuote(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentAgentIndex]);
  
  const handleNext = () => {
    if (currentAgentIndex < agents.length - 1) {
      setShowQuote(false);
      setCurrentAgentIndex(prev => prev + 1);
    } else {
      // Tous les agents ont été présentés
      onComplete();
    }
  };
  
  const currentAgent = agents[currentAgentIndex];
  
  // Citations pour chaque agent
  const getAgentQuote = (agent: AIAgentData) => {
    switch (agent.name) {
      case 'Yoda':
        return "Ta mission, importante est. T'aider, je vais.";
      case 'Nicolas Tesla':
        return "L'énergie et la logique seront mes outils pour décoder cette mission.";
      case 'Jack l\'Éventreur':
        return "Je découperai ce mystère en morceaux, jusqu'au dernier mot...";
      case 'Gengis Khan':
        return "Ensemble, nous conquerrons cette mission comme j'ai conquis des empires!";
      default:
        return "Je suis prêt à accomplir cette mission.";
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.h2 
          className="text-space-yellow text-center text-2xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          VOTRE ÉQUIPE D'AGENTS REBELLES
        </motion.h2>
        
        <div className="text-center mb-4 text-gray-400">
          <span className="mr-2">Agent</span>
          <span className="font-bold text-space-yellow">{currentAgentIndex + 1}</span>
          <span className="mx-2">/</span>
          <span>{agents.length}</span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAgent.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="space-card p-5">
              <AIAgent 
                agent={currentAgent}
                isActive={true}
                isSpeaking={showQuote}
                message={showQuote ? getAgentQuote(currentAgent) : ""}
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button 
            onClick={handleNext} 
            className="star-wars-button flex items-center gap-2"
          >
            {currentAgentIndex < agents.length - 1 ? (
              <>
                <span>Agent suivant</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <span>Démarrer la mission</span>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentsPresentation;
