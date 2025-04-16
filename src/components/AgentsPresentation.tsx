
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAgentData } from '../data/gameData';
import AIAgent from './AIAgent';
import { ArrowRight, Home } from 'lucide-react';

interface AgentsPresentationProps {
  agents: AIAgentData[];
  onComplete: () => void;
  onHome: () => void;
}

const AgentsPresentation: React.FC<AgentsPresentationProps> = ({ agents, onComplete, onHome }) => {
  const [showQuotes, setShowQuotes] = useState(false);
  
  useEffect(() => {
    // Afficher les citations après un court délai
    const timer = setTimeout(() => {
      setShowQuotes(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Citations pour chaque agent
  const getAgentQuote = (agent: AIAgentData) => {
    switch (agent.name) {
      case 'Yoda':
        return "Ta mission, importante est. T'aider, je vais. Ensemble, plus forts nous serons.";
      case 'Nicolas Tesla':
        return "L'énergie et la logique seront mes outils pour décoder cette mission. Je guiderai nos délibérations collectives.";
      case 'Jack l\'Éventreur':
        return "Je découperai ce mystère en morceaux, jusqu'au dernier mot. Ne comptez pas sur ma sympathie.";
      case 'Gengis Khan':
        return "Ensemble, nous conquerrons cette mission! Stratégie et domination, mes alliés feront.";
      default:
        return "Je suis prêt à accomplir cette mission avec vous.";
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.h2 
          className="text-space-yellow text-center text-2xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          VOTRE ÉQUIPE D'AGENTS REBELLES
        </motion.h2>
        
        <motion.p 
          className="text-center text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Ces agents vont collaborer et voter ensemble pour décrypter vos indices
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {agents.map((agent) => (
            <AIAgent 
              key={agent.id}
              agent={agent}
              isActive={true}
              isSpeaking={showQuotes}
              message={showQuotes ? getAgentQuote(agent) : ""}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button 
            onClick={onHome} 
            className="star-wars-button flex items-center gap-2"
          >
            <Home size={16} />
            <span>Retour à la base</span>
          </button>
          
          <button 
            onClick={onComplete} 
            className="star-wars-button flex items-center gap-2"
          >
            <span>Démarrer la mission</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentsPresentation;
