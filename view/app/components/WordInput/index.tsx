import { Button, CloseButton, Grid, TextInput } from '@mantine/core';
import type { MantineStyleProp } from '@mantine/core';
import { useValidatedState } from '@mantine/hooks';
import { memo, useCallback, useMemo } from "react";
import type { ChangeEvent, FormEvent, MouseEventHandler } from 'react';
import { Form } from 'react-router';

import classes from './WordInput.module.css';

const WORD_REGEX = /^[a-zA-Z_]+$/;
const validateWord = (word: string) => WORD_REGEX.test(word);

interface InputClearButtonProps {
  hasWord: boolean,
  onClick: MouseEventHandler<HTMLButtonElement>,
}

const InputClearButton = memo(({ hasWord, onClick }: InputClearButtonProps) => {
  const style = useMemo(() => ({ display: hasWord ? undefined : 'none' } satisfies MantineStyleProp), [hasWord]);

  return (
    <CloseButton
      aria-label="clear input"
      onClick={ onClick }
      style={ style }
    />
  );
});

export const WordInput = memo(() => {
  const [{ value: word, valid }, setWord] = useValidatedState<string>("", validateWord, false);
  const link = `word/${ word }`;

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setWord(event.target.value), [])
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => !valid && event.preventDefault(),
    [valid]
  );

  const handleInputClearButtonClick = useCallback(() => setWord(''), []);

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
              <InputClearButton
                hasWord={ word !== "" }
                onClick={ handleInputClearButtonClick }
              />
            }
          />
        </Grid.Col>
        <Grid.Col span={ 4 }>
          <Button type="submit" fullWidth={ true } disabled={ !valid }>
            変換
          </Button>
        </Grid.Col>
      </Grid>
    </Form>
  );
});
WordInput.displayName = "WordInput";
