export interface Game {
  id: string;
  name: string;
  players: Player[];
  status: GameStatus;
  cards: Card[];
  inviteLink: string;
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  mode: PlayerMode;
  selectedCard: string | number | null;
}

export interface Card {
  id: string;
  value: string | number;
}

export type GameStatus = 'waiting' | 'voting' | 'revealed';
export type PlayerRole = 'admin' | 'player';
export type PlayerMode = 'player' | 'spectator';