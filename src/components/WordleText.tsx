import { useEffect, useState, useMemo, useCallback } from "react";
import { dictionaryInstance } from "../service/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import { getRandomWord } from "../../utils";

const gridRowLength = 6;
const gridColLength = 5;

const cellInitialValue = {
  x: 0,
  y: 0,
};

type CellType = {
  x: number;
  y: number;
};

type WordleTextPropsType = {
  setCorrectLetters: React.Dispatch<React.SetStateAction<string[]>>;
  setMisplacedLetters: React.Dispatch<React.SetStateAction<string[]>>;
  setIncorrectLetters: React.Dispatch<React.SetStateAction<string[]>>;
};

const WordleText = ({
  setCorrectLetters,
  setMisplacedLetters,
  setIncorrectLetters,
}: WordleTextPropsType) => {
  const [selectedCell, setSelectedCell] = useState<CellType>(cellInitialValue);
  const [wordEntered, setWordEntered] = useState("");
  const [originalWord, setOriginalWord] = useState("");
  const [misplacedCell, setMisplacedCell] = useState<CellType[]>([]);
  const [correctCell, setCorrectCell] = useState<CellType[]>([]);
  const [incorrectCell, setIncorrectCell] = useState<CellType[]>([]);

  // Memoize grid generation to prevent recreation on every render
  const grids = useMemo(() => {
    const elements = [];
    for (let i = 0; i < gridRowLength; i++) {
      for (let j = 0; j < gridColLength; j++) {
        elements.push(
          <div key={`key${i}${j}`} className="h-full w-full flex items-center">
            <input
              className="h-16 w-16 border-gray-700 border-2 text-white text-center text-4xl font-extrabold"
              id={`element${i}${j}`}
              disabled
            />
          </div>,
        );
      }
    }
    return elements;
  }, []);

  const isValidWord = async (word: string) => {
    try {
      await dictionaryInstance.get(`/${word}`);

      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  };

  const handleWordCheck = async () => {
    const isValid = await isValidWord(wordEntered.toLowerCase());
    if (!isValid) {
      toast.info("Not a Word");
      return;
    }
    setCorrectLetters([]);
    setMisplacedLetters([]);
    setIncorrectCell([]);
    const misplaced: CellType[] = [];
    const correctlyPlaced: CellType[] = [];
    const incorrectlyPlaced: CellType[] = [];

    for (let i = 0; i < originalWord.length; i++) {
      if (originalWord[i].toLowerCase() === wordEntered[i].toLowerCase()) {
        correctlyPlaced.push({ x: selectedCell.x, y: i });
      }
    }

    for (let i = 0; i < wordEntered.length; i++) {
      for (let j = 0; j < originalWord.length; j++) {
        const index: number = correctlyPlaced.findIndex((cell) => {
          const contentForCorrect = document.getElementById(
            `element${cell.x}${cell.y}`,
          ) as HTMLInputElement;

          const contentForCurrent = document.getElementById(
            `element${selectedCell.x}${i}`,
          ) as HTMLInputElement;

          return (
            (cell.x === selectedCell.x && cell.y === i) ||
            contentForCorrect.value === contentForCurrent.value
          );
        });
        if (
          i !== j &&
          wordEntered[i].toLowerCase() === originalWord[j].toLowerCase() &&
          index === -1
        ) {
          misplaced.push({ x: selectedCell.x, y: i });
        }
      }
    }

    for (let i = 0; i < wordEntered.length; i++) {
      const indexCorrect = correctlyPlaced.findIndex(
        (cell) => cell.x === selectedCell.x && cell.y === i,
      );
      if (indexCorrect !== -1) continue;
      const indexMisplaced = misplaced.findIndex(
        (cell) => cell.x === selectedCell.x && cell.y === i,
      );
      if (indexMisplaced !== -1) continue;

      incorrectlyPlaced.push({ x: selectedCell.x, y: i });
    }

    setCorrectCell([...correctlyPlaced]);
    setMisplacedCell([...misplaced]);
    setIncorrectCell([...incorrectlyPlaced]);
    if (originalWord.toLowerCase() === wordEntered.toLowerCase()) {
      alert("SUCCESS!");
    }
    setWordEntered("");
    setSelectedCell((prevSelectedCell) => ({
      x: prevSelectedCell.x + 1,
      y: 0,
    }));
  };

  const generateWord = useCallback(() => {
    const word = getRandomWord();
    setOriginalWord(word);
    console.log(word);
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (
        (event.key === "Backspace" || event.key === "Delete") &&
        selectedCell.y !== 0
      ) {
        const newY = selectedCell.y - 1;
        const element = document.getElementById(
          `element${selectedCell.x}${newY}`,
        ) as HTMLInputElement;
        element.value = "";
        setWordEntered((prevWord: string) => {
          return prevWord
            .split("")
            .slice(0, prevWord.length - 1)
            .join("");
        });
        setSelectedCell((prev) => ({ ...prev, y: newY }));
        return;
      }

      if (
        event.key === "Enter" &&
        selectedCell.x < gridRowLength &&
        selectedCell.y === gridColLength
      ) {
        handleWordCheck();
        return;
      }
      const condition =
        ((event.key.charCodeAt(0) >= 97 && event.key.charCodeAt(0) <= 122) ||
          (event.key.charCodeAt(0) >= 65 && event.key.charCodeAt(0) <= 90)) &&
        event.key.length === 1;

      if (!condition) return;

      const element = document.getElementById(
        `element${selectedCell.x}${selectedCell.y}`,
      ) as HTMLInputElement;

      element.value = event.key.toUpperCase();
      setWordEntered((word) => {
        return `${word}${element.value}`;
      });
      if (selectedCell.y < gridColLength) {
        setSelectedCell((prevSelectedCell) => ({
          ...prevSelectedCell,
          y: prevSelectedCell.y + 1,
        }));
      }
    },
    [selectedCell, wordEntered, originalWord],
  );

  const markCorrectGreen = useCallback(() => {
    const correctLetters = [];
    for (const cell of correctCell) {
      const element = document.getElementById(
        `element${cell.x}${cell.y}`,
      ) as HTMLInputElement;
      correctLetters.push(element.value);
      element.style.backgroundColor = "green";
    }
    setCorrectLetters(correctLetters);
    setCorrectCell([]);
  }, [correctCell, setCorrectLetters]);

  const markMisplacedYellow = useCallback(() => {
    const misplacedLetters = [];
    for (const cell of misplacedCell) {
      const element = document.getElementById(
        `element${cell.x}${cell.y}`,
      ) as HTMLInputElement;
      misplacedLetters.push(element.value);
      element.style.backgroundColor = "#c6d160";
    }
    setMisplacedLetters(misplacedLetters);
    setMisplacedCell([]);
  }, [misplacedCell, setMisplacedLetters]);

  const markIncorrectGray = useCallback(() => {
    const incorrectLetters = [];
    for (const cell of incorrectCell) {
      const element = document.getElementById(
        `element${cell.x}${cell.y}`,
      ) as HTMLInputElement;
      incorrectLetters.push(element.value);
      element.style.backgroundColor = "gray";
    }
    setIncorrectLetters(incorrectLetters);
    setIncorrectCell([]);
  }, [incorrectCell, setIncorrectLetters]);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [selectedCell, wordEntered, originalWord]);

  useEffect(() => {
    generateWord();
  }, []);

  useEffect(() => {
    if (correctCell.length !== 0) {
      markCorrectGreen();
    }
  }, [correctCell]);

  useEffect(() => {
    if (misplacedCell.length !== 0) {
      markMisplacedYellow();
    }
  }, [misplacedCell]);

  useEffect(() => {
    if (incorrectCell.length !== 0) {
      markIncorrectGray();
    }
  }, [incorrectCell]);

  return (
    <div className="flex w-full my-11 justify-center">
      <div className="grid grid-cols-5 grid-rows-6 gap-2 z-0">{grids}</div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default WordleText;
