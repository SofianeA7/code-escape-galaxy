
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import GameStream from '../components/GameStream';
import IntroSequence from '../components/IntroSequence';
import GameBoard from '../components/GameBoard';
import OutcomeScreen from '../components/OutcomeScreen';
import { Play } from 'lucide-react';

const Index = () => {
  const { 
    gameState, 
    startNewGame, 
    goToGamePhase, 
    submitClue,
    guessWord,
    endTurn,
    resetToHome
  } = useGameState();
  
  // Set page title
  useEffect(() => {
    document.title = "Code Escape Galaxy";
  }, []);
  
  // Render different screens based on game phase
  const renderGamePhase = () => {
    switch (gameState.phase) {
      case 'intro':
        return <IntroSequence onComplete={goToGamePhase} />;
        
      case 'game':
        return (
          <div className="container mx-auto px-4 py-8">
            <GameBoard 
              gameState={gameState}
              onSubmitClue={submitClue}
              onGuessWord={guessWord}
              onEndTurn={endTurn}
            />
          </div>
        );
        
      case 'success':
        return (
          <OutcomeScreen 
            gameState={gameState}
            outcome="success"
            onRestart={startNewGame}
            onHome={resetToHome}
          />
        );
        
      case 'failure':
        return (
          <OutcomeScreen 
            gameState={gameState}
            outcome="failure"
            onRestart={startNewGame}
            onHome={resetToHome}
          />
        );
        
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <HomeScreen onStartGame={startNewGame} />
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen overflow-hidden">
      {renderGamePhase()}
    </div>
  );
};

// Home screen component
const HomeScreen = ({ onStartGame }: { onStartGame: () => void }) => {
  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-starwars text-space-yellow mb-4 animate-text-glow"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          CODE ESCAPE GALAXY
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-300 max-w-xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Lead a team of AI agents to crack the escape codes and flee from the Empire's grasp
        </motion.p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="space-card p-6">
          <h2 className="text-space-yellow font-bold text-lg mb-3">THE MISSION</h2>
          <p className="text-gray-300 text-sm mb-3">
            As a captured rebel spy, you must use coded messages to communicate with your AI team.
          </p>
          <p className="text-gray-300 text-sm">
            Give them clues to help identify the correct escape codes without triggering the Empire's security.
          </p>
        </div>
        
        <div className="space-card p-6">
          <h2 className="text-space-yellow font-bold text-lg mb-3">YOUR TEAM</h2>
          <p className="text-gray-300 text-sm mb-3">
            Work with a unique team of AI agents, each with their own personality and expertise.
          </p>
          <p className="text-gray-300 text-sm">
            Guide them through the process of cracking the 9 code words needed for your escape.
          </p>
        </div>
        
        <div className="space-card p-6">
          <h2 className="text-space-yellow font-bold text-lg mb-3">THE DANGER</h2>
          <p className="text-gray-300 text-sm mb-3">
            One wrong word will trigger the alarm system, ending your mission immediately.
          </p>
          <p className="text-gray-300 text-sm">
            Each transmission counts. Choose your clues carefully and trust your agents.
          </p>
        </div>
      </motion.div>
      
      <div className="mb-12">
        <h2 className="text-space-yellow font-bold text-xl mb-4 text-center">LIVE MISSIONS</h2>
        <GameStream />
      </div>
      
      <motion.div 
        className="text-center mb-12"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <button 
          onClick={onStartGame}
          className="star-wars-button text-lg py-4 px-10 flex items-center gap-3 mx-auto"
        >
          <Play size={20} />
          <span>Start New Mission</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Index;
