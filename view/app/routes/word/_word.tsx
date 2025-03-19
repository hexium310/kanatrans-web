import { memo, useCallback, useState } from 'react';

import { WordList } from '~/components/WordList';
import { useLocationChange } from '~/hooks/use-location-change';
import type { Word } from '~/types/word';
import type { Route } from './+types/_word';

export async function loader({ context, params }: Route.LoaderArgs) {
  const katakana = await context.cloudflare.env.KANATRANS_WORKER.katakana(params.word);

  return { katakana };
}

const Detail = memo(({ params, loaderData }: Route.ComponentProps) => {
  const [words, setWords] = useState<Word[]>(() => []);

  const clearHistory = useCallback(() => setWords((v) => v.slice(-1)), []);

  useLocationChange(() => {
    setWords((v) => [...v, { word: params.word, katakana: loaderData.katakana, _key: Date.now() }]);
  });

  return (
    <>
      <WordList words={ words } clearHistory={ clearHistory } />
    </>
  );
});
Detail.displayName = "Route[word/:word]";

export default Detail;
