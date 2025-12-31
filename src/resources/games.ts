import { Game } from "@/types/game.types";

export const games: Game[] = [
  {
    slug: "chess",
    title: "Chess Master",
    description: "Play classic chess with move validation, undo functionality, and move history tracking. Challenge yourself in this timeless strategy game.",
    image: "/images/games/chess.png",
    difficulty: "Hard",
    category: "Strategy",
    stats: {
      plays: 2341,
      avgScore: 85,
    },
  },
  {
    slug: "typing-speed",
    title: "Typing Speed Master",
    description: "Test your typing speed and accuracy with this fast-paced typing challenge. Race against time and beat your high score!",
    image: "/images/games/typing-speed.png",
    difficulty: "Medium",
    category: "Skill",
    stats: {
      plays: 1247,
      avgScore: 45,
    },
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Challenge your memory with this classic card matching game. Find all the pairs before time runs out!",
    image: "/images/games/memory-match.png",
    difficulty: "Easy",
    category: "Puzzle",
    stats: {
      plays: 856,
      avgScore: 78,
    },
  },
  {
    slug: "word-hunt",
    title: "Word Hunt",
    description: "Find as many words as you can in the grid. Perfect for word lovers and puzzle enthusiasts!",
    image: "/images/games/word-hunt.png",
    difficulty: "Hard",
    category: "Word",
    stats: {
      plays: 523,
      avgScore: 62,
    },
  },
];
