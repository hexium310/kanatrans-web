import { Box, Card, Container, Group, Text } from '@mantine/core';
import { InfoIcon } from '@primer/octicons-react';
import { memo } from 'react';
import { Outlet } from 'react-router';

import { WordInput } from '~/components/WordInput';
import { Workings } from '~/components/Workings';

export function meta() {
  return [
    { title: 'kanatrans' },
    { name: 'description', content: '英単語をカタカナに変換します' },
  ];
}

const Home = memo(() => {
  return (
    <Container size="md">
      <Box>
        <Workings />
        <Text>
          カタカナに変換したい英単語を入力し、変換ボタンを押してください。
        </Text>
        <Text>
          使用可能文字 a-z、A-Z、_
        </Text>
      </Box>
      <WordInput />
      <Outlet />
    </Container>
  );
});
Home.displayName = "Route[/]";

export default Home;
