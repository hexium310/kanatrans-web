import { useEffect } from 'react';
import { useOutletContext } from 'react-router';

import type { Route } from './+types/detail';
import type { WordOutletContext } from './home';

export async function loader({ context, params }: Route.LoaderArgs) {
  const katakana = await context.cloudflare.env.KANATRANS_WORKER.katakana(params.word);

  return { katakana };
}

export default function Detail({ params, loaderData }: Route.ComponentProps) {
  const { setWords } = useOutletContext<WordOutletContext>();

  useEffect(() => {
    setWords((v) => [...v, { word: params.word, katakana: loaderData.katakana, _key: Date.now() }]);
  }, [setWords, params.word, loaderData.katakana]);

  return null;
}
