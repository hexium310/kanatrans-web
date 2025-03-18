import { Grid } from '@mantine/core';
import { memo, useCallback, useMemo } from 'react';

import type { WordState } from '~/routes/word/home';
import { History } from './History';
import { WordCard } from './WordCard';

export const WordList = memo(({ wordState: [words, setWords] }: { wordState: WordState }) => {
  const [latest, ...history] = useMemo(
    () => words
      .toReversed()
      .map(({ word, katakana, _key }) => <WordCard key={ _key } word={ word } katakana={ katakana } />),
    [words]
  );

  const clearHistory = useCallback(() => setWords((v) => v.slice(-1)), [setWords]);

  return (
    <Grid>
      <Grid.Col span={ 3 } />
      { latest }
      <Grid.Col span={ 3 } />
      <History clearHistory={ clearHistory }>
        { history }
      </History>
    </Grid>
  );
});
