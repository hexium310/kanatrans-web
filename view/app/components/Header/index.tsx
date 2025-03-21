import { Anchor, Container, Title, Tooltip } from '@mantine/core';
import type { IconProps, OcticonProps } from '@primer/octicons-react';
import { MarkGithubIcon} from '@primer/octicons-react';
import { memo } from "react";
import type { FC } from "react";
import { Link } from 'react-router';

import classes from './Header.module.css';

const GithubIcon: FC<IconProps & OcticonProps> = MarkGithubIcon;

export const Header = memo(() => {
  return (
    <header className={ classes.header }>
      <Container size="md" className={ classes.inner }>
        <Link to="/" className={ classes.title }>
          <Title order={ 1 }>kanatrans</Title>
        </Link>
        <Tooltip label="このページのソースコード" fz="xs">
          <Anchor href="https://github.com/hexium310/kanatrans-web" target="_blank" className={ classes.link }>
            <GithubIcon size="medium" aria-labelledby="title" title="hexium310/kanatrans-web" />
          </Anchor>
        </Tooltip>
      </Container>
    </header>
  );
});
Header.displayName = "Header";
