import React from 'react';
import { Column } from '@once-ui-system/core';
import { ChessPieceData, Square } from '@/types/chess.types';
import { ChessPiece } from './ChessPiece';

interface ChessSquareProps {
  square: Square;
  piece: ChessPieceData | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  onClick: (square: Square) => void;
}

export const ChessSquare: React.FC<ChessSquareProps> = ({
  square,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isLastMove,
  onClick,
}) => {
  const getBackgroundColor = () => {
    if (isSelected) return 'var(--accent-alpha-medium, #fca5a5)'; // Light red for selected
    if (isLastMove) return 'var(--accent-alpha-weak, #fecaca)'; // Pale red for last move
    if (isLight) return 'var(--neutral-alpha-weak, #f5f5f4)'; // Light square
    return 'var(--neutral-alpha-medium, #a8a29e)'; // Dark square
  };

  return (
    <Column
      horizontal="center"
      vertical="center"
      style={{
        flex: '1 1 0',
        aspectRatio: '1',
        position: 'relative',
        backgroundColor: getBackgroundColor(),
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        border: 'none',
      }}
      onClick={() => onClick(square)}
    >
      {piece && <ChessPiece piece={piece} />}

      {/* Legal move indicator */}
      {isLegalMove && !piece && (
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            opacity: 0.4,
          }}
        />
      )}

      {/* Legal capture indicator */}
      {isLegalMove && piece && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            right: '4px',
            bottom: '4px',
            border: '3px solid #ef4444',
            borderRadius: '50%',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
      )}
    </Column>
  );
};
