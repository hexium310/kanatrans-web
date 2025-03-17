import { Box, Container, Text } from '@mantine/core';
import { Outlet } from 'react-router';

import { WordInput } from '~/components/WordInput';

export function meta() {
  return [
    { title: 'kanatrans' },
    { name: 'description', content: '英単語をカタカナに変換します' },
  ];
}

export default function Home() {
  return (
    <Container size="md">
      <Box pb={ 16 }>
        <Text>
          カタカナに変換したい英単語を入力し、変換ボタンを押してください。
        </Text>
      </Box>
      <WordInput />
      <Outlet />
    </Container>
  );
}
