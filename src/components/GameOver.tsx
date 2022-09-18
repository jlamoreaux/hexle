import React from 'react';
import { CharacterInput, GameResult, RESULT } from '../App';
import {
  BACKGROUND_COLOR,
  LETTER_COLOR,
  DEFAULT_BACKGROUND_COLOR,
} from '../utils';
import { buttonStyle } from './KeyboardButton';

type verProps = {
  attempts: CharacterInput[][];
  gameNumber: number;
  gameResult: GameResult;
  numGamesPlayed: number;
  longestStreak: number;
  totalWins: number;
  winStreak: number;
  hexCode: string;
  isVisible: boolean;
  setIsVisible: (shouldClose: boolean) => void;
};

type ShareButtonProps = {
  label: string;
  shareFunction: () => void;
};

const shareToClipboard = (message: string) => {
  navigator.clipboard.writeText(message);
};

const shareResult = (message: string) => {
  if (navigator.share) {
    navigator.share({ text: message });
  }
};

export const ColorSquare = ({
  hexCode,
  size,
}: {
  hexCode: string;
  size: number;
}) => {
  return (
    <div
      style={{
        backgroundColor: `#${hexCode}`,
        height: `${size}px`,
        left: 0,
        margin: 'auto',
        right: 0,
        width: `${size}px`,
      }}
    ></div>
  );
};

const StatItem = ({ stat, label }: { stat: number; label: string; }) => {
  return (
    <div
      className="stats-item"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '22%',
      }}
    >
      <span
        className="stats-item-number"
        style={{
          fontSize: '1.4em',
          fontWeight: 600,
        }}
      >
        {stat}
      </span>
      <span
        className="stats-item-label"
        style={{
          fontSize: '.84em'
        }}
      >
        {label}
      </span>
    </div>
  );
}

const ShareButton = ({ label, shareFunction }: ShareButtonProps) => {
  return (
    <button
      onClick={shareFunction}
      style={{
        ...buttonStyle,
        border: 'none',
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
        color: LETTER_COLOR.DEFAULT,
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: '600',
      }}
    >
      {label}
    </button>
  );
};

const CloseButton = ({ closeModal }: { closeModal: () => void }) => {
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

const ver = ({
  attempts,
  gameNumber,
  gameResult,
  numGamesPlayed,
  longestStreak,
  totalWins,
  winStreak,        
  hexCode,
  isVisible,
  setIsVisible,
}: verProps): JSX.Element => {
  const closeModal = () => {
    setIsVisible(false);
  };

  const generateBlocks = (
    attempts: CharacterInput[][],
    gameResult: GameResult
  ): string => {
    const emojiBlocks = attempts.map((row) => {
      return row
        .map((char) => {
          const result = char.result;
          switch (result) {
            case RESULT.CORRECT:
              return String.fromCodePoint(0x1f7e9);
            case RESULT.IN_WORD:
              return String.fromCodePoint(0x1f7e8);
            default:
              return String.fromCodePoint(0x2b1b);
          }
        })
        .join('');
    });
    return `Hexle ${gameNumber} ${
      gameResult === GameResult.LOSS ? 'X' : attempts.length
    }/6\n${emojiBlocks.join('\r\n')}\nhttps://hexle.codes`;
  };

  const resultsToShare =
    gameResult === GameResult.IN_PROGRESS
      ? 'Think you can guess a hex code by looking at a color? Test your skill at https://hexle.codes'
      : generateBlocks(attempts, gameResult);

  let modalMessage =
    'You could share the game now...\n\nOr finish the game first and share how you did!';
  if (gameResult === GameResult.WIN) {
    modalMessage = 'You Win!';
  }
  if (gameResult === GameResult.LOSS) {
    modalMessage = 'Game Over';
  }

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
        maxWidth: '300px',
        display: isVisible ? 'block' : 'none',
      }}
    >
      <CloseButton closeModal={closeModal} />
      <h3>{modalMessage}</h3>
      {gameResult !== GameResult.IN_PROGRESS && (
        <div style={{ margin: '24px auto' }}>
          <p>#{hexCode}</p>
          <ColorSquare hexCode={hexCode} size={100} />
        </div>
      )}
      <div>
        <h3>Stats</h3>
        <div
          className="stats-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingBottom: '16px',
            justifyContent: 'space-around'
          }}
        >
          <StatItem stat={numGamesPlayed} label="Games Played" />
          <StatItem
            stat={Math.floor((totalWins / numGamesPlayed) * 100) || 0}
            label="Win %"
          />
          <StatItem stat={winStreak} label="Current Streak" />
          <StatItem stat={longestStreak} label="Longest Streak" />
        </div>
      </div>

      <ShareButton
        label="Share"
        shareFunction={() => shareResult(resultsToShare)}
      />
      <ShareButton
        label="Copy to Clipboard"
        shareFunction={() => shareToClipboard(resultsToShare)}
      />
    </div>
  );
};

export default ver;
