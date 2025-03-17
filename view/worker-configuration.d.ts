interface Env {
	KANATRANS_WORKER: Fetcher & {
    katakana(word: string): Promise<string>;
  };
}
