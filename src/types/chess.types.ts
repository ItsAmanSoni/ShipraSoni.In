import { Square, Move as ChessJsMove, PieceSymbol } from 'chess.js';

// Re-export Square from chess.js
export type { Square };

export type GameMode = 'local' | 'ai' | 'online' | 'puzzle';

export type GameStatus = 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw' | 'resigned' | 'timeout';

export type PieceColor = 'w' | 'b';

export interface ChessPieceData {
  type: PieceSymbol;
  color: PieceColor;
}

export interface ChessMove extends ChessJsMove {
  timestamp?: number;
}

export interface TimeControl {
  type: 'blitz' | 'rapid' | 'classical' | 'unlimited';
  initialTime: number; // milliseconds
  increment: number; // milliseconds per move
}

export interface GameState {
  position: string; // FEN
  moves: ChessMove[];
  turn: PieceColor;
  gameStatus: GameStatus;
}

export interface MultiplayerState {
  gameId: string;
  roomCode: string;
  playerColor: PieceColor;
  opponentConnected: boolean;
  whitePlayer: Player;
  blackPlayer: Player;
  timeControl: TimeControl;
  whiteTime: number;
  blackTime: number;
}

export interface Player {
  uid: string;
  name: string;
  connected: boolean;
}

export interface ChessPuzzle {
  id: string;
  fen: string; // Starting position
  moves: string[]; // Correct move sequence
  rating: number; // Difficulty rating
  themes: string[]; // e.g., ['fork', 'pin', 'checkmate']
}

export interface GameResult {
  winner: PieceColor | 'draw';
  reason: 'checkmate' | 'resignation' | 'timeout' | 'stalemate' | 'agreement';
  moves: ChessMove[];
  duration: number; // seconds
}
