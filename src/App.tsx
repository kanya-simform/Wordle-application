import { useState } from "react";
import KeyboardEntry from "./components/KeyboardEntry";
import Navbar from "./components/Navbar";
import WordleText from "./components/WordleText";

function App() {
  const [misplacedLetters, setMisplacedLetters] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [incorrectLetters, setIncorrectLetters] = useState<string[]>([]);
  return (
    <>
      <Navbar />
      <WordleText
        setMisplacedLetters={setMisplacedLetters}
        setCorrectLetters={setCorrectLetters}
        setIncorrectLetters={setIncorrectLetters}
      />
      <KeyboardEntry
        misplacedLetters={misplacedLetters}
        correctLetters={correctLetters}
        incorrectLetters={incorrectLetters}
      />
    </>
  );
}

export default App;
