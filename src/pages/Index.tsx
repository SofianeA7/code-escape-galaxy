import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameStream from '@/components/GameStream';
import IntroSequence from '@/components/IntroSequence';
import AgentsPresentation from '@/components/AgentsPresentation';
import GameBoard from '@/components/GameBoard';
import OutcomeScreen from '@/components/OutcomeScreen';
import { useGameState } from '@/hooks/useGameState';
import DocumentationExport from '@/components/DocumentationExport';
import { FileText } from 'lucide-react';
import { aiAgents } from '@/data/gameData';

export default function Home() {
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
  
  const [showDocumentation, setShowDocumentation] = useState(false);

  const renderCurrentPhase = () => {
    switch (gameState.phase) {
      case 'intro':
        return <IntroSequence onComplete={goToAgentsPhase} />;
      case 'agents':
        return <AgentsPresentation agents={gameState.selectedAgents} onComplete={goToGamePhase} onHome={resetToHome} />;
      case 'game':
        return (
          <GameBoard 
            gameState={gameState} 
            onSubmitClue={submitClue}
            onGuessWord={guessWord}
            onEndTurn={endTurn}
            onHome={resetToHome}
          />
        );
      case 'success':
        return (
          <OutcomeScreen 
            outcome="success" 
            score={gameState.score}
            onRestart={resetToHome}
          />
        );
      case 'failure':
        return (
          <OutcomeScreen 
            outcome="failure" 
            score={gameState.score}
            onRestart={resetToHome}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-black via-space-darkblue to-black flex flex-col items-center justify-center p-4">
            <motion.h1 
              className="text-space-yellow text-center text-2xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              MISSION ÉVASION GALACTIQUE
            </motion.h1>
            
            <motion.p 
              className="text-center text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Échappez-vous d'une prison impériale en communiquant par codes secrets avec vos agents rebelles IA
            </motion.p>
            
            <motion.div
              className="max-w-4xl w-full mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <GameStream />
            </motion.div>
            
            <motion.div
              className="flex flex-col space-y-4 items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <button 
                className="star-wars-button"
                onClick={startNewGame}
              >
                DÉMARRER LA MISSION
              </button>
              
              <button 
                className="text-gray-400 text-sm flex items-center gap-1 hover:text-space-yellow transition-colors"
                onClick={() => setShowDocumentation(true)}
              >
                <FileText size={16} />
                <span>Consulter la documentation</span>
              </button>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="space-background min-h-screen">
      {renderCurrentPhase()}
      {showDocumentation && (
        <DocumentationExport 
          onClose={() => setShowDocumentation(false)}
          agents={gameState.selectedAgents.length > 0 ? gameState.selectedAgents : [...aiAgents].sort(() => Math.random() - 0.5).slice(0, 3)}
        />
      )}
    </div>
  );
}
