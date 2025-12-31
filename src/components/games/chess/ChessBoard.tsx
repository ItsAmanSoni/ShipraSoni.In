import React from 'react';
import { Column, Row } from '@once-ui-system/core';
import { Square } from '@/types/chess.types';
import { ChessPieceData } from '@/types/chess.types';
import { ChessSquare } from './ChessSquare';

interface ChessBoardProps {
  position: { [square: string]: ChessPieceData | null };
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  onSquareClick: (square: Square) => void;
  flipped?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  position,
  selectedSquare,
  legalMoves,
  lastMove,
  onSquareClick,
  flipped = false,
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  const displayFiles = flipped ? [...files].reverse() : files;
  const displayRanks = flipped ? [...ranks].reverse() : ranks;

  return (
    <Column
      fillWidth
      gap="0"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        aspectRatio: '1',
        overflow: 'hidden',
        border: '2px solid var(--neutral-border-strong)',
        borderRadius: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      }}
      s={{ style: { maxWidth: '100%' } }}
    >
      {displayRanks.map((rank) => (
        <Row key={rank} fillWidth gap="0" style={{ flex: '1 1 0' }}>
          {displayFiles.map((file) => {
            const square = `${file}${rank}` as Square;
            const piece = position[square];
            const fileIndex = files.indexOf(file);
            const isLight = (fileIndex + rank) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            const isLastMove = lastMove
              ? lastMove.from === square || lastMove.to === square
              : false;

            return (
              <ChessSquare
                key={square}
                square={square}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isLegalMove={isLegalMove}
                isLastMove={isLastMove}
                onClick={onSquareClick}
              />
            );
          })}
        </Row>
      ))}
    </Column>
  );
};
