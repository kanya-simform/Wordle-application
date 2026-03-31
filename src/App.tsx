import { useState } from "react";
import KeyboardEntry from "./components/KeyboardEntry";
import Navbar from "./components/Navbar";
import WordleText from "./components/WordleText";

function App() {
  const [letterColors, setLetterColors] = useState<Record<string, string>>({});

  /**
   * Accumulates letter-color feedback across guesses with priority:
   *   correct (green) > misplaced (yellow) > incorrect (gray)
   * A letter already marked green is never downgraded.
   */
  const updateLetterColors = (
    correct: string[],
    misplaced: string[],
    incorrect: string[]
  ) => {
    setLetterColors((prev) => {
      const updated = { ...prev };
      incorrect.forEach((l) => {
        const key = l.toUpperCase();
        if (!updated[key]) updated[key] = "gray";
      });
      misplaced.forEach((l) => {
        const key = l.toUpperCase();
        if (updated[key] !== "green") updated[key] = "#c6d160";
      });
      correct.forEach((l) => {
        updated[l.toUpperCase()] = "green";
      });
      return updated;
    });
  };

  const resetLetterColors = () => setLetterColors({});

  return (
    <>
      <Navbar />
      <WordleText
        updateLetterColors={updateLetterColors}
        resetLetterColors={resetLetterColors}
      />
      <KeyboardEntry letterColors={letterColors} />
    </>
  );
}

export default App;
