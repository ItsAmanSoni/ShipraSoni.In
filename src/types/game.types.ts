export interface Game {
  slug: string;
  title: string;
  description: string;
  image: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  stats?: {
    plays?: number;
    avgScore?: number;
  };
}
