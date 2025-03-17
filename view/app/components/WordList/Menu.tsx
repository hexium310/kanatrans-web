import { ActionIcon, Menu as MantineMenu } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { CopyIcon, KebabHorizontalIcon } from "@primer/octicons-react";

export function Menu({ word }: { word: string }) {
  const clipboard = useClipboard();
  const link = `${ window.location.origin }/word/${ word }`;

  return (
    <MantineMenu withinPortal={ true } shadow="sm">
      <MantineMenu.Target>
        <ActionIcon variant="subtle" color="gray">
          <KebabHorizontalIcon size="small" />
        </ActionIcon>
      </MantineMenu.Target>
      <MantineMenu.Dropdown>
        <MantineMenu.Item
          leftSection={ <CopyIcon /> }
          onClick={ () => clipboard.copy(link) }
        >
          リンクをコピー
        </MantineMenu.Item>
      </MantineMenu.Dropdown>
    </MantineMenu>
  )
}
