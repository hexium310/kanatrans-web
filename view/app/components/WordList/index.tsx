import { Grid } from '@mantine/core';

import type { WordState } from '~/routes/word/home';
import { History } from './History';
import { WordCard } from './WordCard';

export function WordList({ wordState: [words, setWords] }: { wordState: WordState }) {
  const [latest, ...history] = words
    .toReversed()
    .map(({ word, katakana, _key }) => <WordCard key={ _key } word={ word } katakana={ katakana } />);

  return (
    <Grid>
      <Grid.Col span={ 3 } />
      { latest }
      <Grid.Col span={ 3 } />
      <History clearHistory={ () => setWords((v) => v.slice(-1)) }>
        { history }
      </History>
    </Grid>
  );
}
