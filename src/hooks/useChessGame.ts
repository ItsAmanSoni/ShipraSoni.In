import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Move } from 'chess.js';
import { ChessEngine } from '@/lib/chess/chessEngine';
import { GameStatus, GameMode, ChessPieceData, Square } from '@/types/chess.types';
import { useChessAI } from './useChessAI';

export function useChessGame(initialMode: GameMode = 'local') {
  const [chess] = useState(() => new ChessEngine());
  const [position, setPosition] = useState(chess.getPosition());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>(initialMode);
  const [gameStatus, setGameStatus] = useState<GameStatus>('active');
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w'); // Player plays as white by default

  const { aiThinking, difficulty, setDifficulty, getAIMove } = useChessAI();
  const aiMoveInProgress = useRef(false);

  // Get current board position as object
  const boardPosition = useMemo(() => {
    const pos: { [square: string]: ChessPieceData | null } = {};
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    ranks.forEach(rank => {
      files.forEach(file => {
        const square = `${file}${rank}` as Square;
        pos[square] = chess.getPieceAt(square);
      });
    });

    return pos;
  }, [position]);

  const updateGameState = useCallback(() => {
    setPosition(chess.getPosition());
    setGameStatus(chess.getGameStatus());
    setMoveHistory(chess.getMoveHistory());
  }, [chess]);

  // AI move effect - triggers after player's move in AI mode
  useEffect(() => {
    const makeAIMove = async () => {
      // Only make AI move if:
      // - Game mode is AI
      // - It's AI's turn (opposite of player color)
      // - Game is still active
      // - Not already making an AI move
      if (
        gameMode === 'ai' &&
        chess.getTurn() !== playerColor &&
        !chess.isGameOver() &&
        !aiMoveInProgress.current
      ) {
        aiMoveInProgress.current = true;

        // Small delay to make it feel more natural
        await new Promise((resolve) => setTimeout(resolve, 500));

        const aiMove = await getAIMove(
          chess.getPosition(),
          chess.getMoveHistory().map((m) => m.san)
        );

        if (aiMove) {
          const move = chess.move(aiMove.from, aiMove.to, aiMove.promotion);
          if (move) {
            setLastMove({ from: move.from, to: move.to });
            updateGameState();
          }
        }

        aiMoveInProgress.current = false;
      }
    };

    makeAIMove();
  }, [position, gameMode, playerColor, chess, getAIMove, updateGameState]);

  const handleSquareClick = useCallback((square: Square) => {
    // Don't allow moves if AI is thinking or if it's AI's turn
    if (aiThinking || (gameMode === 'ai' && chess.getTurn() !== playerColor)) {
      return;
    }

    if (!selectedSquare) {
      // Select a piece
      const piece = chess.getPieceAt(square);
      if (piece && piece.color === chess.getTurn()) {
        const moves = chess.getLegalMoves(square);
        if (moves.length > 0) {
          setSelectedSquare(square);
          setLegalMoves(moves);
        }
      }
    } else {
      // Attempt to move
      if (legalMoves.includes(square)) {
        // Check if this is a pawn promotion
        const piece = chess.getPieceAt(selectedSquare);
        const isPromotion =
          piece &&
          piece.type === 'p' &&
          ((piece.color === 'w' && square[1] === '8') ||
           (piece.color === 'b' && square[1] === '1'));

        if (isPromotion) {
          // Open promotion dialog
          setPendingPromotion({ from: selectedSquare as Square, to: square as Square });
        } else {
          // Regular move
          const move = chess.move(selectedSquare as Square, square as Square);
          if (move) {
            setLastMove({ from: move.from, to: move.to });
            updateGameState();
          }
        }
      }
      // Deselect
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [selectedSquare, legalMoves, chess, updateGameState]);

  const handlePromotion = useCallback((piece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      const move = chess.move(pendingPromotion.from, pendingPromotion.to, piece);
      if (move) {
        setLastMove({ from: move.from, to: move.to });
        updateGameState();
      }
      setPendingPromotion(null);
    }
  }, [pendingPromotion, chess, updateGameState]);

  const newGame = useCallback(() => {
    chess.reset();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setPendingPromotion(null);
    updateGameState();
  }, [chess, updateGameState]);

  const undo = useCallback(() => {
    const undoneMove = chess.undo();
    if (undoneMove) {
      setSelectedSquare(null);
      setLegalMoves([]);
      setLastMove(null);
      updateGameState();
    }
  }, [chess, updateGameState]);

  const canUndo = useMemo(() => {
    return moveHistory.length > 0;
  }, [moveHistory]);

  return {
    position: boardPosition,
    selectedSquare,
    legalMoves,
    gameMode,
    gameStatus,
    moveHistory,
    lastMove,
    turn: chess.getTurn(),
    isGameOver: chess.isGameOver(),
    pendingPromotion,
    aiThinking,
    difficulty,
    playerColor,
    handleSquareClick,
    handlePromotion,
    newGame,
    undo,
    canUndo,
    setGameMode,
    setDifficulty,
    setPlayerColor,
  };
}
