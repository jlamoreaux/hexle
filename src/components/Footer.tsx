import React from 'react';
import { LETTER_COLOR } from '../utils';

const FooterItem = ({
  children,
}: {
  children?: React.ReactChild | React.ReactChild[];
}) => {
  return (
    <>
      <span
        style={{
          // borderLeft: '1px solid',
          paddingTop: '8px',
          // margin: '4px',
        }}
      >
        {children}
      </span>
    </>
  );
};

const Footer = () => {
  return (
    <>
      <style>
        {`
        footer {
          color: ${LETTER_COLOR.DEFAULT};
          margin-top: 24px;
        }
          a {
            text-decoration: none;
            color: ${LETTER_COLOR.DEFAULT};
          }
          a:hover {
            text-decoration: underline;
          }
        `}
      </style>
      <footer>
        <FooterItem>
          <a
            href="https://www.buymeacoffee.com/jlmx"
            target="_blank"
            rel="noreferrer"
          >
            Buy me a coffee? ☕️
          </a>
        </FooterItem>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            padding: '16px',
          }}
        >
          <FooterItem>
            Created by{' '}
            <a href="https://jlamoreaux.com" target="_blank" rel="noreferrer">
              Jordan Lamoreaux
            </a>
          </FooterItem>
          <FooterItem>
            <a
              href="https://github.com/jlamoreaux/hexle"
              target="_blank"
              rel="noreferrer"
            >
              Checkout the source code
            </a>
          </FooterItem>
        </div>
      </footer>
    </>
  );
};

export default Footer;
