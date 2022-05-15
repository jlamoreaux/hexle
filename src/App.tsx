import React, { useState, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import LetterField, {
  BACKGROUND_COLOR,
  LETTER_COLOR,
} from './components/LetterField';
import data from './codes.json';
import GameOver, { ColorSquare } from './components/GameOver';
import { buttonStyle } from './components/KeyboardButton';

export const HEX_CHARS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
] as const;

export enum GameResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  IN_PROGRESS = 'IN_PROGRESS',
}

export type AllowedChars = typeof HEX_CHARS[number];

type CharCount = {
  [char in AllowedChars]?: [number];
};

export interface CharacterInput {
  value: AllowedChars | '';
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
  CORRECT = 'correct',
  IN_WORD = 'in_word',
  INCORRECT = 'incorrect',
  UNKNOWN = 'unknown',
}

const RowOfInputs = (props: { rowInput: Array<CharacterInput> }) => {
  const { rowInput } = props;

  return (
    <div
      style={{
        display: 'flex',
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
  window.localStorage.removeItem('characters');
  window.localStorage.removeItem('currentIndex');
  window.localStorage.removeItem('gameResult');
  window.localStorage.removeItem('isCompleted');
  window.localStorage.removeItem('attempts');
};

/**
 *
 * @returns the number of days since the game launched
 */
const getDayNumber = (): number => {
  const today = new Date();
  const startDate = new Date('2022-03-26');
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
const getCharCount = (hexCode: Array<AllowedChars | ''>): CharCount => {
  let charCount: CharCount = {};
  hexCode.forEach((character, index) => {
    if (character !== '') {
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
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
  ],
  [
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
  ],
  [
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
  ],
  [
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
  ],
  [
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
  ],
  [
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
    { value: '', result: RESULT.UNKNOWN },
  ],
] as CharacterInput[][];

const defaultCharactersValue = {} as CharacterStatus;

const App = () => {
  const [code, setCode] = useStickyState<number | null>(null, 'code');
  const [attempts, setAttempts] = useState<CharacterInput[][]>(() => {
    const stickyValue = window.localStorage.getItem('attempts');
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultAttemptsValue;
  });
  const [isCompleted, setIsCompleted] = useStickyState<boolean>(
    false,
    'isCompleted'
  );
  const [characters, setCharacters] = useState<CharacterStatus>(() => {
    const stickyValue = getStickyValue('characters');
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultCharactersValue;
  });
  const [currentIndex, setCurrentIndex] = useStickyState<InputIndex>(
    { row: 0, column: 0 },
    'currentIndex'
  );
  const [gameResult, setGameResult] = useStickyState<GameResult>(
    GameResult.IN_PROGRESS,
    'gameResult'
  );
  const [isShareModalVisible, setIsShareModalVisible] =
    useState<boolean>(false);

  /**
   * Analyzes the correctness of the current guess
   * @param attempt array containing all characters in the current guess
   */
  const guessCode = (attempt: CharacterInput[]): void => {
    if (!code) {
      return;
    }
    const currentAttemptValues = attempts[currentIndex.row].map((character) => {
      return character.value;
    });
    const guessedCharCount = getCharCount(currentAttemptValues);
    const guessedChars = Object.keys(guessedCharCount) as Array<AllowedChars>;
    const trueCharCount = getCharCount(
      getHexCode(code).split('') as Array<AllowedChars>
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
  };

  const handleSubmit = () => {
    if (isCompleted) return;
    guessCode(attempts[currentIndex.row]);
    const isGameWon = attempts[currentIndex.row].every(
      (char) => char.result === RESULT.CORRECT
    );
    if (isGameWon) {
      setGameResult(GameResult.WIN);
      setIsCompleted(true);
      setIsShareModalVisible(true);
      return;
    }
    moveRows();
  };

  /**
   * Moves currentIndex which points to the square that is the current active input
   */
  const moveCurrentIndex = () => {
    let { row, column } = currentIndex;
    column++;
    if (currentIndex.column < 6) {
      setCurrentIndex({
        row,
        column: column,
      });
    }
  };

  /**
   * Moves the currentIndex to the next row if another guess is available
   */
  const moveRows = () => {
    const [row, column] = [currentIndex.row + 1, 0];
    if (currentIndex.row < 5) {
      return setCurrentIndex({ row, column });
    }
    setIsCompleted(true);
    setGameResult(GameResult.LOSS);
    setIsShareModalVisible(true);
  };

  const setValueOfCurrentField = (value: AllowedChars) => {
    if (isCompleted) return;
    if (currentIndex.column > 5) {
      return;
    }
    let fieldValues = attempts;
    fieldValues[currentIndex.row][currentIndex.column].value = value;
    setAttempts(fieldValues);
    moveCurrentIndex();
  };

  const deleteCharacter = () => {
    if (isCompleted) return;
    if (currentIndex.column <= 0) {
      return;
    }
    let currentAttempts = attempts;
    const { row, column } = currentIndex;
    currentAttempts[row][column - 1] = {
      value: '',
      result: RESULT.UNKNOWN,
    };

    setAttempts(currentAttempts);
    setCurrentIndex({ row, column: column - 1 });
  };

  const updateCharacter = (updatedChars: CharacterStatus) => {
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
  };

  const resetGame = () => {
    clearStickyValues();
    setAttempts(defaultAttemptsValue);
    setCharacters(defaultCharactersValue);
    setCurrentIndex({ row: 0, column: 0 });
    setGameResult(GameResult.IN_PROGRESS);
    setIsCompleted(false);
  };

  useEffect(() => {
    const getDailyCode = () => {
      const dayNumber = getDayNumber();
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
      if (keyDownEvent.key.toLowerCase() === 'backspace') {
        deleteCharacter();
      }
      if (
        keyDownEvent.key.toLowerCase() === 'enter' &&
        currentIndex.column > 5
      ) {
        handleSubmit();
      }
    };

    setStickyValue('attempts', attempts);
    setStickyValue('characters', characters);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteCharacter, setValueOfCurrentField, attempts, characters]);

  const showOrHideModal = (isVisible: boolean) => {
    setIsShareModalVisible(isVisible);
  };

  return (
    <div
      style={{
        textAlign: 'center',
        color: LETTER_COLOR.DEFAULT,
        maxWidth: '350px',
        margin: 'auto',
        left: 0,
        right: 0,
      }}
    >
      <header
        style={{
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '48px',
            top: '4px',
            border: `2px solid ${LETTER_COLOR.DEFAULT}`,
            borderRadius: '4px',
          }}
        >
          {code && <ColorSquare hexCode={getHexCode(code)} size={40} />}
        </div>
        <button
          type="button"
          onClick={() => showOrHideModal(true)}
          style={{
            ...buttonStyle,
            backgroundColor: BACKGROUND_COLOR.INCORRECT,
            color: LETTER_COLOR.DEFAULT,
            cursor: 'pointer',
            height: 'auto',
            minWidth: 'none',
            padding: '8px',
            position: 'absolute',
            right: '24px',
          }}
        >
          Share
        </button>
        <h1>HEXLE</h1>
      </header>
      {code && isShareModalVisible === true && (
        <GameOver
          attempts={attempts.slice(0, currentIndex.row + 1)}
          gameResult={gameResult}
          gameNumber={getDayNumber()}
          hexCode={getHexCode(code)}
          isVisible={isShareModalVisible}
          setIsVisible={showOrHideModal}
        ></GameOver>
      )}
      <div
        style={{
          margin: 'auto',
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
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
      </div>
    </div>
  );
};

export default App;
