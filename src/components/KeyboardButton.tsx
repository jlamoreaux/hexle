import React from 'react';
import { AllowedChars, RESULT } from '../App';
import { getBackgroundColor } from './LetterField';

export const buttonStyle = {
  borderRadius: '4px',
  color: '#d7dadc',
  fontSize: '1.2em',
  fontWeight: 'bold',
  height: '35%',
  margin: '4px',
  padding: '4px 8px',
  minWidth: 'calc(25% - 8px)',
};

const KeyboardButton = (props: {
  character: AllowedChars;
  charStatus: RESULT;
  setValueOfCurrentField: (value: AllowedChars) => void;
}) => {
  const { character, charStatus, setValueOfCurrentField } = props;
  return (
    <button
      onClick={() => setValueOfCurrentField(character)}
      style={{
        backgroundColor: getBackgroundColor(charStatus),
        ...buttonStyle,
      }}
    >
      {character.toUpperCase()}
    </button>
  );
};

export default KeyboardButton;
