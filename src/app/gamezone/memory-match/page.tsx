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
  title: "Memory Match",
  description: "Challenge your memory with this classic card matching game. Find all the pairs before time runs out!",
  path: "/gamezone/memory-match",
  image: "/images/og/memory-match.png",
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

export default function MemoryMatchPage() {
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
              background="brand-alpha-weak"
              onBackground="brand-strong"
              arrow={false}
            >
              Easy
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
            background: "linear-gradient(135deg, var(--surface-background) 0%, var(--brand-alpha-weak) 100%)",
          }}
        >
          <Badge
            background="brand-alpha-weak"
            onBackground="brand-strong"
            arrow={false}
          >
            Coming Soon
          </Badge>

          <Heading variant="display-strong-l" align="center">
            Under Development
          </Heading>

          <Column maxWidth="s">
            <Text variant="body-default-l" onBackground="neutral-weak" align="center">
              This game is currently being developed. Check back soon for an exciting memory matching challenge!
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
              • Multiple difficulty levels with increasing grid sizes
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              • Beautiful card designs with smooth animations
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              • Timer and move counter for competitive gameplay
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              • High score tracking and achievements
            </Text>
          </Column>
        </Column>
      </RevealFx>
    </Column>
  );
}
