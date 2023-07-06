import React from 'react';
import { LETTER_COLOR } from '../utils';

export const CloseButton = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <button
      style={{
        border: 'none',
        background: 'none',
        color: LETTER_COLOR.DEFAULT,
        cursor: 'pointer',
        left: 'auto',
        margin: 'auto',
        position: 'absolute',
        right: 0,
      }}
      type="button"
      onClick={closeModal}
    >
      Close
    </button>
  );
};