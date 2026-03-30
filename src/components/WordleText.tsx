import { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance, dictionaryInstance } from "../service/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import {
  GRID_COL_LENGTH,
  GRID_ROW_LENGTH,
  TOAST_MESSAGES,
} from "../constants/gameConstants";

type CellType = {
  x: number;
  y: number;
};

// "" means no color applied yet
type CellColor = "green" | "#c6d160" | "gray" | "";

type WordleTextPropsType = {
  updateLetterColors: (
    correct: string[],
    misplaced: string[],
    incorrect: string[]
  ) => void;
  resetLetterColors: () => void;
};

const cellInitialValue: CellType = { x: 0, y: 0 };

const makeEmptyGrid = (): string[][] =>
  Array.from({ length: GRID_ROW_LENGTH }, () =>
    Array.from({ length: GRID_COL_LENGTH }, () => "")
  );

const makeEmptyCellColors = (): CellColor[][] =>
  Array.from({ length: GRID_ROW_LENGTH }, () =>
    Array.from({ length: GRID_COL_LENGTH }, (): CellColor => "")
  );

/** Pure function — no component state needed */
const isValidWord = async (word: string): Promise<boolean> => {
  try {
    await dictionaryInstance.get(`/${word}`);
    return true;
  } catch {
    return false;
  }
};

