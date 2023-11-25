export interface Character {
  name: string;
  score: number;
  active: boolean;
  player: string;
  isPlayer: boolean;
  totalHealth: number;
  currentHealth: number;
}

export interface GameData {
  order: Character[];
  turn: number;
}
