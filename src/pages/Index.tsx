
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import GameStream from '../components/GameStream';
import IntroSequence from '../components/IntroSequence';
import AgentsPresentation from '../components/AgentsPresentation';
import GameBoard from '../components/GameBoard';
import OutcomeScreen from '../components/OutcomeScreen';
import { Play } from 'lucide-react';

const Index = () => {
  const { 
    gameState, 
    startNewGame, 
    goToAgentsPhase,
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
        return <IntroSequence onComplete={goToAgentsPhase} />;
      
      case 'agents':
        return (
          <AgentsPresentation 
            agents={gameState.selectedAgents} 
            onComplete={goToGamePhase} 
            onHome={resetToHome}
          />
        );
        
      case 'game':
        return (
          <div className="container mx-auto px-4 py-8">
            <GameBoard 
              gameState={gameState}
              onSubmitClue={submitClue}
              onGuessWord={guessWord}
              onEndTurn={endTurn}
              onHome={resetToHome}
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
          MISSION ÉVASION GALACTIQUE
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-300 max-w-xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Dirigez une équipe d'agents IA pour décrypter les codes et s'échapper des griffes de l'Empire
        </motion.p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="space-card p-6">
          <h2 className="text-space-yellow font-bold text-lg mb-3">LA MISSION</h2>
          <p className="text-gray-300 text-sm mb-3">
            En tant qu'espion rebelle capturé, vous devez utiliser des messages codés pour communiquer avec votre équipe IA.
          </p>
          <p className="text-gray-300 text-sm">
            Donnez-leur des indices pour identifier les codes d'évasion sans déclencher la sécurité de l'Empire.
          </p>
        </div>
        
        <div className="space-card p-6">
          <h2 className="text-space-yellow font-bold text-lg mb-3">VOTRE ÉQUIPE</h2>
          <p className="text-gray-300 text-sm mb-3">
            Travaillez avec une équipe unique d'agents IA historiques, chacun ayant sa propre personnalité et dimension sociale.
          </p>
          <p className="text-gray-300 text-sm">
            Ensemble, ils discuteront et voteront pour décrypter les 9 mots de code nécessaires à votre évasion.
          </p>
        </div>
        
        <div className="space-card p-6">
          <h2 className="text-space-yellow font-bold text-lg mb-3">LE DANGER</h2>
          <p className="text-gray-300 text-sm mb-3">
            Un seul mot incorrect déclenchera le système d'alarme, mettant fin à votre mission immédiatement.
          </p>
          <p className="text-gray-300 text-sm">
            Chaque transmission compte. Choisissez vos indices avec soin et faites confiance au vote de vos agents.
          </p>
        </div>
      </motion.div>
      
      <div className="mb-12">
        <h2 className="text-space-yellow font-bold text-xl mb-4 text-center">MISSIONS EN COURS</h2>
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
          <span>Démarrer une nouvelle mission</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Index;
