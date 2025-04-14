
import React from 'react';
import { motion } from 'framer-motion';
import { WordCard } from '../data/gameData';

interface WordGridProps {
  words: WordCard[];
  onWordClick: (index: number) => void;
  disabled?: boolean;
}

const WordGrid: React.FC<WordGridProps> = ({ words, onWordClick, disabled = false }) => {
  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {words.map((word, index) => (
        <motion.div
          key={index}
          className={`word-card ${word.revealed ? word.type : ''} ${disabled ? 'opacity-75' : ''}`}
          onClick={() => !disabled && !word.revealed && onWordClick(index)}
          whileHover={!disabled && !word.revealed ? { scale: 1.05 } : {}}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
        >
          <span>{word.word}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default WordGrid;
