
import React from 'react';
import { motion } from 'framer-motion';
import { AIAgentData } from '../data/gameData';
import { Users } from 'lucide-react';

interface AIAgentProps {
  agent: AIAgentData;
  isActive?: boolean;
  isSpeaking?: boolean;
  onSelect?: () => void;
  message?: string;
}

const AIAgent: React.FC<AIAgentProps> = ({
  agent,
  isActive = false,
  isSpeaking = false,
  onSelect,
  message
}) => {
  return (
    <motion.div
      className={`space-card p-3 ${isActive ? 'ring-2 ring-space-blue' : ''} ${onSelect ? 'cursor-pointer hover:bg-space-darkblue' : ''}`}
      onClick={onSelect}
      whileHover={onSelect ? { scale: 1.05 } : {}}
      animate={isSpeaking ? { y: [0, -5, 0] } : {}}
      transition={isSpeaking ? { repeat: Infinity, duration: 1.5 } : {}}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full bg-space-darkblue border border-space-blue flex items-center justify-center text-xl ${isSpeaking ? 'animate-pulse' : ''}`}>
          {agent.avatar}
        </div>
        
        <div className="ml-3">
          <div className="font-bold text-space-yellow">{agent.name}</div>
          <div className="text-xs text-gray-400">{agent.personality}</div>
        </div>
        
        {isActive && (
          <div className="ml-auto">
            <div className="w-2 h-2 bg-space-blue rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      {isSpeaking && message && (
        <motion.div 
          className="mt-2 text-sm text-gray-300 bg-space-darkblue/50 p-2 rounded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-space-blue">{agent.name}:</span> {message}
        </motion.div>
      )}
      
      <div className="mt-2 space-y-2">
        <div className="flex items-center">
          <div className="text-xs text-gray-400 mr-2">Confiance</div>
          <div className="flex-1 bg-gray-700 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="bg-space-blue h-1"
              initial={{ width: 0 }}
              animate={{ width: `${agent.confidence * 10}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <Users size={12} className="text-space-blue mr-1" />
          <div className="text-xs text-gray-400 mr-2">Dimension sociale</div>
          <div className="flex-1 bg-gray-700 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="bg-space-yellow h-1"
              initial={{ width: 0 }}
              animate={{ width: `${agent.socialDimension * 10}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAgent;
