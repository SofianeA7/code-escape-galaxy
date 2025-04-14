
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [showCrawl, setShowCrawl] = useState(false);
  
  useEffect(() => {
    // Start crawl after a short delay
    const timer1 = setTimeout(() => {
      setShowCrawl(true);
    }, 2000);
    
    // Auto-complete after animation
    const timer2 = setTimeout(() => {
      onComplete();
    }, 15000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {!showCrawl ? (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="text-space-yellow text-4xl md:text-6xl font-starwars animate-text-glow mb-6">
            MISSION ÉVASION GALACTIQUE
          </div>
          <p className="text-gray-400 mb-8">Il y a bien longtemps, dans une galaxie très lointaine...</p>
        </motion.div>
      ) : (
        <div className="star-wars-intro h-screen w-full">
          <motion.div 
            className="crawl-content w-full max-w-2xl mx-auto p-8 text-space-yellow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center animate-crawl">
              <h2 className="text-4xl font-starwars mb-10">ÉPISODE I</h2>
              <h3 className="text-3xl font-starwars mb-10">L'ÉVASION CODÉE</h3>
              
              <p className="text-xl mb-8 leading-relaxed">
                Une alarme retentit sur l'ÉTOILE NOIRE. Les forces impériales ont détecté un accès non autorisé à leurs systèmes centraux.
              </p>
              <p className="text-xl mb-8 leading-relaxed">
                Vous, un espion rebelle capturé, voyez une opportunité de fuite. Le seul moyen de sortir est de communiquer avec votre équipe IA en orbite.
              </p>
              <p className="text-xl mb-8 leading-relaxed">
                Pour déverrouiller les pods d'évasion, vous devez transmettre des messages codés à vos alliés. Mais attention - un seul mot mal choisi pourrait déclencher le système de sécurité et sceller votre destin pour toujours...
              </p>
              <p className="text-xl mb-10 leading-relaxed">
                Le temps presse. Le sort de la rébellion repose entre vos mains...
              </p>
            </div>
          </motion.div>
        </div>
      )}
      
      <motion.button
        className="absolute bottom-10 right-10 star-wars-button"
        onClick={onComplete}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 1 }}
      >
        Ignorer l'introduction
      </motion.button>
    </div>
  );
};

export default IntroSequence;
