import React, { useState } from 'react'
import { CloseButton } from './CloseButton'
import Modal from './Modal';
import { buttonStyle } from './KeyboardButton';
import { BACKGROUND_COLOR, LETTER_COLOR } from '../utils';

const HelpModal = () => {
    const [isOpen, setIsOpen] = useState(false);

  const toggleHelpDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        style={{
         ...buttonStyle,
          backgroundColor: BACKGROUND_COLOR.INCORRECT,
          color: LETTER_COLOR.DEFAULT,
          cursor: 'pointer',
          height: 'auto',
          minWidth: 'none',
          padding: '8px',
       }}
        onClick={toggleHelpDialog}>?</button>
      {isOpen && (
        <Modal
          isVisible={isOpen}
        >
          <CloseButton closeModal={toggleHelpDialog} />
          <h2
            style={{
              marginBottom: '0.2em',
              textAlign: 'left',
            }}
          >How to Play</h2>
          <h3
            style={{
              marginTop: '0',
              fontSize: '1rem',
              textAlign: 'left',
            }}
          >
            Guess the correct hexadecimal code for a given color in 6 tries.
          </h3>
          <p 
            style={{
              textAlign: 'left',
            }}
          >
          <ul>
            <li>
              Each guess should be a valid hexadecimal code consisting of six characters, including numbers (0-9) and letters (A-F).
            </li>
            <li>
              After each guess, the color tiles will provide feedback to indicate how close your guess is to the correct code. Here is what the different colors mean:
              <br />
              <br />
                🟩 A character is correct and in the correct place.
              <br />
                🟨 A character is correct but in the wrong place.
            </li>
          </ul>
            Have fun and embrace the colorful journey!
          </p>
        </Modal>
      )}
    </div>
  );
}

export default HelpModal