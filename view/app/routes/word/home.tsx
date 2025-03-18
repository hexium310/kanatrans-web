import { memo, useState } from "react";
import { Outlet } from "react-router";

import { WordList } from "~/components/WordList";

export interface Word {
  word: string,
  katakana: string,
  _key: number,
}

export type WordState = ReturnType<typeof useWordState>;

export interface WordOutletContext {
  setWords: ReturnType<typeof useWordState>[1],
}

function useWordState() {
  return useState<Word[]>(() => []);
}

const Home = memo(() => {
  const [words, setWords] = useWordState();

  return (
    <>
      <Outlet context={ { setWords } satisfies WordOutletContext } />
      <WordList wordState={ [words, setWords] } />
    </>
  );
});

export default Home;
