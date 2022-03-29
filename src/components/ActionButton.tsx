import React from 'react';
import { buttonStyle, DEFAULT_BACKGROUND_COLOR } from './KeyboardButton';
import { LETTER_COLOR } from './LetterField';

interface ActionButtonProps {
  disabled?: boolean;
  label: string;
  action: () => void;
}

const ActionButton = ({ disabled, label, action }: ActionButtonProps) => {
  return (
    <button
      onClick={action}
      style={{ backgroundColor: DEFAULT_BACKGROUND_COLOR, color: LETTER_COLOR.DEFAULT, ...buttonStyle }}
      disabled={disabled}
    >
      {label.toUpperCase()}
    </button>
  );
};

export default ActionButton;
