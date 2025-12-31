// Gemini AI Chess Engine using Firebase Vertex AI
// This will be called from the API route server-side

import { model } from '@/lib/firebase/config';

export async function getAIMoveFromGemini(
  fen: string,
  moveHistory: string[],
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<string | null> {
  try {
    const prompt = buildChessPrompt(fen, moveHistory, difficulty);
    const result = await model.generateContent(prompt);

    // Get text from the response - Firebase AI SDK response structure
    const aiResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract move from AI response
    const move = parseAIMove(aiResponse);
    return move;
  } catch (error) {
    console.error('Gemini AI error:', error);
    return null;
  }
}

function buildChessPrompt(fen: string, moveHistory: string[], difficulty: string): string {
  const difficultyInstructions = {
    easy: `You are a beginner chess player. Make simple, basic moves. Sometimes make suboptimal moves.
    Focus on developing pieces but don't worry too much about strategy. Occasionally miss tactical opportunities.`,

    medium: `You are an intermediate chess player. Make solid moves with decent strategy.
    Look for basic tactics like forks, pins, and checks. Consider piece safety and development.
    Play reasonable opening principles and think 2-3 moves ahead.`,

    hard: `You are an advanced chess player. Make the strongest possible moves.
    Look for deep tactical combinations, positional advantages, and strategic plans.
    Consider king safety, pawn structure, piece activity, and calculate several moves ahead.
    Play optimally and punish opponent mistakes.`
  };

  return `You are a chess engine analyzing a chess position. Your task is to suggest the best move.

Current Position (FEN): ${fen}
Move History: ${moveHistory.join(', ') || 'Game just started'}

Difficulty Level: ${difficulty}
${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}

IMPORTANT INSTRUCTIONS:
1. Respond with ONLY a single chess move in standard algebraic notation (SAN)
2. Examples of valid moves: "e4", "Nf3", "O-O", "Bxf7+", "exd5", "Qh4+", "Rxa8"
3. Do NOT include any explanation, just the move
4. Do NOT use long algebraic notation (like e2-e4)
5. Make sure the move is legal for the current position
6. Consider the difficulty level when choosing your move

Your move:`;
}

function parseAIMove(response: string): string | null {
  // Clean up the response
  let move = response.trim();

  // Remove any common prefixes/suffixes
  move = move.replace(/^(move:|best move:|i suggest:|i recommend:)/i, '').trim();
  move = move.split('\n')[0].trim(); // Take first line only
  move = move.split(' ')[0].trim(); // Take first word only

  // Remove any quotes or punctuation at the end
  move = move.replace(/[.,!?'"]+$/, '');

  // Basic validation: chess moves are typically 2-7 characters
  if (move.length >= 2 && move.length <= 7) {
    return move;
  }

  return null;
}
