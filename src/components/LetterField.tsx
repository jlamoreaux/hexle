import React from 'react';
import { AllowedChars, RESULT } from '../App';
import { DEFAULT_BACKGROUND_COLOR } from './KeyboardButton';

export enum BACKGROUND_COLOR {
  INITIAL = '#193140',
  INCORRECT = '#030a0e',
  IN_WORD = '#efac11',
  CORRECT = '#00c361',
}

export enum LETTER_COLOR {
  DEFAULT = "#d7dadc",
  ALTERNATE = '#111',
}

export const getBackgroundColor = (guessResult: RESULT): { background: BACKGROUND_COLOR | '', letter: LETTER_COLOR } => {
  let letter = LETTER_COLOR.DEFAULT
  switch (guessResult) {
    case RESULT.CORRECT:
      letter = LETTER_COLOR.ALTERNATE;
      return { background: BACKGROUND_COLOR.CORRECT, letter };

    case RESULT.IN_WORD:
      letter = LETTER_COLOR.ALTERNATE;
      return { background: BACKGROUND_COLOR.IN_WORD, letter };

    case RESULT.INCORRECT:
      return { background: BACKGROUND_COLOR.INCORRECT, letter };

    default:
      return { background: '', letter };
  }
};

const LetterField = (props: {
  guessResult: RESULT;
  inputValue: AllowedChars | '';
}) => {
  const { guessResult, inputValue } = props;
  const { background, letter } = getBackgroundColor(guessResult);

  return (
    <div
      style={{
        backgroundColor: background,
        border: `1px solid ${ guessResult === RESULT.UNKNOWN ? DEFAULT_BACKGROUND_COLOR : background}`,
        margin: '2px',
        fontSize: '2em',
        color: letter,
        height: '50px',
        width: '50px',
      }}
    >
      {inputValue?.toUpperCase()}
    </div>
  );
};

export default LetterField;
