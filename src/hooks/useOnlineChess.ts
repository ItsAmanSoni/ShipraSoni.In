import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChessEngine } from '@/lib/chess/chessEngine';
import type { Square, PieceColor, TimeControl, GameStatus } from '@/types/chess.types';
import * as roomService from '@/lib/chess/roomService';
import type { GameRoom } from '@/lib/chess/roomService';
import { useChessTimer } from './useChessTimer';

export interface UseOnlineChessReturn {
  // Room state
  roomCode: string | null;
  isHost: boolean;
  playerColor: PieceColor | null;
  opponentName: string | null;
  opponentConnected: boolean;
  roomStatus: 'idle' | 'creating' | 'joining' | 'waiting' | 'active' | 'finished';
  error: string | null;

  // Game state
  position: Record<string, any>;
  selectedSquare: Square | null;
  legalMoves: Square[];
  gameStatus: GameStatus;
  moveHistory: any[];
  lastMove: { from: Square; to: Square } | null;
  turn: PieceColor;
  isMyTurn: boolean;

  // Timer state
  whiteTime: string;
  blackTime: string;
  timerActive: PieceColor | null;

  // Actions
  createRoom: (playerName: string, color: PieceColor, timeControl?: TimeControl) => Promise<void>;
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  handleSquareClick: (square: Square) => void;
  handlePromotion: (piece: string) => void;
  leaveRoom: () => void;
  copyRoomCode: () => void;
}

