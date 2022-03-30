import React, { useState } from 'react';
import { CharacterInput, GameResult, RESULT } from '../App';
import { BACKGROUND_COLOR, LETTER_COLOR } from './LetterField';
import { buttonStyle, DEFAULT_BACKGROUND_COLOR } from './KeyboardButton';

type GameOverProps = {
  gameResult: GameResult;
  attempts: CharacterInput[][];
  gameNumber: number;
}

type ShareButtonProps = {
  label: string;
  shareFunction: () => void;
}

const ShareButton = ({ label, shareFunction }: ShareButtonProps) => {
  return (
    <button
      onClick={shareFunction}
      style={{
        ...buttonStyle,
        border: 'none',
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
        fontWeight: '600',
        color: LETTER_COLOR.DEFAULT,
        fontSize: '1em',
      }}
    >
      {label}
    </button>
  )
}

const GameOver = ({ gameResult, attempts, gameNumber }: GameOverProps) => {
  const [isClosed, setIsClosed] = useState(false);
  const generateBlocks = (attempts: CharacterInput[][]): string => {
    const emojiBlocks = attempts.map(row => {
      return row.map(char => {
        const result = char.result;
        switch (result) {
          case RESULT.CORRECT:
            return String.fromCodePoint(0x1F7E9);
          case RESULT.IN_WORD:
            return String.fromCodePoint(0x1F7E8);
          default:
            return String.fromCodePoint(0x2B1B);
        }
      }).join('')
    });
    return `Hexle ${gameNumber} ${attempts.length}/6\n${emojiBlocks.join("\r\n")}`;
  }
  
  const shareToClipboard = (message: string) => {
    navigator.clipboard.writeText(message)
  }

  const shareResult = (message: string) => {
    if (navigator.share) {
      navigator.share({text: message});
    }
  }

  const resultsToShare = generateBlocks(attempts);
  

  if (gameResult !== GameResult.IN_PROGRESS) {
    return (
      <div
        style={{
          position: 'absolute',
          backgroundColor: BACKGROUND_COLOR.INCORRECT,
          padding: '10px',
          margin: 'auto',
          left: '0',
          right: '0',
          top: '150px',
          maxWidth: '300px'
        }}
      >
        <button style={{border: 'none', background: 'none', color: LETTER_COLOR.DEFAULT, right: 0, left: 'auto', margin: 'auto'}}>Close</button>
        <h3>{GameResult.WIN ? "You Win!" : "Game Over"}</h3>
        <ShareButton label="Share" shareFunction={() => shareResult(resultsToShare)} />
        <ShareButton label="Copy to Clipboard" shareFunction={() => shareToClipboard(resultsToShare)} />
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default GameOver
