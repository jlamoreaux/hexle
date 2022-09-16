import React from 'react';
import { AllowedChars, HEX_CHARS, CharacterStatus } from '../App';
import ActionButton from './ActionButton';
import KeyboardButton from './KeyboardButton';

const Keyboard = (props: {
  charStatus: CharacterStatus;
  submitIsDisabled: boolean;
  deleteChar: () => void;
  setValueOfCurrentField: (value: AllowedChars) => void;
  submit: () => void;
}) => {
  const { charStatus, submitIsDisabled, deleteChar, setValueOfCurrentField, submit } = props;
  return (
    <div
      style={{
        // display: 'flex',
        // flexWrap: 'wrap',
        // flexDirection: 'column',
        maxWidth: '300px',
        margin: 'auto',
      }}
    >
      <div>
        {HEX_CHARS.map((char) => {
          return (
            <KeyboardButton
              character={char}
              charStatus={charStatus[char]}
              key={`key-${char}`}
              setValueOfCurrentField={setValueOfCurrentField}
            />
          );
        })}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around'
      }}
      >
        <ActionButton
          label={'enter'}
          action={submit}
          disabled={submitIsDisabled}
          />
        <ActionButton label={'delete'} action={deleteChar} />
      </div>
    </div>
  );
};

export default Keyboard;
