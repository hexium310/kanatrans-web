import { ActionIcon, Menu as MantineMenu } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { CopyIcon, KebabHorizontalIcon } from "@primer/octicons-react";
import { memo, useCallback } from "react";

export const Menu = memo(({ word }: { word: string }) => {
  const clipboard = useClipboard();
  const link = `${ window.location.origin }/word/${ word }`;

  const handleCopyClick = useCallback(() => clipboard.copy(link), [clipboard.copy, link]);

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
          onClick={ handleCopyClick }
        >
          リンクをコピー
        </MantineMenu.Item>
      </MantineMenu.Dropdown>
    </MantineMenu>
  )
});
