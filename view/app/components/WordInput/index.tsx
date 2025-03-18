import { Button, CloseButton, Grid, TextInput } from '@mantine/core';
import type { MantineStyleProp } from '@mantine/core';
import { useValidatedState } from '@mantine/hooks';
import { memo, useCallback, useMemo } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { Form, Link } from 'react-router';

import classes from './WordInput.module.css';

const WORD_REGEX = /^[a-zA-Z_]+$/;
const validateWord = (word: string) => WORD_REGEX.test(word);

export const WordInput = memo(() => {
  const [{ value: word, valid }, setWord] = useValidatedState<string>("", validateWord, false);
  const link = `word/${ word }`;

  const handleCloseButtonClick = useCallback(() => setWord(''), [setWord]);
  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setWord(event.target.value), [setWord])
  const handleSubmit = useCallback(
    (event: MouseEvent<HTMLAnchorElement> | FormEvent<HTMLFormElement>) => !valid && event.preventDefault(),
    [valid]
  );

  const closeButtonStyle = useMemo(() => ({ display: word ? undefined : 'none' } satisfies MantineStyleProp), [word]);

  return (
    <Form action={ link } method="get" onSubmit={ handleSubmit }>
      <Grid>
        <Grid.Col span={ 8 }>
          <TextInput
            autoComplete="off"
            value={ word }
            onChange={ handleInputChange }
            className={ word ? '' : classes['right-section-hidden'] }
            rightSection={
              <CloseButton
                aria-label="clear input"
                onClick={ handleCloseButtonClick }
                style={ closeButtonStyle }
              />
            }
          />
        </Grid.Col>
        <Grid.Col span={ 4 }>
          <Button
            fullWidth={ true }
            component={ Link }
            to={ link }
            data-disabled={ !valid }
            onClick={ handleSubmit }
          >
            変換
          </Button>
        </Grid.Col>
      </Grid>
    </Form>
  );
});
WordInput.displayName = "WordInput";
