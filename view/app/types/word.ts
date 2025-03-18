export interface Word {
  word: string,
  katakana: string,
  _key: number,
}

export type AppendWord = (word: Word) => void;
