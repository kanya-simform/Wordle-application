import { useEffect, memo } from "react";

// Keyboard layout organized by rows like a real QWERTY keyboard
const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

interface KeyboardEntryProps {
  misplacedLetters: string[];
  correctLetters: string[];
  incorrectLetters: string[];
}

const KeyboardEntry = ({
  misplacedLetters,
  correctLetters,
  incorrectLetters,
}: KeyboardEntryProps) => {
  const handleKeyClick = (key: string) => {
    const event = new KeyboardEvent("keyup", {
      key:
        key === "BACKSPACE"
          ? "Backspace"
          : key === "ENTER"
            ? "Enter"
            : key.toLowerCase(),
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  const getKeyClassName = (key: string) => {
    const baseClasses = `bg-gray-600 hover:bg-gray-500 text-white font-bold rounded cursor-pointer flex items-center justify-center transition-colors duration-150 ${key}`;

    if (key === "ENTER" || key === "BACKSPACE") {
      return `${baseClasses} h-12 px-3 text-sm`;
    }
    return `${baseClasses} h-12 w-10`;
  };

  useEffect(() => {
    if (correctLetters && correctLetters.length > 0) {
      correctLetters.forEach((letter) => {
        const letterElement = document.getElementsByClassName(
          letter,
        )[0] as HTMLElement;
        if (letterElement) {
          letterElement.style.backgroundColor = "green";
        }
      });
    }
    if (misplacedLetters && misplacedLetters.length > 0) {
      misplacedLetters.forEach((letter) => {
        const letterElement = document.getElementsByClassName(
          letter,
        )[0] as HTMLElement;
        if (letterElement) {
          letterElement.style.backgroundColor = "#c6d160";
        }
      });
    }
    if (incorrectLetters && incorrectLetters.length > 0) {
      incorrectLetters.forEach((letter) => {
        const letterElement = document.getElementsByClassName(
          letter,
        )[0] as HTMLElement;
        if (letterElement) {
          letterElement.style.backgroundColor = "gray";
        }
      });
    }
  }, [correctLetters, misplacedLetters, incorrectLetters]);

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClassName(key)}
              onClick={() => handleKeyClick(key)}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default memo(KeyboardEntry);
