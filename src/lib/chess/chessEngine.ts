import { Chess, Square, Move, PieceSymbol } from 'chess.js';
import { GameStatus, ChessPieceData } from '@/types/chess.types';

export class ChessEngine {
  private chess: Chess;

  constructor(fen?: string) {
    this.chess = new Chess(fen);
  }

  // Core movement methods
  move(from: Square, to: Square, promotion?: string): Move | null {
    try {
      const move = this.chess.move({
        from,
        to,
        promotion: promotion as 'q' | 'r' | 'b' | 'n' | undefined,
      });
      return move;
    } catch (error) {
      return null;
    }
  }

  getLegalMoves(square?: Square): Square[] {
    const moves = this.chess.moves({ square, verbose: true });
    return moves.map((move) => move.to);
  }

  getPosition(): string {
    return this.chess.fen();
  }

  // Game status methods
  getGameStatus(): GameStatus {
    if (this.chess.isCheckmate()) return 'checkmate';
    if (this.chess.isStalemate()) return 'stalemate';
    if (this.chess.isDraw()) return 'draw';
    if (this.chess.inCheck()) return 'check';
    return 'active';
  }

  isCheck(): boolean {
    return this.chess.inCheck();
  }

  isCheckmate(): boolean {
    return this.chess.isCheckmate();
  }

  isStalemate(): boolean {
    return this.chess.isStalemate();
  }

  isDraw(): boolean {
    return this.chess.isDraw();
  }

  isGameOver(): boolean {
    return this.chess.isGameOver();
  }

  // Move history
  getMoveHistory(): Move[] {
    return this.chess.history({ verbose: true });
  }

  getLastMove(): Move | null {
    const history = this.chess.history({ verbose: true });
    return history.length > 0 ? history[history.length - 1] : null;
  }

  // Board state
  getPieceAt(square: Square): ChessPieceData | null {
    const piece = this.chess.get(square);
    return piece || null;
  }

  getTurn(): 'w' | 'b' {
    return this.chess.turn();
  }

  // Game control
  reset(): void {
    this.chess.reset();
  }

  undo(): Move | null {
    return this.chess.undo();
  }

  load(fen: string): boolean {
    try {
      this.chess.load(fen);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Export/Import
  exportPGN(): string {
    return this.chess.pgn();
  }

  loadPGN(pgn: string): boolean {
    try {
      this.chess.loadPgn(pgn);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get captured pieces
  getCapturedPieces(): { white: ChessPieceData[], black: ChessPieceData[] } {
    const allPieces: { [key in PieceSymbol]: number } = {
      p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
    };

    const boardPieces = this.chess.board().flat().filter(p => p !== null);

    const whitePiecesOnBoard: { [key in PieceSymbol]: number } = {
      p: 0, n: 0, b: 0, r: 0, q: 0, k: 0
    };
    const blackPiecesOnBoard: { [key in PieceSymbol]: number } = {
      p: 0, n: 0, b: 0, r: 0, q: 0, k: 0
    };

    boardPieces.forEach(piece => {
      if (piece) {
        if (piece.color === 'w') {
          whitePiecesOnBoard[piece.type]++;
        } else {
          blackPiecesOnBoard[piece.type]++;
        }
      }
    });

    const capturedWhite: ChessPieceData[] = [];
    const capturedBlack: ChessPieceData[] = [];

    // Calculate captured white pieces (captured by black)
    Object.keys(allPieces).forEach((pieceType) => {
      const type = pieceType as PieceSymbol;
      const missing = allPieces[type] - whitePiecesOnBoard[type];
      for (let i = 0; i < missing; i++) {
        capturedWhite.push({ type, color: 'w' });
      }
    });

    // Calculate captured black pieces (captured by white)
    Object.keys(allPieces).forEach((pieceType) => {
      const type = pieceType as PieceSymbol;
      const missing = allPieces[type] - blackPiecesOnBoard[type];
      for (let i = 0; i < missing; i++) {
        capturedBlack.push({ type, color: 'b' });
      }
    });

    return {
      white: capturedWhite,
      black: capturedBlack
    };
  }
}
