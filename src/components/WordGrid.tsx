
import React from 'react';
import { motion } from 'framer-motion';
import { WordCard } from '../data/gameData';

interface WordGridProps {
  words: WordCard[];
  onWordClick: (index: number) => void;
  disabled?: boolean;
  showSpymasterView?: boolean;
}

const WordGrid: React.FC<WordGridProps> = ({ 
  words, 
  onWordClick, 
  disabled = false, 
  showSpymasterView = true // Par défaut, on montre la vue spymaster
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {words.map((word, index) => {
        // Détermine la classe à appliquer en fonction du type et de si le mot est révélé
        let cardClass = 'word-card';
        
        if (word.revealed) {
          cardClass += ` ${word.type}`;
        } else if (showSpymasterView) {
          // Vue spymaster: colorie tous les mots même s'ils ne sont pas révélés
          cardClass += ` spymaster-${word.type}`;
        }
        
        if (disabled) {
          cardClass += ' opacity-75';
        }
        
        return (
          <motion.div
            key={index}
            className={cardClass}
            onClick={() => !disabled && !word.revealed && onWordClick(index)}
            whileHover={!disabled && !word.revealed ? { scale: 1.05 } : {}}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
          >
            <span>{word.word}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WordGrid;
