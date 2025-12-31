import { NextRequest, NextResponse } from 'next/server';
import { getAIMoveFromGemini } from '@/lib/chess/geminiAI';
import { Chess } from 'chess.js';

export async function POST(request: NextRequest) {
  try {
    const { fen, moveHistory, difficulty } = await request.json();

    // Validate input
    if (!fen || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get AI move suggestion from Gemini using Firebase AI
    const aiMove = await getAIMoveFromGemini(fen, moveHistory || [], difficulty);

    if (!aiMove) {
      return NextResponse.json(
        { error: 'Failed to get AI move suggestion' },
        { status: 500 }
      );
    }

    // Validate the AI move is legal
    const chess = new Chess(fen);
    try {
      const move = chess.move(aiMove);
      if (!move) {
        throw new Error('Invalid move from AI');
      }

      return NextResponse.json({
        move: aiMove,
        san: move.san,
        from: move.from,
        to: move.to,
      });
    } catch (error) {
      // If AI move is invalid, return a random legal move as fallback
      const legalMoves = chess.moves();
      if (legalMoves.length > 0) {
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        const move = chess.move(randomMove);

        return NextResponse.json({
          move: randomMove,
          san: move!.san,
          from: move!.from,
          to: move!.to,
          fallback: true,
        });
      }

      return NextResponse.json(
        { error: 'No legal moves available' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('AI move generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
