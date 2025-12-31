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
import { ChessGame } from "@/components/games/chess/ChessGame";

const gameData = {
  title: "Chess Master",
  description: "Play classic chess with move validation, undo functionality, and move history tracking. Challenge yourself in this timeless strategy game.",
  path: "/gamezone/chess",
  image: "/images/og/chess.png",
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

export default function ChessPage() {
  return (
    <Column maxWidth="xl" gap="xl" paddingY="l" s={{ gap: "l", paddingY: "m" }} horizontal="center" fillWidth>
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
          <ChessGame />
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
          <Heading as="h2" variant="heading-strong-m">Chess Tips</Heading>
          <Column gap="s">
            <Text variant="body-default-m" onBackground="neutral-weak">
              Control the center of the board (e4, d4, e5, d5)
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Develop your knights and bishops before moving the same piece twice
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Castle early to protect your king and activate your rook
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Think about your opponent's threats before making your move
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              In the endgame, activate your king as an attacking piece
            </Text>
          </Column>
        </Column>
      </RevealFx>
    </Column>
  );
}
