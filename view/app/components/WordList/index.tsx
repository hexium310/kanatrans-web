import { Grid } from '@mantine/core';
import { memo, useMemo } from 'react';

import { History } from './History';
import { WordCard } from './WordCard';
import type { Word } from '~/types/word';

interface WordListProps {
  words: Word[],
  clearHistory: () => void,
}

export const WordList = memo(({ words, clearHistory }: WordListProps) => {
  const [latest, ...history] = useMemo(
    () => words
      .toReversed()
      .map(({ word, katakana, _key }) => <WordCard key={ _key } word={ word } katakana={ katakana } />),
    [words]
  );

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
