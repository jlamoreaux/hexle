import React, { useState, useEffect, useCallback } from "react";
import Keyboard from "./components/Keyboard";
import LetterField from "./components/LetterField";
import data from "./codes.json";
import GameOver, { ColorSquare } from "./components/GameOver";
import { buttonStyle } from "./components/KeyboardButton";
import Footer from "./components/Footer";
import { BACKGROUND_COLOR, LETTER_COLOR } from "./utils";
import HelpModal from "./components/HelpModal";
import { FiShare } from "react-icons/fi";

export const HEX_CHARS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

export enum GameResult {
  WIN = "WIN",
  LOSS = "LOSS",
  IN_PROGRESS = "IN_PROGRESS",
}

export type AllowedChars = (typeof HEX_CHARS)[number];

type CharCount = {
  [char in AllowedChars]?: [number];
};

export interface CharacterInput {
  value: AllowedChars | "";
  result: RESULT;
}

export type CharacterStatus = {
  [character in AllowedChars]: RESULT;
};

interface InputIndex {
  row: number;
  column: number;
}

export enum RESULT {
  CORRECT = "correct",
  IN_WORD = "in_word",
  INCORRECT = "incorrect",
  UNKNOWN = "unknown",
}

const RowOfInputs = (props: { rowInput: Array<CharacterInput> }) => {
  const { rowInput } = props;

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {rowInput &&
        rowInput.map((input, index) => {
          return (
            <LetterField
              guessResult={input.result}
              inputValue={input.value}
              key={`input-${index}`}
            />
          );
        })}
    </div>
  );
};

/**
 * Saves data to local storage
 * @type The type of the value being saved
 * @param defaultValue the initial value to be saved
 * @param key the key of the value to be saved
 * @returns the key value pair of the object in local storage
 */
function useStickyState<Type>(
  defaultValue: Type,
  key: string
): [value: Type, setValue: any] {
  const [value, setValue] = useState<Type>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

/**
 * Retrieves an object from local storage
 * @param key the key of the value being retrieved from local storage
 * @returns the key value pair of the object in local storage
 */
const getStickyValue = (key: string): string | null => {
  return window.localStorage.getItem(key);
};

/**
 * Saves an object in local storage
 * @param key the key of the value being saved in local storage
 * @param value the value to be saved
 */
const setStickyValue = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const clearStickyValues = () => {
  window.localStorage.removeItem("characters");
  window.localStorage.removeItem("currentIndex");
  window.localStorage.removeItem("gameResult");
  window.localStorage.removeItem("isCompleted");
  window.localStorage.removeItem("attempts");
};

/**
 *
 * @returns the number of days since the game launched
 */
const getDayNumber = (): number => {
  const today = new Date();
  const startDate = new Date("2025-07-03");
  return Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );
};

/**
 * Converts a base ten number to hexidecimal
 * @param code the number to be converted into hexidecimal
 * @returns a hexidecimal value of the initial number
 */
const getHexCode = (code: number): string => {
  return Math.floor(code).toString(16);
};

/**
 * Counts the number of occurances of each character in the code
 * @param hexCode the hexidecimal code to analyze
 * @returns {CharCount} An object where the key is the character and the value is the number of occurrances
 */
const getCharCount = (hexCode: Array<AllowedChars | "">): CharCount => {
  let charCount: CharCount = {};
  hexCode.forEach((character, index) => {
    if (character !== "") {
      const char = character as AllowedChars;
      charCount[char]
        ? charCount[char]?.push(index)
        : (charCount[char] = [index]);
    }
  });
  return charCount;
};

const defaultAttemptsValue = [
  [
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
  ],
  [
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
  ],
  [
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
  ],
  [
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
  ],
  [
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
  ],
  [
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
    { value: "", result: RESULT.UNKNOWN },
  ],
] as CharacterInput[][];

const defaultCharactersValue = {} as CharacterStatus;

