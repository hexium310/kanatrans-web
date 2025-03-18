import { Button, CloseButton, Grid, TextInput } from '@mantine/core';
import type { MantineStyleProp } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { memo, useCallback, useMemo } from 'react';
import { Form, Link } from 'react-router';

import classes from './WordInput.module.css';

export const WordInput = memo(() => {
  const [word, setWord] = useInputState('');
  const link = `word/${ word }`;

  const handleCloseButtonClick = useCallback(() => setWord(''), [setWord]);

  const closeButtonStyle = useMemo(() => ({ display: word ? undefined : 'none' } satisfies MantineStyleProp), [word]);

  return (
    <Form action={ link } method="get">
      <Grid>
        <Grid.Col span={ 8 }>
          <TextInput
            autoComplete="off"
            value={ word }
            onChange={ setWord }
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
          <Button fullWidth={ true } component={ Link } to={ link }>
            変換
          </Button>
        </Grid.Col>
      </Grid>
    </Form>
  );
});
WordInput.displayName = "WordInput";
