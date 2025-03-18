import { memo, useCallback, useState } from "react";
import { Outlet } from "react-router";

import { WordList } from "~/components/WordList";
import type { AppendWord, Word } from "~/types/word";

type OutletContext = AppendWord;

const Home = memo(() => {
  const [words, setWords] = useState<Word[]>(() => []);

  const appendWord = useCallback((word: Word) => setWords((v) => [...v, word]), []);
  const clearHistory = useCallback(() => setWords((v) => v.slice(-1)), []);

  return (
    <>
      <Outlet context={ appendWord satisfies OutletContext } />
      <WordList words={ words } clearHistory={ clearHistory } />
    </>
  );
});
Home.displayName = "Route[/word]"

export default Home;
