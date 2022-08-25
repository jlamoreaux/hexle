import React from 'react';
import { AllowedChars, RESULT } from '../App';
import { getBackgroundColor } from './LetterField';
import { DEFAULT_BACKGROUND_COLOR, LETTER_COLOR } from '../utils';

export const buttonStyle = {
  border: 'none',
  borderRadius: '4px',
  color: LETTER_COLOR.ALTERNATE,
  fontSize: '1.2em',
  fontWeight: 'bold',
  height: '35%',
  margin: '4px',
  minWidth: 'calc(25% - 8px)',
  padding: '4px 8px',
};

const KeyboardButton = (props: {
  character: AllowedChars;
  charStatus: RESULT;
  setValueOfCurrentField: (value: AllowedChars) => void;
}) => {
  const { character, charStatus, setValueOfCurrentField } = props;
  const { background, letter } = getBackgroundColor(charStatus);
  return (
    <button
      onClick={() => setValueOfCurrentField(character)}
      style={{
        ...buttonStyle,
        backgroundColor: background || DEFAULT_BACKGROUND_COLOR,
        color: letter,
      }}
    >
      {character.toUpperCase()}
    </button>
  );
};

export default KeyboardButton;
