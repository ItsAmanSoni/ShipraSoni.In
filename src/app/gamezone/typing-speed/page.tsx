import {
  Heading,
  Text,
  Column,
  RevealFx,
  Meta,
  Schema,
  SmartLink,
  Row,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { TypingGame } from "@/components/games/TypingGame";

const gameData = {
  title: "Typing Speed Master",
  description: "Test your typing speed and accuracy with this fast-paced typing challenge. Race against time and beat your high score!",
  path: "/gamezone/typing-speed",
  image: "/images/og/typing-speed.png",
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

export default function TypingSpeedPage() {
  return (
    <Column maxWidth="l" gap="xl" paddingY="l" s={{ gap: "l", paddingY: "m" }} horizontal="center" fillWidth>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={gameData.path}
        title={gameData.title}
        description={gameData.description}
        image={`/api/og/generate?title=${encodeURIComponent(gameData.title)}`}
      />

      <Column fillWidth gap="m" paddingX="l" s={{ paddingX: "m" }}>
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
            <Heading as="h1" variant="display-strong-l">
              {gameData.title}
            </Heading>
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
        <Column fillWidth paddingX="l" s={{ paddingX: "m" }}>
          <TypingGame />
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
          s={{ padding: "m", marginX: "m" }}
        >
          <Heading as="h2" variant="heading-strong-m">Tips to Improve Your Score</Heading>
          <Column gap="s">
            <Text variant="body-default-m" onBackground="neutral-weak">
              Focus on accuracy first, then gradually increase speed
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Keep your eyes on the word, not the keyboard
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Use proper typing posture and finger positioning
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Practice regularly to build muscle memory
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Take breaks to avoid fatigue and maintain performance
            </Text>
          </Column>
        </Column>
      </RevealFx>
    </Column>
  );
}
