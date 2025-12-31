import { database } from '@/lib/firebase/config';
import { ref, set, get, onValue, off, update, remove, serverTimestamp } from 'firebase/database';
import type { Player, GameState, PieceColor, TimeControl } from '@/types/chess.types';

export interface GameRoom {
  roomCode: string;
  hostId: string;
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  hostColor: PieceColor;
  gameState: GameState;
  timeControl?: TimeControl;
  whiteTime?: number;
  blackTime?: number;
  lastMoveTime?: number;
  createdAt: number;
  status: 'waiting' | 'active' | 'finished';
}

// Generate a random 6-character room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar-looking characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new game room
export async function createRoom(
  hostId: string,
  hostName: string,
  hostColor: PieceColor,
  initialFEN: string,
  timeControl?: TimeControl
): Promise<string> {
  const roomCode = generateRoomCode();
  const roomRef = ref(database, `rooms/${roomCode}`);

  const room: any = {
    roomCode,
    hostId,
    whitePlayer: hostColor === 'w' ? { uid: hostId, name: hostName, connected: true } : null,
    blackPlayer: hostColor === 'b' ? { uid: hostId, name: hostName, connected: true } : null,
    hostColor,
    gameState: {
      position: initialFEN,
      moves: [],
      turn: 'w',
      gameStatus: 'active',
    },
    createdAt: Date.now(),
    status: 'waiting',
  };

  // Only add time control fields if timeControl is provided
  if (timeControl) {
    room.timeControl = timeControl;
    room.whiteTime = timeControl.initialTime;
    room.blackTime = timeControl.initialTime;
  }

  await set(roomRef, room);
  return roomCode;
}

// Join an existing room
export async function joinRoom(
  roomCode: string,
  playerId: string,
  playerName: string
): Promise<{ success: boolean; error?: string; playerColor?: PieceColor }> {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    return { success: false, error: 'Room not found' };
  }

  const room: GameRoom = snapshot.val();

  if (room.status !== 'waiting') {
    return { success: false, error: 'Room is not available' };
  }

  // Determine player color (opposite of host)
  const playerColor: PieceColor = room.hostColor === 'w' ? 'b' : 'w';
  const playerData: Player = { uid: playerId, name: playerName, connected: true };

  // Update room with second player
  await update(roomRef, {
    [playerColor === 'w' ? 'whitePlayer' : 'blackPlayer']: playerData,
    status: 'active',
  });

  return { success: true, playerColor };
}

// Subscribe to room updates
export function subscribeToRoom(
  roomCode: string,
  callback: (room: GameRoom | null) => void
): () => void {
  const roomRef = ref(database, `rooms/${roomCode}`);

  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as GameRoom);
    } else {
      callback(null);
    }
  });

  return () => off(roomRef, 'value', unsubscribe);
}

// Update game state in room
export async function updateGameState(
  roomCode: string,
  gameState: Partial<GameState>
): Promise<void> {
  const roomRef = ref(database, `rooms/${roomCode}/gameState`);
  await update(roomRef, gameState);
}

// Make a move in the room (with optional time updates)
export async function makeMove(
  roomCode: string,
  move: any,
  newFEN: string,
  newTurn: PieceColor,
  newStatus: string,
  whiteTime?: number,
  blackTime?: number
): Promise<void> {
  const roomRefGame = ref(database, `rooms/${roomCode}/gameState`);
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRefGame);

  if (!snapshot.exists()) return;

  const currentState = snapshot.val() as GameState;

  // Clean move object - remove undefined properties for Firebase
  const cleanMove = Object.fromEntries(
    Object.entries({ ...move, timestamp: Date.now() }).filter(([_, v]) => v !== undefined)
  );

  const updatedMoves = [...(currentState.moves || []), cleanMove];

  const updates: any = {
    'gameState/position': newFEN,
    'gameState/moves': updatedMoves,
    'gameState/turn': newTurn,
    'gameState/gameStatus': newStatus,
  };

  // Add time updates if provided
  if (whiteTime !== undefined && blackTime !== undefined) {
    updates.whiteTime = whiteTime;
    updates.blackTime = blackTime;
    updates.lastMoveTime = Date.now();
  }

  await update(roomRef, updates);
}

// Update player connection status
export async function updatePlayerConnection(
  roomCode: string,
  playerColor: PieceColor,
  connected: boolean
): Promise<void> {
  const playerPath = playerColor === 'w' ? 'whitePlayer/connected' : 'blackPlayer/connected';
  const roomRef = ref(database, `rooms/${roomCode}/${playerPath}`);
  await set(roomRef, connected);
}

// End game and mark room as finished
export async function endGame(
  roomCode: string,
  gameStatus: string
): Promise<void> {
  const roomRef = ref(database, `rooms/${roomCode}`);
  await update(roomRef, {
    status: 'finished',
    'gameState/gameStatus': gameStatus,
  });
}

// Delete a room (cleanup)
export async function deleteRoom(roomCode: string): Promise<void> {
  const roomRef = ref(database, `rooms/${roomCode}`);
  await remove(roomRef);
}

// Check if room exists
export async function roomExists(roomCode: string): Promise<boolean> {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  return snapshot.exists();
}

// Update timer state
export async function updateTimers(
  roomCode: string,
  whiteTime: number,
  blackTime: number,
  lastMoveTime?: number
): Promise<void> {
  const roomRef = ref(database, `rooms/${roomCode}`);
  await update(roomRef, {
    whiteTime,
    blackTime,
    lastMoveTime: lastMoveTime || Date.now(),
  });
}

// Start the game timer (when both players join)
export async function startGameTimer(roomCode: string): Promise<void> {
  const roomRef = ref(database, `rooms/${roomCode}`);
  await update(roomRef, {
    lastMoveTime: Date.now(),
  });
}
