import { Card, Game } from '../models/game.model';

export const DEFAULT_CARDS: Card[] = [
  { id: '0', value: 0 },
  { id: '1', value: 1 },
  { id: '3', value: 3 },
  { id: '5', value: 5 },
  { id: '8', value: 8 },
  { id: '13', value: 13 },
  { id: '21', value: 21 },
  { id: '34', value: 34 },
  { id: '55', value: 55 },
  { id: '89', value: 89 },
  { id: '?', value: '?' },
  { id: 'coffee', value: '☕' },
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