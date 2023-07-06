export enum BACKGROUND_COLOR {
  INITIAL = '#193140',
  INCORRECT = '#030a0e',
  IN_WORD = '#efac11',
  CORRECT = '#00c361',
}

export enum LETTER_COLOR {
  DEFAULT = '#d7dadc',
  ALTERNATE = '#111',
}

export const DEFAULT_BACKGROUND_COLOR = '#767676';

export const Copyright = () => {
  const date = new Date();
  return <span>&copy; {date.getFullYear()} </span>;
};
