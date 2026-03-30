import { useEffect } from "react";

// Keyboard layout organized by rows like a real QWERTY keyboard
const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

interface KeyboardEntryProps {
  letterColors: Record<string, string>;
}

const KeyboardEntry = ({ letterColors }: KeyboardEntryProps) => {
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

  // Apply accumulated letter colors to matching keyboard keys
  useEffect(() => {
    Object.entries(letterColors).forEach(([letter, color]) => {
      const elements = document.getElementsByClassName(letter);
      if (elements[0]) {
        (elements[0] as HTMLElement).style.backgroundColor = color;
      }
    });
  }, [letterColors]);

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClassName(key)}
              onClick={() => handleKeyClick(key)}
              aria-label={
                key === "BACKSPACE"
                  ? "Backspace"
                  : key === "ENTER"
                  ? "Enter"
                  : `Letter ${key}`
              }
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KeyboardEntry;
