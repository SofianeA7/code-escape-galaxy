
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
            CODE ESCAPE GALAXY
          </div>
          <p className="text-gray-400 mb-8">A long time ago in a galaxy far, far away...</p>
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
              <h2 className="text-4xl font-starwars mb-10">EPISODE I</h2>
              <h3 className="text-3xl font-starwars mb-10">THE CODE ESCAPE</h3>
              
              <p className="text-xl mb-8 leading-relaxed">
                An alarm echoes through the DEATH STAR. Imperial forces have detected unauthorized access to their central systems.
              </p>
              <p className="text-xl mb-8 leading-relaxed">
                You, a captured rebel spy, see an opportunity for escape. The only way out is to communicate with your AI team waiting in orbit.
              </p>
              <p className="text-xl mb-8 leading-relaxed">
                To unlock the escape pods, you must transmit coded messages to your allies. But be careful - one wrong word could trigger the security systems and seal your fate forever...
              </p>
              <p className="text-xl mb-10 leading-relaxed">
                Time is running out. The fate of the rebellion rests in your hands...
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
        Skip Intro
      </motion.button>
    </div>
  );
};

export default IntroSequence;
