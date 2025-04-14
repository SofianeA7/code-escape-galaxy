
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
  'Lightsaber', 'Force', 'Droid', 'Falcon', 'Empire',
  'Rebel', 'Jedi', 'Sith', 'Wookie', 'Tatooine',
  'Vader', 'Luke', 'Death Star', 'Speeder', 'Blaster',
  'Yoda', 'Padawan', 'Clone', 'Republic', 'Cruiser',
  'Hyperspace', 'Walker', 'Stormtrooper', 'Jabba', 'Kyber',
  'Mandalorian', 'Bounty', 'Hoth', 'Endor', 'Naboo',
  'Podracer', 'Hangar', 'Senate', 'Cantina', 'Holocron',
  'Coruscant', 'Starfighter', 'Trooper', 'Emperor', 'Smuggler'
];

export const aiAgents: AIAgentData[] = [
  {
    id: 'agent-1',
    name: 'R2-D2',
    avatar: '🤖',
    personality: 'Resourceful and determined',
    confidence: 8
  },
  {
    id: 'agent-2',
    name: 'C-3PO',
    avatar: '🧠',
    personality: 'Anxious but knowledgeable',
    confidence: 6
  },
  {
    id: 'agent-3',
    name: 'BB-8',
    avatar: '⚡',
    personality: 'Enthusiastic and loyal',
    confidence: 7
  },
  {
    id: 'agent-4',
    name: 'K-2SO',
    avatar: '🔍',
    personality: 'Blunt and strategic',
    confidence: 9
  },
  {
    id: 'agent-5',
    name: 'IG-11',
    avatar: '🎯',
    personality: 'Precise and protective',
    confidence: 8
  }
];

export const generateGameBoard = (): WordCard[] => {
  // Shuffle the words list and take 25
  const shuffledWords = [...wordsList].sort(() => Math.random() - 0.5).slice(0, 25);
  
  // Create board with word types
  const board: WordCard[] = shuffledWords.map((word, index) => {
    // 9 blue, 8 red, 7 neutral, 1 assassin
    let type: WordCard['type'] = 'neutral';
    
    if (index < 9) {
      type = 'blue';
    } else if (index < 17) {
      type = 'red';
    } else if (index < 24) {
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
  
  // Shuffle the board so types are randomly distributed
  return board.sort(() => Math.random() - 0.5);
};

export const generateGameId = (): string => {
  return `mission-${Math.floor(Math.random() * 10000)}`;
};
