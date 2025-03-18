import { ActionIcon, Grid, Group, Text } from "@mantine/core";
import { TrashIcon } from "@primer/octicons-react";
import { memo } from "react";
import type { ReactNode } from "react";

export const History = memo(({ children, clearHistory }: { children: ReactNode, clearHistory: () => void }) => {
  return (
    <>
      <Grid.Col span={ 12 }>
        <Group justify="space-between">
          <Text>
            履歴（ページを離れると消えます）
          </Text>
          <ActionIcon
            variant="white"
            color="dark"
            onClick={ clearHistory }
          >
            <TrashIcon />
          </ActionIcon>
        </Group>
      </Grid.Col>
      { children }
    </>
  )
});
