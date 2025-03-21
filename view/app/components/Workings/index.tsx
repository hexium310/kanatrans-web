import { Anchor, Card, Collapse, Flex, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChevronDownIcon, ChevronRightIcon } from "@primer/octicons-react";
import { memo } from "react";

import classes from "./Workings.module.css";

interface CollapseStateIconProps {
  opened: boolean,
}

const collapseStateIconProps = {
  className: classes["detail-button"],
};

const CollapseStateIcon = memo(({ opened }: CollapseStateIconProps) => {
  return opened
    ? <ChevronDownIcon { ...collapseStateIconProps } />
    : <ChevronRightIcon { ...collapseStateIconProps } />;
});

export const Workings = memo(() => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Card withBorder={ true } p={ 8 } m={ 0 } mt="md" mb="md">
        <UnstyledButton onClick={ toggle }>
          <Flex align="center">
            <CollapseStateIcon opened={ opened } />
            <Text span={ true } ml={ 8 }>
              変換のしくみ
            </Text>
          </Flex>
        </UnstyledButton>

        <Collapse in={ opened } mt="xs" ml={ 24 }>
          <Text>
            英単語を <Anchor href="https://ja.wikipedia.org/wiki/ARPABET">ARPABET</Anchor> という発音記号に変換し、
            その発音記号からカタカナを組み立てています。
          </Text>
          <Text>
            そのため、変換後のヨミは英語の発音に近いものになっており、日本語でよく使われているカタカナ語と異なる場合があります。
          </Text>
          <Text>
            特に、促音（小さい「ッ」）は付けるか付けないかの判断ができないので非対応です。
            例えば、タグ付けの「タグ」とタッグマッチの「タッグ」は両方 tag で、発音も同じです。
          </Text>
        </Collapse>
      </Card>
    </>
  );
})
