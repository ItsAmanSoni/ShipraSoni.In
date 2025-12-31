"use client";

import { useState, useEffect, useRef } from "react";
import { Column, Row, Text, Button } from "@once-ui-system/core";

const wordList = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "developer", "code", "function", "component", "typescript", "javascript", "react", "angular",
  "backend", "frontend", "database", "algorithm", "framework", "software", "engineer", "design",
];

const generateWords = (count: number) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return result;
};

export function TypingGame() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);
  const [testDuration] = useState(30);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (gameActive) {
      const elapsed = testDuration - timeLeft;
      if (elapsed > 0) {
        const minutes = elapsed / 60;
        const wordsTyped = correctChars / 5;
        setWpm(Math.round(wordsTyped / minutes));

        const totalChars = correctChars + incorrectChars;
        if (totalChars > 0) {
          setAccuracy(Math.round((correctChars / totalChars) * 100));
        }
      }
    }
  }, [timeLeft, correctChars, incorrectChars, gameActive, testDuration]);

  const startGame = () => {
    const newWords = generateWords(100);
    setWords(newWords);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setCorrectChars(0);
    setIncorrectChars(0);
    setTimeLeft(testDuration);
    setWpm(0);
    setAccuracy(100);
    setGameActive(true);
    setGameStarted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endGame = () => {
    setGameActive(false);
  };

  const restartGame = () => {
    startGame();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      if (currentInput.trim() === "") return;

      const currentWord = words[currentWordIndex];

      // Only allow advancing if the word is typed correctly
      if (currentInput === currentWord) {
        setCorrectChars(correctChars + currentWord.length);
        setCurrentInput("");
        setCurrentWordIndex(currentWordIndex + 1);
      }
      // If incorrect, don't advance - user must correct it
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameActive) return;
    setCurrentInput(e.target.value);
  };

  const isWordIncorrect = (wordIndex: number) => {
    if (wordIndex !== currentWordIndex) return false;
    const word = words[wordIndex];
    if (!word || currentInput.length === 0) return false;

    // Check if any typed character is wrong
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] !== word[i]) {
        return true;
      }
    }
    return false;
  };

  const getCharClass = (wordIndex: number, charIndex: number) => {
    const word = words[wordIndex];
    if (!word) return "pending";

    // Words that have been completed
    if (wordIndex < currentWordIndex) {
      return "correct";
    }

    // Current word being typed - if word is incorrect, show all in red
    if (wordIndex === currentWordIndex) {
      if (isWordIncorrect(wordIndex)) {
        return "incorrect";
      }
      if (charIndex < currentInput.length) {
        return currentInput[charIndex] === word[charIndex] ? "correct" : "incorrect";
      }
    }

    return "pending";
  };

  const getWordClass = (wordIndex: number) => {
    if (wordIndex < currentWordIndex) return "completed";
    if (wordIndex === currentWordIndex) return "active";
    return "pending";
  };

  return (
    <Column fillWidth gap="l">
      <Column
        fillWidth
        padding="xl"
        paddingX="l"
        background="surface"
        border="neutral-medium"
        radius="l"
        gap="l"
        align="center"
        onClick={() => gameActive && inputRef.current?.focus()}
        style={{ minHeight: "500px" }}
        s={{ padding: "m", style: { minHeight: "400px" } }}
      >
        {/* Stats Row - Only visible during active game */}
        {gameStarted && gameActive && (
          <Row fillWidth horizontal="center" vertical="center" paddingBottom="m" gap="xl" s={{ gap: "m" }}>
            <Column gap="4" align="center">
              <Text variant="label-default-s" onBackground="neutral-weak">
                WPM
              </Text>
              <Text variant="heading-strong-xl" onBackground="brand-strong">
                {wpm}
              </Text>
            </Column>
            <Column gap="4" align="center">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Accuracy
              </Text>
              <Text variant="heading-strong-xl" onBackground="brand-strong">
                {accuracy}%
              </Text>
            </Column>
            <Column gap="4" align="center">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Time
              </Text>
              <Text
                variant="heading-strong-xl"
                onBackground={timeLeft < 10 ? "accent-strong" : "brand-strong"}
              >
                {timeLeft}s
              </Text>
            </Column>
          </Row>
        )}

        {/* Start Screen */}
        {!gameStarted && (
          <Column fillWidth gap="xl" align="center" vertical="center" horizontal="center" style={{ minHeight: "400px" }} s={{ gap: "l", style: { minHeight: "300px" } }}>

            <Column gap="s" align="center" paddingX="m">
              <Text variant="body-default-m" onBackground="neutral-weak" align="center">
                Test your typing speed and accuracy
              </Text>
              <Row gap="s" vertical="center" wrap>
                <Text variant="body-default-m" onBackground="brand-strong">
                  {testDuration} seconds
                </Text>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  •
                </Text>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Press Start to begin
                </Text>
              </Row>
            </Column>

            <Button size="l" variant="primary" onClick={startGame} prefixIcon="play">
              Start Test
            </Button>
          </Column>
        )}

        {/* Game Active - Typing Area */}
        {gameStarted && gameActive && (
          <Column fillWidth gap="l" vertical="center" style={{ minHeight: "300px" }} s={{ style: { minHeight: "200px" } }}>
            <div
              className="typing-words"
              style={{
                fontSize: "1.75rem",
                lineHeight: "3rem",
                fontFamily: "var(--font-body)",
                color: "var(--neutral-on-background-weak)",
                userSelect: "none",
                position: "relative",
                wordWrap: "break-word",
                overflow: "hidden",
              }}
            >
              {words.slice(0, 50).map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  style={{
                    display: "inline-block",
                    marginRight: "0.5rem",
                    marginBottom: "0.25rem",
                    opacity: getWordClass(wordIndex) === "completed" ? 0.4 : 1,
                    position: "relative",
                  }}
                >
                  {word.split("").map((char, charIndex) => {
                    const charClass = getCharClass(wordIndex, charIndex);
                    const isCurrentChar = wordIndex === currentWordIndex && charIndex === currentInput.length;

                    return (
                      <span
                        key={charIndex}
                        style={{
                          position: "relative",
                          color:
                            charClass === "correct"
                              ? "var(--brand-on-background-strong)"
                              : charClass === "incorrect"
                              ? "var(--accent-on-background-strong)"
                              : "var(--neutral-on-background-weak)",
                          transition: "color 0.05s ease",
                        }}
                      >
                        {char}
                        {isCurrentChar && gameActive && (
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "2px",
                              background: "var(--brand-on-background-strong)",
                              animation: "cursorBlink 1s infinite",
                            }}
                          />
                        )}
                      </span>
                    );
                  })}
                  {wordIndex === currentWordIndex && currentInput.length > word.length && (
                    <span style={{ color: "var(--accent-on-background-strong)" }}>
                      {currentInput.slice(word.length).split("").map((char, i) => (
                        <span key={`extra-${i}`}>{char}</span>
                      ))}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </Column>
        )}

        {/* Results Screen */}
        {gameStarted && !gameActive && (
          <Column fillWidth gap="l" align="center" vertical="center" horizontal="center" style={{ minHeight: "300px" }} s={{ style: { minHeight: "250px" } }}>

            <Row gap="xl" marginTop="l" marginBottom="l" horizontal="center" wrap s={{ gap: "m" }}>
              <Column gap="4" align="center">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  WPM
                </Text>
                <Text variant="display-strong-l" onBackground="brand-strong">
                  {wpm}
                </Text>
              </Column>

              <Column gap="4" align="center">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Accuracy
                </Text>
                <Text variant="display-strong-l" onBackground="brand-strong">
                  {accuracy}%
                </Text>
              </Column>

              <Column gap="4" align="center">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Characters
                </Text>
                <Text variant="display-strong-l" onBackground="brand-strong">
                  {correctChars}
                </Text>
              </Column>
            </Row>

            <Row fillWidth horizontal="center">
              <Button size="l" variant="primary" onClick={restartGame} prefixIcon="refresh">
                Try Again
              </Button>
            </Row>
          </Column>
        )}

        {/* Hidden input for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={!gameActive}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: "1px",
            height: "1px",
          }}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes cursorBlink {
              0%, 49% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }

            @media (max-width: 768px) {
              .typing-words {
                font-size: 1.25rem !important;
                line-height: 2.25rem !important;
              }
            }

            @media (max-width: 480px) {
              .typing-words {
                font-size: 1rem !important;
                line-height: 1.75rem !important;
              }
            }
          `
        }} />
      </Column>
    </Column>
  );
}
