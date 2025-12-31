import React from 'react';
import { Column, Row, Text } from '@once-ui-system/core';
import type { PieceColor } from '@/types/chess.types';

interface ChessTimerProps {
  whiteTime: string;
  blackTime: string;
  activeColor: PieceColor | null;
  playerColor?: PieceColor;
  layout?: 'stacked' | 'side-by-side';
}

export const ChessTimer: React.FC<ChessTimerProps> = ({
  whiteTime,
  blackTime,
  activeColor,
  playerColor,
  layout = 'stacked',
}) => {
  const isWhiteActive = activeColor === 'w';
  const isBlackActive = activeColor === 'b';

  const whiteTimeColor = isWhiteActive ? 'brand-strong' : 'neutral-medium';
  const blackTimeColor = isBlackActive ? 'brand-strong' : 'neutral-medium';

  const whiteTimeLow = parseTimeToMs(whiteTime) < 10000; // Less than 10 seconds
  const blackTimeLow = parseTimeToMs(blackTime) < 10000;

  const TimerDisplay = ({
    color,
    time,
    isActive,
    isLow
  }: {
    color: 'White' | 'Black';
    time: string;
    isActive: boolean;
    isLow: boolean;
  }) => (
    <Column
      fillWidth
      padding="m"
      background={isActive ? 'brand-alpha-weak' : 'surface'}
      border={isActive ? 'brand-medium' : 'neutral-medium'}
      radius="l"
      gap="xs"
      style={{
        transition: 'all 0.2s ease',
      }}
    >
      <Row fillWidth horizontal="between" vertical="center">
        <Text
          variant="label-default-s"
          onBackground={isActive ? 'brand-strong' : 'neutral-weak'}
        >
          {color}
        </Text>
        {playerColor === color.toLowerCase() && (
          <Text
            variant="label-default-s"
            onBackground="brand-strong"
          >
            You
          </Text>
        )}
      </Row>
      <Text
        variant="heading-strong-xl"
        onBackground={isLow ? 'accent-strong' : (isActive ? 'brand-strong' : 'neutral-strong')}
        style={{
          fontSize: '2rem',
          fontFamily: 'monospace',
          animation: isLow && isActive ? 'pulse 1s infinite' : 'none',
        }}
      >
        {time}
      </Text>
    </Column>
  );

  if (layout === 'side-by-side') {
    return (
      <Row fillWidth gap="m">
        <TimerDisplay
          color="White"
          time={whiteTime}
          isActive={isWhiteActive}
          isLow={whiteTimeLow}
        />
        <TimerDisplay
          color="Black"
          time={blackTime}
          isActive={isBlackActive}
          isLow={blackTimeLow}
        />
      </Row>
    );
  }

  return (
    <Column fillWidth gap="m">
      <TimerDisplay
        color="Black"
        time={blackTime}
        isActive={isBlackActive}
        isLow={blackTimeLow}
      />
      <TimerDisplay
        color="White"
        time={whiteTime}
        isActive={isWhiteActive}
        isLow={whiteTimeLow}
      />
    </Column>
  );
};

// Helper to parse time string to milliseconds
function parseTimeToMs(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    // HH:MM:SS
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  } else if (parts.length === 2) {
    // MM:SS
    return (parts[0] * 60 + parts[1]) * 1000;
  }
  return 0;
}
