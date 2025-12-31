import {
  Heading,
  Text,
  Column,
  RevealFx,
  Meta,
  Schema,
  SmartLink,
  Row,
  Badge,
  Button,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";

const gameData = {
  title: "Word Hunt",
  description: "Find as many words as you can in the grid. Perfect for word lovers and puzzle enthusiasts!",
  path: "/gamezone/word-hunt",
  image: "/images/og/word-hunt.png",
};

export async function generateMetadata() {
  return Meta.generate({
    title: gameData.title,
    description: gameData.description,
    baseURL: baseURL,
    path: gameData.path,
    image: gameData.image,
  });
}

export default function WordHuntPage() {
  return (
    <Column maxWidth="l" gap="xl" paddingY="l" horizontal="center" fillWidth>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={gameData.path}
        title={gameData.title}
        description={gameData.description}
        image={`/api/og/generate?title=${encodeURIComponent(gameData.title)}`}
      />

      <Column fillWidth gap="m" paddingX="l">
        <RevealFx translateY="4">
          <SmartLink
            href="/gamezone"
            prefixIcon="arrowUpRight"
            style={{
              transform: "rotate(180deg)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Text variant="body-default-s">Back to GameZone</Text>
          </SmartLink>
        </RevealFx>

        <RevealFx translateY="4" delay={0.1}>
          <Row gap="m" vertical="center" wrap>
            <Heading variant="display-strong-l">
              {gameData.title}
            </Heading>
            <Badge
              background="accent-alpha-weak"
              onBackground="accent-strong"
              arrow={false}
            >
              Hard
            </Badge>
          </Row>
        </RevealFx>

        <RevealFx translateY="8" delay={0.2}>
          <Column maxWidth="m">
            <Text variant="body-default-l" onBackground="neutral-weak">
              {gameData.description}
            </Text>
          </Column>
        </RevealFx>
      </Column>

      <RevealFx translateY="16" delay={0.3} fillWidth>
        <Column
          fillWidth
          gap="xl"
          align="center"
          padding="xl"
          background="surface"
          border="neutral-medium"
          radius="l"
          marginX="l"
          style={{
            minHeight: "400px",
            background: "linear-gradient(135deg, var(--surface-background) 0%, var(--accent-alpha-weak) 100%)",
          }}
        >
          <Badge
            background="accent-alpha-weak"
            onBackground="accent-strong"
            arrow={false}
          >
            Coming Soon
          </Badge>

          <Heading variant="display-strong-l" align="center">
            Under Development
          </Heading>

          <Column maxWidth="s">
            <Text variant="body-default-l" onBackground="neutral-weak" align="center">
              This challenging word puzzle game is in development. Get ready to test your vocabulary skills!
            </Text>
          </Column>

          <Button
            href="/gamezone"
            variant="secondary"
            size="l"
          >
            Explore Other Games
          </Button>
        </Column>
      </RevealFx>

      <RevealFx translateY="16" delay={0.5} fillWidth>
        <Column
          fillWidth
          gap="m"
          padding="l"
          background="surface"
          border="neutral-medium"
          radius="l"
          marginX="l"
        >
          <Heading variant="heading-strong-m">What to Expect</Heading>
          <Column gap="s">
            <Text variant="body-default-m" onBackground="neutral-weak">
              • Dynamic letter grids with thousands of possible words
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              • Multiple game modes: timed, zen, and daily challenges
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              • Word length bonuses and score multipliers
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              • Dictionary lookup for discovered words
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              • Leaderboards to compete with other players
            </Text>
          </Column>
        </Column>
      </RevealFx>
    </Column>
  );
}
