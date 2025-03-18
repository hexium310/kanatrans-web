import { memo, useEffect } from 'react';
import { useOutletContext } from 'react-router';

import type { Route } from './+types/detail';
import type { AppendWord } from '~/types/word';

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

export default Detail;
