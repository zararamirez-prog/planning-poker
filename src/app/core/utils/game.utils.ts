import { Card, Game } from '../models/game.model';

export const DEFAULT_CARDS: Card[] = [
  { id: '1', value: 1 },
  { id: '2', value: 2 },
  { id: '3', value: 3 },
  { id: '5', value: 5 },
  { id: '8', value: 8 },
  { id: '13', value: 13 },
  { id: '21', value: 21 },
];

export const createInitialGame = (name: string): Game => {
  const id = crypto.randomUUID();
  return {
    id,
    name,
    status: 'waiting',
    inviteLink: `${window.location.origin}/game/${id}`,
    players: []
  };
};