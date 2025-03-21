import { Card, Grid, Text } from "@mantine/core";
import { memo } from "react";

import { Menu } from "./Menu";

export const WordCard = memo(({ word, katakana }: { word: string, katakana: string }) => {
  return (
    <Grid.Col span={ 6 }>
      <Card withBorder={ true } shadow="xs" m={ 0 } mt="md">
        <Card.Section withBorder={ true } inheritPadding={ true } py="xs">
          <Grid columns={ 16 } align="baseline">
            <Grid.Col span="content">
              <Text c="gray" fz="xs">
                単語
              </Text>
            </Grid.Col>
            <Grid.Col span="auto">
              <Text>
                { word }
              </Text>
            </Grid.Col>
            <Grid.Col span="content">
              <Menu word={ word } />
            </Grid.Col>
          </Grid>
        </Card.Section>
        <Card.Section withBorder={ true } inheritPadding={ true } py="xs">
          <Grid columns={ 16 } align="baseline">
            <Grid.Col span="content">
              <Text c="gray" fz="xs">
                ヨミ
              </Text>
            </Grid.Col>
            <Grid.Col span="auto">
              <Text fw="bold" fz="h2">
                { katakana }
              </Text>
            </Grid.Col>
          </Grid>
        </Card.Section>
      </Card>
    </Grid.Col>
  )
});
WordCard.displayName = "WordCard";
