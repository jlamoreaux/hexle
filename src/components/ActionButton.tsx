import React from 'react';
import { buttonStyle } from './KeyboardButton';
import { DEFAULT_BACKGROUND_COLOR, LETTER_COLOR } from '../utils';

interface ActionButtonProps {
  disabled?: boolean;
  label: string;
  action: () => void;
}

const ActionButton = ({ disabled, label, action }: ActionButtonProps) => {
  return (
    <button
      onClick={action}
      style={{
        ...buttonStyle,
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
        color: LETTER_COLOR.DEFAULT,
      }}
      disabled={disabled}
    >
      {label.toUpperCase()}
    </button>
  );
};

export default ActionButton;
