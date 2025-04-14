
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../hooks/useGameState';
import { Rocket, Award, AlertTriangle, RotateCcw } from 'lucide-react';

interface OutcomeScreenProps {
  gameState: GameState;
  outcome: 'success' | 'failure';
  onRestart: () => void;
  onHome: () => void;
}

const OutcomeScreen: React.FC<OutcomeScreenProps> = ({
  gameState,
  outcome,
  onRestart,
  onHome
}) => {
  // Count revealed blue words
  const revealedBlueWords = gameState.wordGrid.filter(
    w => w.revealed && w.type === 'blue'
  ).length;
  
  // Check if the assassin word was revealed
  const assassinRevealed = gameState.wordGrid.some(
    w => w.revealed && w.type === 'assassin'
  );
  
  // Find the first assassin word for failure screen
  const assassinWord = gameState.wordGrid.find(w => w.type === 'assassin')?.word;

  useEffect(() => {
    // Play sound effect based on outcome
    const sound = new Audio(outcome === 'success' ? '/success.mp3' : '/failure.mp3');
    sound.volume = 0.5;
    sound.play().catch(() => {
      // Ignore autoplay errors
      console.log('Audio autoplay was prevented');
    });
  }, [outcome]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-lg w-full">
        {outcome === 'success' ? (
          <motion.div
            className="text-center space-card p-6 overflow-hidden"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
              transition={{ delay: 1, duration: 1 }}
            >
              <Award size={80} className="mx-auto text-space-yellow mb-4" />
            </motion.div>
            
            <h2 className="text-3xl font-starwars text-space-yellow mb-4 animate-text-glow">
              MISSION ACCOMPLIE
            </h2>
            
            <p className="text-gray-300 mb-6">
              Contre toute attente, vous avez réussi à vous échapper de l'Étoile Noire. Votre rapidité d'esprit et vos compétences en transmission de codes ont sauvé la situation !
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between bg-space-darkblue/50 p-3 rounded">
                <span className="text-gray-300">Mots trouvés :</span>
                <span className="text-space-blue font-bold">{revealedBlueWords}/9</span>
              </div>
              
              <div className="flex justify-between bg-space-darkblue/50 p-3 rounded">
                <span className="text-gray-300">Tours restants :</span>
                <span className="text-space-blue font-bold">{gameState.turnsLeft}</span>
              </div>
              
              <div className="flex justify-between bg-space-darkblue/50 p-3 rounded">
                <span className="text-gray-300">Score final :</span>
                <span className="text-space-yellow font-bold">{gameState.score}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={onRestart}
                className="star-wars-button flex-1 text-sm py-2 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                <span>Nouvelle Mission</span>
              </button>
              
              <button
                onClick={onHome}
                className="star-wars-button flex-1 text-sm py-2 flex items-center justify-center gap-2"
              >
                <Rocket size={16} />
                <span>Retour à la base</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center space-card p-6 border-space-red/50"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, 0] }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <AlertTriangle size={80} className="mx-auto text-space-red mb-4" />
            </motion.div>
            
            <h2 className="text-3xl font-starwars text-space-red mb-4">
              MISSION ÉCHOUÉE
            </h2>
            
            <p className="text-gray-300 mb-6">
              {assassinRevealed ? (
                <>Le mot <span className="text-space-red font-bold">{assassinWord}</span> a déclenché le système de sécurité ! Les forces impériales vous ont capturé.</>
              ) : (
                <>Vous avez épuisé vos tentatives de transmission. Le pod d'évasion reste verrouillé alors que les forces impériales se rapprochent.</>
              )}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between bg-space-darkblue/50 p-3 rounded">
                <span className="text-gray-300">Mots trouvés :</span>
                <span className="text-space-blue font-bold">{revealedBlueWords}/9</span>
              </div>
              
              <div className="flex justify-between bg-space-darkblue/50 p-3 rounded">
                <span className="text-gray-300">Statut de la mission :</span>
                <span className="text-space-red font-bold">TERMINÉE</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={onRestart}
                className="star-wars-button flex-1 text-sm py-2 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                <span>Réessayer</span>
              </button>
              
              <button
                onClick={onHome}
                className="star-wars-button flex-1 text-sm py-2 flex items-center justify-center gap-2"
              >
                <Rocket size={16} />
                <span>Retour à la base</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OutcomeScreen;
