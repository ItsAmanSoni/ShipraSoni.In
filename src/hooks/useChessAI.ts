import { useState, useCallback } from 'react';
import { Square } from 'chess.js';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

interface AIMove {
  from: Square;
  to: Square;
  promotion?: string;
}

export function useChessAI() {
  const [aiThinking, setAiThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');

  const getAIMove = useCallback(
    async (fen: string, moveHistory: string[]): Promise<AIMove | null> => {
      setAiThinking(true);

      try {
        const response = await fetch('/api/chess/gemini-move', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fen,
            moveHistory,
            difficulty,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('AI move error:', error);
          return null;
        }

        const data = await response.json();

        if (data.fallback) {
          console.warn('AI returned invalid move, using fallback');
        }

        return {
          from: data.from as Square,
          to: data.to as Square,
          promotion: data.promotion,
        };
      } catch (error) {
        console.error('Failed to get AI move:', error);
        return null;
      } finally {
        setAiThinking(false);
      }
    },
    [difficulty]
  );

  return {
    aiThinking,
    difficulty,
    setDifficulty,
    getAIMove,
  };
}
