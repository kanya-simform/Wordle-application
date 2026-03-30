export const GRID_ROW_LENGTH = 6;
export const GRID_COL_LENGTH = 5;

export const TOAST_MESSAGES = {
  NOT_A_WORD: "Not a word",
  SUCCESS: "You got it! 🎉",
  GAME_OVER: (word: string) => `Game over! The word was ${word.toUpperCase()}`,
  WORD_FETCH_ERROR: "Failed to load word. Please try again.",
} as const;
