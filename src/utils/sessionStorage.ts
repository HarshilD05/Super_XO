import { Difficulty } from '../pages/HomePage';

// Session storage keys
const STORAGE_KEYS = {
  DIFFICULTY: 'superxo-difficulty',
  GAME_MODE: 'superxo-game-mode',
} as const;

// Difficulty management
export const getDifficultyFromStorage = (): Difficulty => {
  const saved = sessionStorage.getItem(STORAGE_KEYS.DIFFICULTY);
  if (saved && ['easy', 'medium', 'hard'].includes(saved)) {
    return saved as Difficulty;
  }
  return 'easy'; // Default value
};

export const saveDifficultyToStorage = (difficulty: Difficulty): void => {
  sessionStorage.setItem(STORAGE_KEYS.DIFFICULTY, difficulty);
};

// Game mode management
export const getGameModeFromStorage = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.GAME_MODE);
};

export const saveGameModeToStorage = (gameMode: string): void => {
  sessionStorage.setItem(STORAGE_KEYS.GAME_MODE, gameMode);
};

// Clear all game data
export const clearGameStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });
};