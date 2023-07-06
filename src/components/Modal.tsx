import React from 'react';
import { BACKGROUND_COLOR } from '../utils';
import { isVisible } from '@testing-library/user-event/dist/utils';

type ModalProps = {
  children: React.ReactChild | React.ReactChild[];
  isVisible: boolean;
};

const Modal = ({children, isVisible}: ModalProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: BACKGROUND_COLOR.INCORRECT,
        padding: '1em',
        margin: '-40px auto',
        left: '0',
        right: '0',
        top: '150px',
        maxWidth: '320px',
        display: isVisible ? 'block' : 'none',
      }}
    >{children}</div>
  )
}

export default Modal