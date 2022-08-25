import React from 'react';
import { AllowedChars, RESULT } from '../App';
import {
  LETTER_COLOR,
  BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_COLOR,
} from '../utils';

export const getBackgroundColor = (
  guessResult: RESULT
): { background: BACKGROUND_COLOR | ''; letter: LETTER_COLOR } => {
  let letter = LETTER_COLOR.DEFAULT;
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
        border: `1px solid ${
          guessResult === RESULT.UNKNOWN ? DEFAULT_BACKGROUND_COLOR : background
        }`,
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
