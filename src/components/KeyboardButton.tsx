import React from 'react';
import { AllowedChars, RESULT } from '../App';
import { getBackgroundColor } from './LetterField';

export const buttonStyle = {
  borderRadius: '4px',
  fontSize: '1.2em',
  fontWeight: 'bold',
  height: '35%',
  margin: '4px',
  padding: '4px 8px',
  minWidth: 'calc(25% - 8px)',
  border: 'none',
};

export const DEFAULT_BACKGROUND_COLOR = '#767676';

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
        backgroundColor: background || DEFAULT_BACKGROUND_COLOR,
        color: letter,
        ...buttonStyle,
      }}
    >
      {character.toUpperCase()}
    </button>
  );
};

export default KeyboardButton;
