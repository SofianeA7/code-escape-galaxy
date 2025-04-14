
export interface WordCard {
  word: string;
  type: 'blue' | 'red' | 'neutral' | 'assassin';
  revealed: boolean;
}

export interface AIAgentData {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  confidence: number; // 1-10
}

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

export const aiAgents: AIAgentData[] = [
  {
    id: 'agent-1',
    name: 'R2-D2',
    avatar: '🤖',
    personality: 'Débrouillard et déterminé',
    confidence: 8
  },
  {
    id: 'agent-2',
    name: 'C-3PO',
    avatar: '🧠',
    personality: 'Anxieux mais érudit',
    confidence: 6
  },
  {
    id: 'agent-3',
    name: 'BB-8',
    avatar: '⚡',
    personality: 'Enthousiaste et loyal',
    confidence: 7
  },
  {
    id: 'agent-4',
    name: 'K-2SO',
    avatar: '🔍',
    personality: 'Direct et stratégique',
    confidence: 9
  },
  {
    id: 'agent-5',
    name: 'IG-11',
    avatar: '🎯',
    personality: 'Précis et protecteur',
    confidence: 8
  }
];

export const generateGameBoard = (): WordCard[] => {
  // Mélange la liste de mots et en prend 25
  const shuffledWords = [...wordsList].sort(() => Math.random() - 0.5).slice(0, 25);
  
  // Création du plateau avec types de mots
  const board: WordCard[] = shuffledWords.map((word, index) => {
    // 9 bleus, 8 rouges, 6 neutres, 2 assassins
    let type: WordCard['type'] = 'neutral';
    
    if (index < 9) {
      type = 'blue';
    } else if (index < 17) {
      type = 'red';
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
