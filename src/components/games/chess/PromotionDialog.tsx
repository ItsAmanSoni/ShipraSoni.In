import React from 'react';
import { Column, Row, Text } from '@once-ui-system/core';
import { ChessPiece } from './ChessPiece';
import { PieceSymbol } from 'chess.js';

interface PromotionDialogProps {
  color: 'w' | 'b';
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({ color, onSelect }) => {
  const pieces: Array<{ type: PieceSymbol; label: string }> = [
    { type: 'q', label: 'Queen' },
    { type: 'r', label: 'Rook' },
    { type: 'b', label: 'Bishop' },
    { type: 'n', label: 'Knight' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Column
        gap="m"
        padding="xl"
        background="surface"
        border="neutral-medium"
        style={{
          maxWidth: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: '24px',
        }}
      >
        <Text variant="heading-strong-m" align="center">
          Choose Promotion
        </Text>

        <Row gap="m" fillWidth horizontal="center">
          {pieces.map((piece) => (
            <Column
              key={piece.type}
              gap="xs"
              horizontal="center"
              vertical="center"
              padding="m"
              style={{
                cursor: 'pointer',
                backgroundColor: '#f5f5f4',
                transition: 'all 0.2s ease',
                minWidth: '70px',
                borderRadius: '16px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fecaca';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f4';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={() => onSelect(piece.type as 'q' | 'r' | 'b' | 'n')}
            >
              <div style={{ width: '50px', height: '50px' }}>
                <ChessPiece piece={{ type: piece.type, color }} />
              </div>
              <Text variant="label-default-xs" align="center">
                {piece.label}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>
    </div>
  );
};