const WordleText = ({
  updateLetterColors,
  resetLetterColors,
}: WordleTextPropsType) => {
  const [selectedCell, setSelectedCell] = useState<CellType>(cellInitialValue);
  const [wordEntered, setWordEntered] = useState("");
  const [originalWord, setOriginalWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState<string[][]>(makeEmptyGrid);
  const [cellColors, setCellColors] = useState<CellColor[][]>(makeEmptyCellColors);

  const generateWord = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api?words=1&length=5");
      setOriginalWord(response.data[0]);
    } catch {
      toast.error(TOAST_MESSAGES.WORD_FETCH_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetGame = useCallback(() => {
    setSelectedCell(cellInitialValue);
    setWordEntered("");
    setGameOver(false);
    setGrid(makeEmptyGrid());
    setCellColors(makeEmptyCellColors());
    resetLetterColors();
    generateWord();
  }, [generateWord, resetLetterColors]);

  const handleWordCheck = useCallback(async () => {
    if (gameOver) return;

    const isValid = await isValidWord(wordEntered.toLowerCase());
    if (!isValid) {
      toast.info(TOAST_MESSAGES.NOT_A_WORD);
      return;
    }

    const guess = wordEntered.toLowerCase().split("");
    const answer = originalWord.toLowerCase().split("");

    const correctlyPlaced: CellType[] = [];
    const misplaced: CellType[] = [];
    const incorrectlyPlaced: CellType[] = [];

    const answerUsed = new Array<boolean>(GRID_COL_LENGTH).fill(false);
    const guessMatched = new Array<boolean>(GRID_COL_LENGTH).fill(false);

    // Pass 1: exact position matches (green)
    for (let i = 0; i < GRID_COL_LENGTH; i++) {
      if (guess[i] === answer[i]) {
        correctlyPlaced.push({ x: selectedCell.x, y: i });
        answerUsed[i] = true;
        guessMatched[i] = true;
      }
    }

    // Pass 2: correct letter, wrong position (yellow)
    // Each answer letter can only be matched once to prevent over-counting duplicates.
    for (let i = 0; i < GRID_COL_LENGTH; i++) {
      if (guessMatched[i]) continue;
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        if (answerUsed[j]) continue;
        if (guess[i] === answer[j]) {
          misplaced.push({ x: selectedCell.x, y: i });
          answerUsed[j] = true;
          break;
        }
      }
    }

    // Pass 3: letters not in the word at all (gray)
    for (let i = 0; i < GRID_COL_LENGTH; i++) {
      if (
        !guessMatched[i] &&
        !misplaced.some((c) => c.x === selectedCell.x && c.y === i)
      ) {
        incorrectlyPlaced.push({ x: selectedCell.x, y: i });
      }
    }

    // Apply cell background colors via React state — no direct DOM writes
    setCellColors((prev) => {
      const next = prev.map((row) => [...row]) as CellColor[][];
      correctlyPlaced.forEach((c) => {
        next[c.x][c.y] = "green";
      });
      misplaced.forEach((c) => {
        next[c.x][c.y] = "#c6d160";
      });
      incorrectlyPlaced.forEach((c) => {
        next[c.x][c.y] = "gray";
      });
      return next;
    });

    // Derive letter values from the tracked word string — no DOM reads needed
    const correctLetters = correctlyPlaced.map((c) =>
      wordEntered[c.y].toUpperCase()
    );
    const misplacedLetters = misplaced.map((c) =>
      wordEntered[c.y].toUpperCase()
    );
    const incorrectLetters = incorrectlyPlaced.map((c) =>
      wordEntered[c.y].toUpperCase()
    );
    updateLetterColors(correctLetters, misplacedLetters, incorrectLetters);

    const isWon = originalWord.toLowerCase() === wordEntered.toLowerCase();
    const nextRow = selectedCell.x + 1;

    if (isWon) {
      toast.success(TOAST_MESSAGES.SUCCESS);
      setGameOver(true);
    } else if (nextRow >= GRID_ROW_LENGTH) {
      // Player used all 6 attempts — reveal the answer
      setGameOver(true);
      setTimeout(() => {
        toast.error(TOAST_MESSAGES.GAME_OVER(originalWord));
      }, 500);
    }

    setWordEntered("");
    setSelectedCell({ x: nextRow, y: 0 });
  }, [
    gameOver,
    wordEntered,
    originalWord,
    selectedCell,
    updateLetterColors,
  ]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameOver || isLoading) return;

      if (
        (event.key === "Backspace" || event.key === "Delete") &&
        selectedCell.y > 0
      ) {
        const newY = selectedCell.y - 1;
        setGrid((prev) => {
          const next = prev.map((row) => [...row]);
          next[selectedCell.x][newY] = "";
          return next;
        });
        setSelectedCell((prev) => ({ ...prev, y: newY }));
        setWordEntered((prev) => prev.slice(0, -1));
        return;
      }

      if (
        event.key === "Enter" &&
        selectedCell.x < GRID_ROW_LENGTH &&
        selectedCell.y === GRID_COL_LENGTH
      ) {
        handleWordCheck();
        return;
      }

      const isLetter = event.key.length === 1 && /^[a-zA-Z]$/.test(event.key);
      if (
        !isLetter ||
        selectedCell.y >= GRID_COL_LENGTH ||
        selectedCell.x >= GRID_ROW_LENGTH
      )
        return;

      const letter = event.key.toUpperCase();
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[selectedCell.x][selectedCell.y] = letter;
        return next;
      });
      setWordEntered((prev) => prev + letter);
      setSelectedCell((prev) => ({ ...prev, y: prev.y + 1 }));
    },
    [gameOver, isLoading, selectedCell, handleWordCheck]
  );

  // Keep a ref to the latest handler so the event listener is only registered
  // once and always calls the up-to-date closure without repeated add/remove.
  const handleKeyPressRef = useRef(handleKeyPress);
  handleKeyPressRef.current = handleKeyPress;

  useEffect(() => {
    generateWord();
  }, [generateWord]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) =>
      handleKeyPressRef.current(event);
    document.addEventListener("keyup", listener);
    return () => document.removeEventListener("keyup", listener);
  }, []);

  return (
    <div className="flex flex-col w-full my-11 items-center">
      {isLoading ? (
        <div className="text-white text-xl">Loading…</div>
      ) : (
        <div className="grid grid-cols-5 grid-rows-6 gap-2 z-0">
          {Array.from({ length: GRID_ROW_LENGTH }, (_, i) =>
            Array.from({ length: GRID_COL_LENGTH }, (_, j) => (
              <div key={`key${i}${j}`} className="h-full w-full flex items-center">
                <input
                  className="h-16 w-16 border-gray-700 border-2 text-white text-center text-4xl font-extrabold"
                  value={grid[i][j]}
                  readOnly
                  tabIndex={-1}
                  style={
                    cellColors[i][j]
                      ? { backgroundColor: cellColors[i][j] }
                      : undefined
                  }
                  aria-label={`Row ${i + 1}, Column ${j + 1}`}
                />
              </div>
            ))
          )}
        </div>
      )}
      {gameOver && (
        <button
          className="mt-6 px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
          onClick={resetGame}
          aria-label="Start a new game"
        >
          New Game
        </button>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default WordleText;
