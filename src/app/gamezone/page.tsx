import {
  Heading,
  Text,
  Column,
  RevealFx,
  Meta,
  Schema,
  Grid,
  Badge,
  Row,
  Line,
} from "@once-ui-system/core";
import { gamezone, baseURL } from "@/resources";
import { games } from "@/resources/games";
import { GameCard } from "@/components/games/GameCard";

export async function generateMetadata() {
  return Meta.generate({
    title: gamezone.title,
    description: gamezone.description,
    baseURL: baseURL,
    path: gamezone.path,
    image: gamezone.image,
  });
}

export default function GameZone() {
  return (
    <Column maxWidth="xl" gap="xl" paddingY="l" horizontal="center" fillWidth>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={gamezone.path}
        title={gamezone.title}
        description={gamezone.description}
        image={`/api/og/generate?title=${encodeURIComponent(gamezone.title)}`}
      />

      <Column fillWidth gap="l" align="center" paddingX="l">
        <RevealFx translateY="4" fillWidth horizontal="center">
          <Badge
            background="brand-alpha-weak"
            paddingX="12"
            paddingY="4"
            onBackground="brand-strong"
            textVariant="label-default-s"
            arrow={false}
          >
            Interactive Experience
          </Badge>
        </RevealFx>

        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16" delay={0.1}>
          <Heading wrap="balance" variant="display-strong-l" align="center">
            A place where games challenge your mind and fun never feels random.zone
          </Heading>
        </RevealFx>


        <RevealFx delay={0.3} fillWidth horizontal="center">
          <Row gap="m" vertical="center">
            <Text variant="body-default-m" onBackground="neutral-weak">
              {games.length} Games Available
            </Text>
            <Line background="neutral-alpha-medium" vert maxHeight="20" />
            <Text variant="body-default-m" onBackground="brand-medium">
              More Coming Soon
            </Text>
          </Row>
        </RevealFx>
      </Column>

      <Column fillWidth paddingX="l">
        <Grid columns="2" s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </Grid>
      </Column>

    </Column>
  );
}
