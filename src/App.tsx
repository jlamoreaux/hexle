import React, { useState, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import LetterField, { LETTER_COLOR } from './components/LetterField';
import data from './codes.json';

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

enum GameResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  IN_PROGRESS = 'IN_PROGRESS'
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

const App = () => {
  const [code, setCode] = useState<number>();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [characters, setCharacters] = useState<CharacterStatus>(
    {} as CharacterStatus
  );
  const [currentIndex, setCurrentIndex] = useState<InputIndex>({
    row: 0,
    column: 0,
  });
  const [attempts, setAttempts] = useState<Array<Array<CharacterInput>>>([
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
  ]);
  const [gameResult, setGameResult] = useState<GameResult>(GameResult.IN_PROGRESS);

  const getHexCode = (code: number): string => {
    return Math.floor(code).toString(16);
  };

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

  const guessCode = (attempt: CharacterInput[]) => {
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
    const isGameWon = attempts[currentIndex.row].every(char => char.result === RESULT.CORRECT);
    if (isGameWon) {
      setGameResult(GameResult.WIN);
      setIsCompleted(true);
      return;
    }
    moveRows();
  };

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

  const moveRows = () => {
    const [row, column] = [currentIndex.row + 1, 0];
    if (currentIndex.row < 5) {
      return setCurrentIndex({ row, column });
    }
    setIsCompleted(true);
    setGameResult(GameResult.LOSS);
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

  useEffect(() => {
    const getDailyCode = () => {
      const today = new Date();
      const startDate = new Date('03-26-2022');

      const dayNumber =
       Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      return data.codes[dayNumber];
    };
    if (!code) {
      setCode(getDailyCode());
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

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteCharacter, setValueOfCurrentField]);
  return (
    <div style={{
      textAlign: 'center',
      color: LETTER_COLOR.DEFAULT,
    }}>
      <h1>HEXLE</h1>
      {gameResult === GameResult.WIN && <div>You won!</div>}
      {gameResult === GameResult.LOSS && <div>You lost!</div>}
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
              </div>;
            )
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
