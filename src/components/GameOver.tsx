import React from 'react';
import { CharacterInput, GameResult, RESULT } from '../App';

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
    <button onClick={shareFunction}>
      {label}
    </button>
  )
}

const GameOver = ({ gameResult, attempts, gameNumber }: GameOverProps) => {
  const generateBlocks = (attempts: CharacterInput[][]) : string => {
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
  const shareToClipboard = () => {
    console.log('I win!!');
  }
  if (gameResult !== GameResult.IN_PROGRESS) {
    return (
      <div
        style={{

        }}
      >
        {generateBlocks(attempts)}
        <ShareButton label="Share" shareFunction={shareToClipboard} />
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default GameOver
