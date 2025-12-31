"use client";

import { Card, Column, Heading, Media, Row, Text, Badge, SmartLink } from "@once-ui-system/core";
import { LabExperiment } from "@/types";

interface LabCardProps {
  experiment: LabExperiment;
  priority?: boolean;
}

const categoryBgColors: Record<string, string> = {
  visual: "brand-alpha-weak",
  coding: "info-alpha-weak",
  animation: "accent-alpha-weak",
  learning: "success-alpha-weak",
  ai: "warning-alpha-weak",
};

const categoryTextColors: Record<string, string> = {
  visual: "brand-strong",
  coding: "info-strong",
  animation: "accent-strong",
  learning: "success-strong",
  ai: "warning-strong",
};

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  successful: { bg: "success-alpha-weak", text: "success-strong", label: "Successful", icon: "✓" },
  "in-progress": { bg: "warning-alpha-weak", text: "warning-strong", label: "In Progress", icon: "⚡" },
  risky: { bg: "danger-alpha-weak", text: "danger-strong", label: "Risky", icon: "⚠" },
  destroyed: { bg: "neutral-alpha-weak", text: "neutral-strong", label: "Destroyed", icon: "💥" },
  brewing: { bg: "info-alpha-weak", text: "info-strong", label: "Brewing", icon: "🧪" },
};

export default function LabCard({ experiment, priority = false }: LabCardProps) {
  const isHorizontal = experiment.orientation === "horizontal";
  const status = statusConfig[experiment.status] || statusConfig.brewing;
  const isClickable = experiment.status === "successful" || experiment.status === "in-progress" || experiment.status === "risky";
  const href = isClickable ? `/lab/${experiment.id}` : undefined;

  const cardContent = (
    <Card
      fillWidth
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      padding="0"
      style={{
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        opacity: experiment.status === "destroyed" ? 0.6 : 1,
        cursor: isClickable ? "pointer" : "default",
      }}
    >
      <Column fillWidth>
        <div style={{ position: "relative" }}>
          <Media
            priority={priority}
            sizes={isHorizontal ? "(max-width: 560px) 100vw, 50vw" : "(max-width: 560px) 100vw, 25vw"}
            radius="l"
            aspectRatio={isHorizontal ? "16 / 9" : "3 / 4"}
            src={experiment.thumbnail}
            alt={experiment.title}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              filter: experiment.status === "destroyed" ? "grayscale(100%)" : "none",
            }}
          />
          {/* Status Badge Overlay */}
          <div style={{ position: "absolute", top: "12px", right: "12px" }}>
            <Badge
              background={status.bg as any}
              onBackground={status.text as any}
              textVariant="label-default-xs"
              paddingX="8"
              paddingY="4"
              arrow={false}
            >
              {status.icon} {status.label}
            </Badge>
          </div>
        </div>
        <Column padding="16" gap="8" fillWidth>
          <Row gap="8" vertical="center" wrap>
            <Badge
              background={categoryBgColors[experiment.category] as any}
              onBackground={categoryTextColors[experiment.category] as any}
              textVariant="label-default-s"
              paddingX="8"
              paddingY="4"
              arrow={false}
            >
              {experiment.category}
            </Badge>
          </Row>
          <Heading as="h3" variant="heading-strong-s">
            {experiment.title}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {experiment.description}
          </Text>
          {experiment.tags && experiment.tags.length > 0 && (
            <Row gap="4" wrap style={{ marginTop: "4px" }}>
              {experiment.tags.map((tag, index) => (
                <Text key={index} variant="label-default-xs" onBackground="neutral-medium">
                  #{tag}
                </Text>
              ))}
            </Row>
          )}
        </Column>
      </Column>
    </Card>
  );

  if (href) {
    return (
      <SmartLink href={href} style={{ textDecoration: "none" }}>
        {cardContent}
      </SmartLink>
    );
  }

  return cardContent;
}
