"use client";

import {
  Card,
  Column,
  Row,
  Text,
  Icon,
} from "@once-ui-system/core";
import { Game } from "@/types/game.types";

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const difficultyColors = {
    Easy: "var(--green-on-background-strong)",
    Medium: "var(--yellow-on-background-strong)",
    Hard: "var(--red-on-background-strong)",
  };

  return (
    <Card
      fillWidth
      href={`/gamezone/${game.slug}`}
      transition="micro-medium"
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
    >
      <Row fillWidth>
        <Column paddingY="24" paddingX="l" gap="16" fillWidth>
          <Row gap="16" vertical="center" wrap>
            <Row vertical="center" gap="8">
              <Icon name="gamepad" size="s" onBackground="brand-medium" />
              <Text variant="label-default-s" onBackground="brand-medium">
                {game.category}
              </Text>
            </Row>
            <Text
              variant="label-default-s"
              style={{ color: difficultyColors[game.difficulty] }}
            >
              {game.difficulty}
            </Text>
            {game.stats && (
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {game.stats.plays?.toLocaleString()} plays
              </Text>
            )}
          </Row>
          <Text variant="heading-strong-l" wrap="balance">
            {game.title}
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            {game.description}
          </Text>
        </Column>
      </Row>
    </Card>
  );
};
