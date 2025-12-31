import React from 'react';
import { Column, Row, Text, Badge } from '@once-ui-system/core';
import { Move } from 'chess.js';

interface MoveHistoryProps {
  moves: Move[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  // Group moves into pairs (white move, black move)
  const movePairs: Array<{ white: string; black?: string }> = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      white: moves[i].san,
      black: moves[i + 1]?.san,
    });
  }

  return (
    <Column fillWidth gap="s">
      {/* Header */}
      <Row horizontal="between" vertical="center">
        <Text variant="label-default-m" onBackground="neutral-strong">
          Moves
        </Text>
        <Badge
          background="neutral-alpha-weak"
          onBackground="neutral-strong"
          arrow={false}
        >
          {moves.length}
        </Badge>
      </Row>

      {/* Move Table */}
      <Column
        fillWidth
        gap="0"
        background="surface"
        border="neutral-medium"
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRadius: '24px',
        }}
        s={{ style: { maxHeight: '400px' } }}
      >
        {movePairs.length === 0 ? (
          <Column fillWidth padding="l" horizontal="center" vertical="center">
            <Text variant="body-default-s" onBackground="neutral-weak" align="center">
              No moves yet
            </Text>
          </Column>
        ) : (
          <>
            {/* Table Header */}
            <Row
              gap="s"
              paddingX="m"
              paddingY="xs"
              background="neutral-alpha-weak"
              style={{ borderBottom: '1px solid var(--neutral-border-medium)' }}
            >
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ minWidth: '24px', textAlign: 'center' }}>
                #
              </Text>
              <Row flex={1} gap="s">
                <Row flex={1} gap="xs" vertical="center">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #000' }} />
                  <Text variant="label-default-xs" onBackground="neutral-weak">White</Text>
                </Row>
                <Row flex={1} gap="xs" vertical="center">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000' }} />
                  <Text variant="label-default-xs" onBackground="neutral-weak">Black</Text>
                </Row>
              </Row>
            </Row>

            {/* Table Rows */}
            {movePairs.map((pair, index) => (
              <Row
                key={index}
                gap="s"
                paddingX="m"
                paddingY="xs"
                style={{
                  borderBottom: index < movePairs.length - 1 ? '1px solid var(--neutral-border-weak)' : 'none',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--neutral-alpha-weak)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <Text
                  variant="label-default-s"
                  onBackground="neutral-weak"
                  style={{ minWidth: '24px', textAlign: 'center' }}
                >
                  {index + 1}
                </Text>
                <Row flex={1} gap="s">
                  <Text
                    variant="body-default-s"
                    onBackground="neutral-strong"
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-code)',
                      fontWeight: 500,
                    }}
                  >
                    {pair.white}
                  </Text>
                  <Text
                    variant="body-default-s"
                    onBackground={pair.black ? 'neutral-strong' : 'neutral-weak'}
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-code)',
                      fontWeight: 500,
                    }}
                  >
                    {pair.black || '—'}
                  </Text>
                </Row>
              </Row>
            ))}
          </>
        )}
      </Column>
    </Column>
  );
};
