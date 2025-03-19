import { memo, useEffect } from 'react';
import { useOutletContext } from 'react-router';

import type { AppendWord } from '~/types/word';
import type { Route } from './+types/detail';

export async function loader({ context, params }: Route.LoaderArgs) {
  const katakana = await context.cloudflare.env.KANATRANS_WORKER.katakana(params.word);

  return { katakana };
}

const Detail = memo(({ params, loaderData }: Route.ComponentProps) => {
  const appendWord = useOutletContext<AppendWord>();

  useEffect(() => {
    appendWord({ word: params.word, katakana: loaderData.katakana, _key: Date.now() });
  }, [appendWord, params.word, loaderData.katakana]);

  return null;
});
Detail.displayName = "Route[word/:word]";

export default Detail;
