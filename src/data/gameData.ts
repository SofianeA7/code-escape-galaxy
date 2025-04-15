export interface WordCard {
  word: string;
  type: 'blue' | 'neutral' | 'assassin';
  revealed: boolean;
}

export interface AIAgentData {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  confidence: number; // 1-10
  reasoningStyle: (clue: string, words: WordCard[]) => string;
}

export const aiAgents: AIAgentData[] = [
  {
    id: 'agent-1',
    name: 'Yoda',
    avatar: '👽',
    personality: 'Sage et mystérieux',
    confidence: 9,
    reasoningStyle: (clue, words) => {
      const unrevealed = words.filter(word => !word.revealed).map(w => w.word);
      const randomWords = unrevealed.slice(0, 3).join(", ");
      return `Mmm, à "${clue}" lié, ce mot être doit. ${randomWords}, ces mots examiner je dois. Forte avec celui-ci, la Force est.`;
    }
  },
  {
    id: 'agent-2',
    name: 'Nicolas Tesla',
    avatar: '⚡',
    personality: 'Génie inventif',
    confidence: 8,
    reasoningStyle: (clue, words) => {
      const unrevealed = words.filter(word => !word.revealed).map(w => w.word);
      const randomWord = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      return `Hypothèse: l'indice "${clue}" suggère une connexion électromagnétique. Procédons par élimination des variables. Si nous considérons l'étymologie et les champs sémantiques, le mot "${randomWord}" présente une corrélation de 87% avec notre objectif.`;
    }
  },
  {
    id: 'agent-3',
    name: 'Jack l\'Éventreur',
    avatar: '🔪',
    personality: 'Mystérieux et calculateur',
    confidence: 7,
    reasoningStyle: (clue, words) => {
      const unrevealed = words.filter(word => !word.revealed).map(w => w.word);
      const randomWord = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      return `*rire sinistre* Mon cher Watson, je trancherai ce mystère avec précision. "${clue}" évoque un souvenir sanglant... Le mot "${randomWord}" nous appelle depuis les ombres de Whitechapel.`;
    }
  },
  {
    id: 'agent-4',
    name: 'Gengis Khan',
    avatar: '🏹',
    personality: 'Conquérant impitoyable',
    confidence: 10,
    reasoningStyle: (clue, words) => {
      const unrevealed = words.filter(word => !word.revealed).map(w => w.word);
      const randomWord = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      return `Par les steppes de Mongolie! L'indice "${clue}" sera conquis comme mes ennemis. J'écrase les doutes et plante mon étendard sur le mot "${randomWord}"! Ma horde victorieuse ne connaît pas la défaite!`;
    }
  }
];

export const wordsList = [
  'Sabre laser', 'Force', 'Droïde', 'Faucon', 'Empire',
  'Rebelle', 'Jedi', 'Sith', 'Wookie', 'Tatooine',
  'Vader', 'Luke', 'Étoile de la Mort', 'Speeder', 'Blaster',
  'Yoda', 'Padawan', 'Clone', 'République', 'Croiseur',
  'Hyperespace', 'Marcheur', 'Stormtrooper', 'Jabba', 'Kyber',
  'Mandalorien', 'Prime', 'Hoth', 'Endor', 'Naboo',
  'Module de course', 'Hangar', 'Sénat', 'Cantina', 'Holocron',
  'Coruscant', 'Chasseur', 'Trooper', 'Empereur', 'Contrebandier'
];

export const generateGameBoard = (): WordCard[] => {
  // Mélange la liste de mots et en prend 25
  const shuffledWords = [...wordsList].sort(() => Math.random() - 0.5).slice(0, 25);
  
  // Création du plateau avec types de mots
  const board: WordCard[] = shuffledWords.map((word, index) => {
    // 9 bleus, 14 neutres, 2 assassins
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
  
  // Mélange le plateau pour que les types soient distribués aléatoirement
  return board.sort(() => Math.random() - 0.5);
};

export const generateGameId = (): string => {
  return `mission-${Math.floor(Math.random() * 10000)}`;
};

export const getAgentGuess = (words: WordCard[], clue: string): number => {
  // Cette fonction simule la façon dont un agent tente de deviner un mot basé sur l'indice
  const unrevealedWords = words.filter(word => !word.revealed);
  const blueWords = unrevealedWords.filter(word => word.type === 'blue');
  
  if (blueWords.length === 0) return -1;
  
  // Les agents vont toujours essayer de deviner un mot bleu!
  // Simulation d'une "intelligence" très basique
  return words.findIndex(word => 
    word.type === 'blue' && !word.revealed
  );
};
