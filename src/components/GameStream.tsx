import React from 'react';
import { motion } from 'framer-motion';

const GameStream: React.FC = () => {
  return (
    <motion.div 
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg space-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-transparent z-10"></div>
      
      <div className="absolute top-4 left-4 bg-space-red px-3 py-1 rounded-full text-xs font-bold z-20 flex items-center">
        <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-2"></span>
        Replay
      </div>
      
      {/* Simulated game display */}
      <div className="flex p-6 h-full items-center justify-center hologram">
        <div className="grid grid-cols-5 gap-2 w-full max-w-lg opacity-80">
          {Array.from({ length: 25 }).map((_, i) => {
            const isRevealed = Math.random() > 0.6;
            
            // Distribution : 9 bleus, 8 rouges, 6 neutres, 2 assassins
            let type;
            if (i < 9) {
              type = 'blue';
            } else if (i < 17) {
              type = 'red';
            } else if (i < 23) {
              type = 'neutral';
            } else {
              type = 'assassin';
            }
            
            // Mélangez les cellules
            const randomizedType = isRevealed ? type : '';
            
            return (
              <motion.div 
                key={i}
                className={`aspect-[4/3] rounded border ${
                  randomizedType === 'blue' ? 'bg-space-blue/30 border-space-blue' :
                  randomizedType === 'red' ? 'bg-space-red/30 border-space-red' :
                  randomizedType === 'neutral' ? 'bg-gray-700/30 border-gray-600' :
                  randomizedType === 'assassin' ? 'bg-black border-white' :
                  'bg-space-darkblue/50 border-gray-700'
                }`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              />
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-t from-space-black to-transparent z-10">
        <div className="text-xs md:text-sm">
          <div className="text-space-yellow font-bold">ÉQUIPE AGENT ALPHA</div>
          <div className="text-gray-400">Mots restants : 4</div>
        </div>
        <div className="flex space-x-2">
          {['🤖', '🧠', '⚡'].map((emoji, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-space-darkblue border border-space-blue/50 flex items-center justify-center">
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameStream;