export function useOnlineChess(): UseOnlineChessReturn {
  const chess = useRef(new ChessEngine()).current;

  // Room state
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerId] = useState(() => `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [roomStatus, setRoomStatus] = useState<'idle' | 'creating' | 'joining' | 'waiting' | 'active' | 'finished'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [opponentConnected, setOpponentConnected] = useState(false);

  // Game state
  const [position, setPosition] = useState<string>(chess.getPosition());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('active');
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [currentTimeControl, setCurrentTimeControl] = useState<TimeControl | null>(null);

  // Get current board position as object from FEN
  const boardPosition = useMemo(() => {
    const pos: { [square: string]: any } = {};
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    ranks.forEach(rank => {
      files.forEach(file => {
        const square = `${file}${rank}` as Square;
        pos[square] = chess.getPieceAt(square);
      });
    });

    return pos;
  }, [position, chess]);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Timer
  const timer = useChessTimer(currentTimeControl || { type: 'unlimited', initialTime: Infinity, increment: 0 });

  // Create room
  const createRoom = useCallback(async (name: string, color: PieceColor, timeControl?: TimeControl) => {
    try {
      setRoomStatus('creating');
      setError(null);
      setPlayerName(name);
      setPlayerColor(color);
      setIsHost(true);
      setCurrentTimeControl(timeControl || null);

      const code = await roomService.createRoom(
        playerId,
        name,
        color,
        chess.getPosition(),
        timeControl
      );

      setRoomCode(code);
      setRoomStatus('waiting');
    } catch (err) {
      setError('Failed to create room');
      setRoomStatus('idle');
      console.error('Create room error:', err);
    }
  }, [playerId, chess]);

  // Join room
  const joinRoom = useCallback(async (code: string, name: string) => {
    try {
      setRoomStatus('joining');
      setError(null);
      setPlayerName(name);

      const result = await roomService.joinRoom(code, playerId, name);

      if (!result.success) {
        setError(result.error || 'Failed to join room');
        setRoomStatus('idle');
        return;
      }

      setRoomCode(code);
      setPlayerColor(result.playerColor!);
      setIsHost(false);
      setRoomStatus('active');
    } catch (err) {
      setError('Failed to join room');
      setRoomStatus('idle');
      console.error('Join room error:', err);
    }
  }, [playerId]);

  // Subscribe to room updates
  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = roomService.subscribeToRoom(roomCode, (room: GameRoom | null) => {
      if (!room) {
        setError('Room no longer exists');
        setRoomStatus('idle');
        return;
      }

      // Update room status
      setRoomStatus(room.status);

      // Update opponent info
      const opponent = playerColor === 'w' ? room.blackPlayer : room.whitePlayer;
      if (opponent) {
        setOpponentName(opponent.name);
        setOpponentConnected(opponent.connected);
      }

      // Sync game state
      if (room.gameState) {
        chess.load(room.gameState.position);
        setPosition(chess.getPosition());
        setMoveHistory(room.gameState.moves || []);
        setTurn(room.gameState.turn);
        setGameStatus(room.gameState.gameStatus);

        // Update last move
        const moves = room.gameState.moves || [];
        if (moves.length > 0) {
          const last = moves[moves.length - 1];
          setLastMove({ from: last.from, to: last.to });
        }
      }

      // Sync timer state
      if (room.timeControl && room.whiteTime !== undefined && room.blackTime !== undefined) {
        setCurrentTimeControl(room.timeControl);
        timer.setTimes(room.whiteTime, room.blackTime);

        // Start timer if game is active and has both players
        if (room.status === 'active' && room.whitePlayer && room.blackPlayer) {
          if (!timer.isRunning) {
            timer.startTimer(room.gameState.turn);
          }
        }
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [roomCode, playerColor, chess]);

  // Handle square click
  const handleSquareClick = useCallback((square: Square) => {
    // Only allow moves if it's your turn and game is active
    if (!playerColor || turn !== playerColor || roomStatus !== 'active') {
      return;
    }

    if (selectedSquare === null) {
      // Select piece
      const piece = chess.getPieceAt(square);
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        setLegalMoves(chess.getLegalMoves(square));
      }
    } else {
      // Try to make move
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Check if pawn promotion
      const piece = chess.getPieceAt(selectedSquare);
      if (
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && square[1] === '8') || (piece.color === 'b' && square[1] === '1'))
      ) {
        setPendingPromotion({ from: selectedSquare, to: square });
        return;
      }

      // Make the move
      const move = chess.move(selectedSquare, square);
      if (move && roomCode) {
        // Switch timer turn and apply increment
        if (currentTimeControl) {
          timer.switchTurn(chess.getTurn());
        }

        roomService.makeMove(
          roomCode,
          move,
          chess.getPosition(),
          chess.getTurn(),
          chess.getGameStatus(),
          currentTimeControl ? timer.whiteTime : undefined,
          currentTimeControl ? timer.blackTime : undefined
        );

        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    }
  }, [selectedSquare, playerColor, turn, roomStatus, roomCode, chess, currentTimeControl, timer]);

  // Handle promotion
  const handlePromotion = useCallback((piece: string) => {
    if (pendingPromotion && roomCode) {
      const move = chess.move(pendingPromotion.from, pendingPromotion.to, piece);
      if (move) {
        // Switch timer turn and apply increment
        if (currentTimeControl) {
          timer.switchTurn(chess.getTurn());
        }

        roomService.makeMove(
          roomCode,
          move,
          chess.getPosition(),
          chess.getTurn(),
          chess.getGameStatus(),
          currentTimeControl ? timer.whiteTime : undefined,
          currentTimeControl ? timer.blackTime : undefined
        );
      }
      setPendingPromotion(null);
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [pendingPromotion, roomCode, chess, currentTimeControl, timer]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (roomCode && playerColor) {
      await roomService.updatePlayerConnection(roomCode, playerColor, false);
    }
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    timer.pauseTimer();
    setRoomCode(null);
    setRoomStatus('idle');
    setPlayerColor(null);
    setOpponentName(null);
    setCurrentTimeControl(null);
    chess.reset();
    setPosition(chess.getPosition());
  }, [roomCode, playerColor, chess, timer]);

  // Copy room code
  const copyRoomCode = useCallback(() => {
    if (roomCode && navigator.clipboard) {
      navigator.clipboard.writeText(roomCode);
    }
  }, [roomCode]);

  // Update connection status on mount/unmount
  useEffect(() => {
    if (roomCode && playerColor) {
      roomService.updatePlayerConnection(roomCode, playerColor, true);

      return () => {
        roomService.updatePlayerConnection(roomCode, playerColor, false);
      };
    }
  }, [roomCode, playerColor]);

  const isMyTurn = playerColor === turn && roomStatus === 'active';

  // Check for timeout
  useEffect(() => {
    if (currentTimeControl && roomCode && roomStatus === 'active') {
      if (timer.isTimeUp('w')) {
        roomService.endGame(roomCode, 'timeout');
        setGameStatus('timeout');
      } else if (timer.isTimeUp('b')) {
        roomService.endGame(roomCode, 'timeout');
        setGameStatus('timeout');
      }
    }
  }, [timer.whiteTime, timer.blackTime, currentTimeControl, roomCode, roomStatus]);

  return {
    roomCode,
    isHost,
    playerColor,
    opponentName,
    opponentConnected,
    roomStatus,
    error,
    position: boardPosition,
    selectedSquare,
    legalMoves,
    gameStatus,
    moveHistory,
    lastMove,
    turn,
    isMyTurn,
    whiteTime: timer.whiteTimeFormatted,
    blackTime: timer.blackTimeFormatted,
    timerActive: timer.activeColor,
    createRoom,
    joinRoom,
    handleSquareClick,
    handlePromotion,
    leaveRoom,
    copyRoomCode,
  };
}
