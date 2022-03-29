import React from 'react';
import { AllowedChars, RESULT } from '../App';

export enum BACKGROUND_COLOR {
  INITIAL = '#818384',
  INCORRECT = '#f00',
  IN_WORD = '#00f',
  CORRECT = '#0f0',
}

export const getBackgroundColor = (guessResult: RESULT): BACKGROUND_COLOR => {
  switch (guessResult) {
    case RESULT.CORRECT:
      return BACKGROUND_COLOR.CORRECT;

    case RESULT.IN_WORD:
      return BACKGROUND_COLOR.IN_WORD;

    case RESULT.INCORRECT:
      return BACKGROUND_COLOR.INCORRECT;

    default:
      return BACKGROUND_COLOR.INITIAL;
  }
};

const LetterField = (props: {
  guessResult: RESULT;
  inputValue: AllowedChars | '';
}) => {
  const { guessResult, inputValue } = props;

  return (
    <div
      style={{
        backgroundColor: getBackgroundColor(guessResult),
        border: '2px solid black',
        fontSize: '1.4em',
        height: '50px',
        width: '50px',
      }}
    >
      {inputValue?.toUpperCase()}
    </div>
  );
};

export default LetterField;
