import React from 'react';
import { ChessPieceData } from '@/types/chess.types';
import { ChessPieceSVG } from './ChessPieceSVG';

interface ChessPieceProps {
  piece: ChessPieceData;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        width: '80%',
        height: '80%',
        filter: piece.color === 'w'
          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
      }}
    >
      <ChessPieceSVG
        type={piece.type}
        color={piece.color}
        size={100}
      />
    </div>
  );
};
