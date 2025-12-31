import { useState, useEffect, useRef, useCallback } from 'react';
import type { PieceColor, TimeControl } from '@/types/chess.types';

export interface ChessTimerState {
  whiteTime: number; // milliseconds
  blackTime: number; // milliseconds
  isRunning: boolean;
  activeColor: PieceColor | null;
}

export interface UseChessTimerReturn {
  whiteTime: number;
  blackTime: number;
  isRunning: boolean;
  activeColor: PieceColor | null;
  whiteTimeFormatted: string;
  blackTimeFormatted: string;
  startTimer: (color: PieceColor) => void;
  pauseTimer: () => void;
  switchTurn: (toColor: PieceColor) => void;
  resetTimer: (timeControl: TimeControl) => void;
  setTimes: (white: number, black: number) => void;
  isTimeUp: (color: PieceColor) => boolean;
}

export function useChessTimer(initialTimeControl: TimeControl): UseChessTimerReturn {
  const [whiteTime, setWhiteTime] = useState(initialTimeControl.initialTime);
  const [blackTime, setBlackTime] = useState(initialTimeControl.initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [activeColor, setActiveColor] = useState<PieceColor | null>(null);
  const [timeControl, setTimeControl] = useState(initialTimeControl);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Start timer for a specific color
  const startTimer = useCallback((color: PieceColor) => {
    setActiveColor(color);
    setIsRunning(true);
    lastTickRef.current = Date.now();
  }, []);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setActiveColor(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Switch turn and add increment
  const switchTurn = useCallback((toColor: PieceColor) => {
    // Add increment to the player who just moved
    const fromColor: PieceColor = toColor === 'w' ? 'b' : 'w';
    if (fromColor === 'w') {
      setWhiteTime((prev) => prev + timeControl.increment);
    } else {
      setBlackTime((prev) => prev + timeControl.increment);
    }

    // Switch active timer
    setActiveColor(toColor);
    lastTickRef.current = Date.now();
  }, [timeControl.increment]);

  // Reset timer to initial state
  const resetTimer = useCallback((newTimeControl: TimeControl) => {
    pauseTimer();
    setTimeControl(newTimeControl);
    setWhiteTime(newTimeControl.initialTime);
    setBlackTime(newTimeControl.initialTime);
  }, [pauseTimer]);

  // Set times directly (for syncing in online games)
  const setTimes = useCallback((white: number, black: number) => {
    setWhiteTime(white);
    setBlackTime(black);
  }, []);

  // Check if time is up
  const isTimeUp = useCallback((color: PieceColor): boolean => {
    const time = color === 'w' ? whiteTime : blackTime;
    return time <= 0;
  }, [whiteTime, blackTime]);

  // Timer tick effect
  useEffect(() => {
    if (!isRunning || activeColor === null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      if (activeColor === 'w') {
        setWhiteTime((prev) => {
          const newTime = Math.max(0, prev - elapsed);
          if (newTime === 0) {
            pauseTimer();
          }
          return newTime;
        });
      } else {
        setBlackTime((prev) => {
          const newTime = Math.max(0, prev - elapsed);
          if (newTime === 0) {
            pauseTimer();
          }
          return newTime;
        });
      }
    }, 100); // Update every 100ms for smooth countdown

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activeColor, pauseTimer]);

  return {
    whiteTime,
    blackTime,
    isRunning,
    activeColor,
    whiteTimeFormatted: formatTime(whiteTime),
    blackTimeFormatted: formatTime(blackTime),
    startTimer,
    pauseTimer,
    switchTurn,
    resetTimer,
    setTimes,
    isTimeUp,
  };
}

// Predefined time controls
export const TIME_CONTROLS: Record<string, TimeControl> = {
  bullet: {
    type: 'blitz',
    initialTime: 60000, // 1 minute
    increment: 0,
  },
  blitz_3: {
    type: 'blitz',
    initialTime: 180000, // 3 minutes
    increment: 0,
  },
  blitz_3_2: {
    type: 'blitz',
    initialTime: 180000, // 3 minutes
    increment: 2000, // +2 seconds
  },
  blitz_5: {
    type: 'blitz',
    initialTime: 300000, // 5 minutes
    increment: 0,
  },
  blitz_5_3: {
    type: 'blitz',
    initialTime: 300000, // 5 minutes
    increment: 3000, // +3 seconds
  },
  rapid_10: {
    type: 'rapid',
    initialTime: 600000, // 10 minutes
    increment: 0,
  },
  rapid_15_10: {
    type: 'rapid',
    initialTime: 900000, // 15 minutes
    increment: 10000, // +10 seconds
  },
  classical_30: {
    type: 'classical',
    initialTime: 1800000, // 30 minutes
    increment: 0,
  },
  unlimited: {
    type: 'unlimited',
    initialTime: Infinity,
    increment: 0,
  },
};