const App = () => {
  const [code, setCode] = useStickyState<number | null>(null, "code");
  const [attempts, setAttempts] = useState<CharacterInput[][]>(() => {
    const stickyValue = window.localStorage.getItem("attempts");
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultAttemptsValue;
  });
  const [isCompleted, setIsCompleted] = useStickyState<boolean>(
    false,
    "isCompleted"
  );
  const [characters, setCharacters] = useState<CharacterStatus>(() => {
    const stickyValue = getStickyValue("characters");
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultCharactersValue;
  });
  const [currentIndex, setCurrentIndex] = useStickyState<InputIndex>(
    { row: 0, column: 0 },
    "currentIndex"
  );
  const [gameResult, setGameResult] = useStickyState<GameResult>(
    GameResult.IN_PROGRESS,
    "gameResult"
  );
  const [isShareModalVisible, setIsShareModalVisible] =
    useState<boolean>(false);
  const [winStreak, setWinStreak] = useStickyState<number>(0, "winStreak");
  const [numGamesPlayed, setNumGamesPlayed] = useStickyState<number>(
    0,
    "numGamesPlayed"
  );
  const [totalWins, setTotalWins] = useStickyState<number>(0, "totalWins");
  const [longestStreak, setLongestStreak] = useStickyState<number>(
    0,
    "longestStreak"
  );
  const [lastGamePlayed, setLastGamePlayed] = useStickyState<number>(
    0,
    "lastGamePlayed"
  );

  const updateCharacter = useCallback((updatedChars: CharacterStatus) => {
    const newCharacters = characters;
    if (characters) {
      Object.keys(updatedChars).forEach((char) => {
        const charToReplace = char as AllowedChars;
        switch (newCharacters[charToReplace]) {
          case RESULT.CORRECT:
            break;
          case RESULT.IN_WORD:
            if (
              updatedChars[charToReplace] ===
              (RESULT.INCORRECT || RESULT.IN_WORD)
            ) {
              break;
            }
            newCharacters[charToReplace] = updatedChars[charToReplace];
            break;
          default:
            newCharacters[charToReplace] = updatedChars[charToReplace];
            break;
        }
        if (!(newCharacters[charToReplace] === RESULT.CORRECT)) {
          newCharacters[charToReplace] = updatedChars[charToReplace];
        }
      });
    }
    setCharacters(newCharacters);
  }, [characters]);

  /**
   * Analyzes the correctness of the current guess
   * @param attempt array containing all characters in the current guess
   */
  const guessCode = useCallback((attempt: CharacterInput[]): void => {
    if (!code) {
      return;
    }
    const currentAttemptValues = attempts[currentIndex.row].map((character) => {
      return character.value;
    });
    const guessedCharCount = getCharCount(currentAttemptValues);
    const guessedChars = Object.keys(guessedCharCount) as Array<AllowedChars>;
    const trueCharCount = getCharCount(
      getHexCode(code).split("") as Array<AllowedChars>
    );
    let attemptWithResults = attempt;
    guessedChars.forEach((character) => {
      let correctPositions: number[] = [];
      let inWordPositions: number[] = [];
      let incorrectPositions: number[] = [];
      const char = character as AllowedChars;
      // check for Corrects
      if (trueCharCount[char]) {
        correctPositions = guessedCharCount[char]!.filter(
          (position: number) => {
            const isCorrect = trueCharCount[char]?.includes(position);
            const charStatus = { [char]: RESULT.CORRECT } as CharacterStatus;
            isCorrect && updateCharacter(charStatus);
            return isCorrect;
          }
        );
        inWordPositions = guessedCharCount[char]!.filter((position: number) => {
          const isInWord = !trueCharCount[char]?.includes(position);
          const charStatus = { [char]: RESULT.IN_WORD } as CharacterStatus;
          isInWord && updateCharacter(charStatus);
          return isInWord;
        });
        if (
          trueCharCount[char]!.length <
          correctPositions.length + inWordPositions.length
        ) {
          incorrectPositions = inWordPositions.slice(
            trueCharCount[char]!.length - correctPositions.length,
            inWordPositions.length
          );
        }
      } else {
        incorrectPositions = guessedCharCount[char]!;
        const charStatus = { [char]: RESULT.INCORRECT } as CharacterStatus;
        updateCharacter(charStatus);
      }
      correctPositions &&
        correctPositions.forEach((position) => {
          attemptWithResults[position].result = RESULT.CORRECT;
        });
      inWordPositions &&
        inWordPositions.forEach((position) => {
          attemptWithResults[position].result = RESULT.IN_WORD;
        });
      incorrectPositions &&
        incorrectPositions.forEach((position) => {
          attemptWithResults[position].result = RESULT.INCORRECT;
        });
    });

    let currentAttempts = attempts;
    currentAttempts[currentIndex.row] = attemptWithResults;

    setAttempts(currentAttempts);
  }, [code, attempts, currentIndex.row, updateCharacter]);

  /**
   * Moves currentIndex which points to the square that is the current active input
   */
  const moveCurrentIndex = useCallback(() => {
    let { row, column } = currentIndex;
    column++;
    if (currentIndex.column < 6) {
      setCurrentIndex({
        row,
        column: column,
      });
    }
  }, [currentIndex]);

  const dayNumber = getDayNumber();

  const handleGameEnd = useCallback(() => {
    setIsCompleted(true);
    setLastGamePlayed(dayNumber);
    setNumGamesPlayed((prev: number) => prev + 1);
    setIsShareModalVisible(true);
  }, [dayNumber, setLastGamePlayed, setNumGamesPlayed]);

  const handleGameWin = useCallback(() => {
    setGameResult(GameResult.WIN);
    const currentWinStreak = winStreak + 1;
    setWinStreak(currentWinStreak);
    setTotalWins(totalWins + 1);
    if (currentWinStreak > longestStreak) {
      setLongestStreak(currentWinStreak);
    }
    handleGameEnd();
  }, [winStreak, totalWins, longestStreak, handleGameEnd, setWinStreak, setTotalWins, setLongestStreak]);

  const handleGameLoss = useCallback(() => {
    setGameResult(GameResult.LOSS);
    setWinStreak(0);
    handleGameEnd();
  }, [handleGameEnd, setWinStreak]);

  /**
   * Moves the currentIndex to the next row if another guess is available
   */
  const moveRows = useCallback(() => {
    const [row, column] = [currentIndex.row + 1, 0];
    if (currentIndex.row < 5) {
      return setCurrentIndex({ row, column });
    }
    handleGameLoss();
  }, [currentIndex.row, handleGameLoss]);

  const handleSubmit = useCallback(() => {
    if (isCompleted) return;
    guessCode(attempts[currentIndex.row]);
    const isGameWon = attempts[currentIndex.row].every(
      (char) => char.result === RESULT.CORRECT
    );
    if (isGameWon) {
      handleGameWin();
      return;
    }
    moveRows();
  }, [isCompleted, guessCode, attempts, currentIndex.row, handleGameWin, moveRows]);

  const setValueOfCurrentField = useCallback((value: AllowedChars) => {
    if (isCompleted) return;
    if (currentIndex.column > 5) {
      return;
    }
    let fieldValues = attempts;
    fieldValues[currentIndex.row][currentIndex.column].value = value;
    setAttempts(fieldValues);
    moveCurrentIndex();
  }, [isCompleted, currentIndex, attempts, moveCurrentIndex]);

  const deleteCharacter = useCallback(() => {
    if (isCompleted) return;
    if (currentIndex.column <= 0) {
      return;
    }
    let currentAttempts = attempts;
    const { row, column } = currentIndex;
    currentAttempts[row][column - 1] = {
      value: "",
      result: RESULT.UNKNOWN,
    };

    setAttempts(currentAttempts);
    setCurrentIndex({ row, column: column - 1 });
  }, [isCompleted, currentIndex, attempts]);

  const resetGame = useCallback(() => {
    clearStickyValues();
    setAttempts(defaultAttemptsValue);
    setCharacters(defaultCharactersValue);
    setCurrentIndex({ row: 0, column: 0 });
    setGameResult(GameResult.IN_PROGRESS);
    setIsCompleted(false);
    if (dayNumber > lastGamePlayed + 1) {
      setWinStreak(0);
    }
  }, [dayNumber, lastGamePlayed]);

  useEffect(() => {
    const getDailyCode = () => {
      return data.codes[dayNumber];
    };
    const currentCode = getDailyCode();

    if (code !== currentCode) {
      setCode(currentCode);
      resetGame();
    }

    const handleKeyDown = (keyDownEvent: KeyboardEvent) => {
      if (isCompleted) return;
      if (HEX_CHARS.toString().indexOf(keyDownEvent.key) !== -1) {
        const key = keyDownEvent.key as AllowedChars;
        setValueOfCurrentField(key);
      }
      if (keyDownEvent.key.toLowerCase() === "backspace") {
        deleteCharacter();
      }
      if (
        keyDownEvent.key.toLowerCase() === "enter" &&
        currentIndex.column > 5
      ) {
        handleSubmit();
      }
    };

    setStickyValue("attempts", attempts);
    setStickyValue("characters", characters);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteCharacter, setValueOfCurrentField, attempts, characters, code, currentIndex.column, dayNumber, handleSubmit, isCompleted, resetGame, setCode]);

  const showOrHideModal = (isVisible: boolean) => {
    setIsShareModalVisible(isVisible);
  };

  return (
    <div
      style={{
        textAlign: "center",
        color: LETTER_COLOR.DEFAULT,
        maxWidth: "350px",
        margin: "auto",
        left: 0,
        right: 0,
      }}
    >
      <header
        style={{
          width: "100%",
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            flex: 1,
          }}
        >
          {code && <ColorSquare hexCode={getHexCode(code)} size={40} />}
        </div>
        <h1
          style={{
            flex: 1,
          }}
        >
          HEXLE
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            height: "48px",
            flex: 1,
          }}
        >
          <button
            type="button"
            onClick={() => showOrHideModal(true)}
            style={{
              ...buttonStyle,
              backgroundColor: BACKGROUND_COLOR.INCORRECT,
              color: LETTER_COLOR.DEFAULT,
              cursor: "pointer",
              height: "auto",
              minWidth: "none",
              padding: "8px",
            }}
          >
            <FiShare />
          </button>
          <HelpModal />
        </div>
      </header>
      {code && isShareModalVisible === true && (
        <GameOver
          attempts={attempts.slice(0, currentIndex.row + 1)}
          gameResult={gameResult}
          gameNumber={dayNumber}
          numGamesPlayed={numGamesPlayed}
          longestStreak={longestStreak}
          totalWins={totalWins}
          winStreak={winStreak}
          hexCode={getHexCode(code)}
          isVisible={isShareModalVisible}
          setIsVisible={showOrHideModal}
        ></GameOver>
      )}
      <body
        style={{
          margin: "auto",
          display: "flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div>
          {attempts.map((attempt, i) => {
            return (
              <div key={i}>
                <RowOfInputs rowInput={attempt} />
              </div>
            );
          })}
          <Keyboard
            setValueOfCurrentField={setValueOfCurrentField}
            charStatus={characters}
            deleteChar={deleteCharacter}
            submit={handleSubmit}
            submitIsDisabled={currentIndex.column < 6}
          />
        </div>
      </body>
      <Footer />
    </div>
  );
};

export default App;
