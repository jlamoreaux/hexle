import React from 'react';
import { buttonStyle } from './KeyboardButton';
import { BACKGROUND_COLOR } from './LetterField';

interface ActionButtonProps {
  disabled?: boolean;
  label: string;
  action: () => void;
}

const ActionButton = ({ disabled, label, action }: ActionButtonProps) => {
  return (
    <button
      onClick={action}
      style={{ backgroundColor: BACKGROUND_COLOR.INITIAL, ...buttonStyle }}
      disabled={disabled}
    >
      {label.toUpperCase()}
    </button>
  );
};

export default ActionButton;
