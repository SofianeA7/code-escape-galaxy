
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Clipboard, Check } from 'lucide-react';
import { AIAgentData, wordsList } from '../data/gameData';
import { Button } from '@/components/ui/button';

interface DocumentationExportProps {
  onClose: () => void;
  agents: AIAgentData[];
}

const DocumentationExport: React.FC<DocumentationExportProps> = ({ onClose, agents }) => {
  const [copied, setCopied] = React.useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyToClipboard = () => {
    if (contentRef.current) {
      const content = contentRef.current.innerText;
      navigator.clipboard.writeText(content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Erreur lors de la copie :', err);
        });
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-space-darkblue border border-space-blue/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-space-blue/30 flex justify-between items-center">
          <h2 className="text-space-yellow font-bold text-xl">Documentation du Jeu - Mission Évasion Galactique</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6 flex-grow">
          <div ref={contentRef} className="documentation-content text-white">
            <h1>Documentation du Jeu - Mission Évasion Galactique</h1>
            <p>Version 1.0</p>

            <h2>1. Introduction</h2>
            <p>
              Mission Évasion Galactique est un jeu de déduction coopératif inspiré de Codenames, mais adapté pour 
              une expérience solo avec des agents IA. Le joueur incarne un espion rebelle qui doit communiquer 
              par codes avec ses agents pour identifier des mots secrets et s'échapper de l'Empire.
            </p>

            <h2>2. Structure du Code</h2>
            <h3>2.1. Architecture Générale</h3>
            <p>
              Le jeu est construit avec React et TypeScript, utilisant une architecture à base de composants
              et de hooks pour la gestion de l'état. Voici les principales parties du code :
            </p>
            <ul>
              <li><strong>src/data/gameData.ts</strong> - Définitions des types et données du jeu</li>
              <li><strong>src/hooks/useGameState.tsx</strong> - Logique principale du jeu et gestion d'état</li>
              <li><strong>src/components/</strong> - Interface utilisateur et composants visuels</li>
            </ul>

            <h3>2.2. Modèles de Données</h3>
            <p>Les principales interfaces du jeu sont :</p>
            <pre>
{`
interface WordCard {
  word: string;
  type: 'blue' | 'neutral' | 'assassin';
  revealed: boolean;
}

interface AIAgentData {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  confidence: number; // 1-10
  socialDimension: number; // 1-10
  reasoningStyle: (clue: string, words: WordCard[]) => string;
}

type GamePhase = 'home' | 'intro' | 'agents' | 'game' | 'success' | 'failure';

interface GameState {
  gameId: string;
  phase: GamePhase;
  wordGrid: WordCard[];
  selectedAgents: AIAgentData[];
  currentClue: string;
  currentNumber: number;
  remainingBlueWords: number;
  guessedThisTurn: number;
  turnsLeft: number;
  score: number;
  agentReasoning: string;
  activeAgentIndex: number;
}
`}
            </pre>

            <h3>2.3. Flux de Données</h3>
            <p>
              Le flux de données principal est géré par le hook <code>useGameState</code>, qui utilise 
              React's useState pour stocker l'état du jeu. Les actions principales incluent :
            </p>
            <ul>
              <li><strong>startNewGame</strong> - Initialise une nouvelle partie</li>
              <li><strong>submitClue</strong> - Traite un indice soumis par le joueur</li>
              <li><strong>guessWord</strong> - Gère la tentative de deviner un mot</li>
              <li><strong>endTurn</strong> - Termine le tour actuel</li>
            </ul>

            <h2>3. Agents IA</h2>
            <h3>3.1. Système d'Agents</h3>
            <p>
              Le jeu comporte {agents.length} agents IA avec des personnalités distinctes, qui réagissent 
              différemment aux indices donnés par le joueur. Chaque agent possède :
            </p>
            <ul>
              <li><strong>Personnalité</strong> - Style de communication et de comportement</li>
              <li><strong>Niveau de confiance</strong> - Influence leurs décisions (1-10)</li>
              <li><strong>Dimension sociale</strong> - Affecte leur interaction avec les autres agents (1-10)</li>
              <li><strong>Style de raisonnement</strong> - Comment ils analysent et répondent aux indices</li>
            </ul>

            <h3>3.2. Profils des Agents</h3>
            <p>Voici les agents actuellement disponibles dans le jeu :</p>
            {agents.map(agent => (
              <div key={agent.id}>
                <h4>{agent.name}</h4>
                <ul>
                  <li><strong>Personnalité :</strong> {agent.personality}</li>
                  <li><strong>Confiance :</strong> {agent.confidence}/10</li>
                  <li><strong>Dimension sociale :</strong> {agent.socialDimension}/10</li>
                  <li><strong>Style de raisonnement :</strong> {agent.reasoningStyle("exemple", []).split('.')[0]}...</li>
                </ul>
              </div>
            ))}

            <h3>3.3. Mécanismes de Décision</h3>
            <p>
              Les agents utilisent un système de vote pour déterminer quel mot choisir. Chaque agent 
              vote pour le mot qu'il croit être lié à l'indice, et le mot avec le plus de votes est 
              choisi. Ce processus est influencé par :
            </p>
            <ul>
              <li>La confiance de l'agent</li>
              <li>Sa dimension sociale (influence sur les autres)</li>
              <li>Le contexte du jeu (mots déjà révélés, etc.)</li>
            </ul>
            <p>
              Le processus simule une véritable délibération d'équipe où les agents
              parlent entre eux et atteignent une décision collective.
            </p>

            <h2>4. Règles du Jeu</h2>
            <h3>4.1. Objectif</h3>
            <p>
              Le joueur doit aider les agents à identifier tous les mots bleus (9 au total) avant d'épuiser
              leurs 10 tours ou de sélectionner l'assassin.
            </p>

            <h3>4.2. Déroulement d'une Partie</h3>
            <p>La partie se déroule ainsi :</p>
            <ol>
              <li>Le joueur examine la grille et donne un indice (un mot) et un nombre (de mots à deviner)</li>
              <li>Les agents IA délibèrent et choisissent un mot qu'ils pensent être lié à l'indice</li>
              <li>Si le mot est bleu, les agents continuent à deviner (jusqu'au nombre indiqué)</li>
              <li>Si le mot est neutre, le tour se termine</li>
              <li>Si le mot est l'assassin, la partie est perdue</li>
              <li>Le jeu continue jusqu'à ce que tous les mots bleus soient trouvés (victoire) ou que les conditions de défaite soient atteintes</li>
            </ol>

            <h3>4.3. Système de Score</h3>
            <p>
              Le score est calculé en fonction du nombre de mots bleus trouvés (100 points par mot) et
              du nombre de tours restants à la fin (50 points par tour restant).
            </p>

            <h2>5. Interface Utilisateur</h2>
            <h3>5.1. Composants Principaux</h3>
            <p>
              L'interface utilisateur est composée de plusieurs composants clés :
            </p>
            <ul>
              <li><strong>GameBoard</strong> - Affiche la grille de jeu et gère les interactions principales</li>
              <li><strong>WordGrid</strong> - Affiche la grille de mots à deviner</li>
              <li><strong>AIAgent</strong> - Représente visuellement un agent IA et ses caractéristiques</li>
              <li><strong>AgentsPresentation</strong> - Présente l'équipe d'agents au début de la partie</li>
              <li><strong>IntroSequence</strong> - Séquence d'introduction narrative au début du jeu</li>
              <li><strong>OutcomeScreen</strong> - Écran de victoire ou de défaite en fin de partie</li>
            </ul>

            <h3>5.2. Flux de Navigation</h3>
            <p>
              Le jeu suit une structure de navigation basée sur des phases :
            </p>
            <ol>
              <li><strong>home</strong> - Écran d'accueil</li>
              <li><strong>intro</strong> - Séquence d'introduction narrative</li>
              <li><strong>agents</strong> - Présentation des agents IA</li>
              <li><strong>game</strong> - Phase de jeu principale</li>
              <li><strong>success/failure</strong> - Écran de fin de partie</li>
            </ol>

            <h2>6. Dictionnaire des Mots</h2>
            <p>
              Le jeu utilise un ensemble de mots à thème Star Wars pour la grille de jeu. Voici la liste complète :
            </p>
            <pre>
{wordsList.join(', ')}
            </pre>

            <h2>7. Fonctions et Algorithmes Clés</h2>
            <h3>7.1. Génération du Plateau</h3>
            <pre>
{`
export const generateGameBoard = (): WordCard[] => {
  const shuffledWords = [...wordsList].sort(() => Math.random() - 0.5).slice(0, 25);
  
  const board: WordCard[] = shuffledWords.map((word, index) => {
    let type: WordCard['type'] = 'neutral';
    
    if (index < 9) {
      type = 'blue';
    } else if (index < 23) {
      type = 'neutral';
    } else {
      type = 'assassin';
    }
    
    return {
      word,
      type,
      revealed: false
    };
  });
  
  return board.sort(() => Math.random() - 0.5);
};
`}
            </pre>

            <h3>7.2. Système de Vote des Agents</h3>
            <p>
              Le système de vote est implémenté dans le composant GameBoard et fonctionne ainsi :
            </p>
            <ol>
              <li>Chaque agent vote pour un mot en fonction de son raisonnement</li>
              <li>Les votes sont collectés et comptabilisés</li>
              <li>Après un délai (pour simuler une délibération), le mot avec le plus de votes est choisi</li>
              <li>En cas d'égalité, un mot est choisi aléatoirement parmi ceux ayant le plus de votes</li>
            </ol>

            <h2>8. Extension et Améliorations Futures</h2>
            <h3>8.1. Intégration Backend</h3>
            <p>
              Pour transformer ce jeu en application complète, une intégration backend via Supabase est recommandée, 
              permettant :
            </p>
            <ul>
              <li>Authentification des utilisateurs</li>
              <li>Sauvegarde des parties et scores</li>
              <li>Classements et statistiques</li>
              <li>Mode multijoueur en temps réel</li>
            </ul>

            <h3>8.2. Améliorations Possibles</h3>
            <p>
              Voici quelques pistes d'amélioration pour les versions futures :
            </p>
            <ul>
              <li>Ajout de nouveaux agents IA avec des personnalités plus diversifiées</li>
              <li>Amélioration de l'algorithme de raisonnement des agents</li>
              <li>Différents thèmes et listes de mots</li>
              <li>Niveaux de difficulté avec différentes distributions de cartes</li>
              <li>Système de progression et déblocage d'agents</li>
              <li>Mode multijoueur où des joueurs réels remplacent les agents IA</li>
            </ul>

            <h3>8.3. Optimisation Technique</h3>
            <p>
              Pour une application plus robuste, considérez ces optimisations techniques :
            </p>
            <ul>
              <li>Refactorisation des composants longs comme GameBoard</li>
              <li>Tests unitaires pour les fonctions critiques</li>
              <li>Mise en cache des états et memoization pour les performances</li>
              <li>Gestion plus sophistiquée des animations pour une meilleure UX</li>
              <li>Support multilingue</li>
            </ul>

            <h2>9. Conclusion</h2>
            <p>
              Mission Évasion Galactique offre une expérience de jeu immersive grâce à son système d'agents IA
              qui simulent une équipe réelle. Le code est structuré de manière modulaire, facilitant
              les extensions et améliorations futures. Avec une intégration backend appropriée, ce jeu
              pourrait évoluer en une application complète avec des fonctionnalités sociales et compétitives.
            </p>
          </div>
        </div>
        
        <div className="p-4 border-t border-space-blue/30 flex justify-between">
          <Button
            className="flex items-center gap-2"
            onClick={handleCopyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copié!</span>
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                <span>Copier le contenu</span>
              </>
            )}
          </Button>
          
          <div className="text-sm text-gray-400">
            Copiez ce contenu et collez-le dans un document Word
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentationExport;
