import { Card, Game } from '../models/game.model';

export const DEFAULT_CARD_VALUES: (string | number)[] = [
  0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'
];

export function createCards(values: (string | number)[]): Card[] {
  const seen = new Set<string | number>();
  return values
    .filter(v => {
      if (seen.has(v)) return false;
      seen.add(v);
      return true;
    })
    .map(v => ({ id: String(v), value: v }));
}

export const DEFAULT_CARDS: Card[] = createCards(DEFAULT_CARD_VALUES);

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