import { Card, Game, Player } from '../models/game.model';
import { VoteGroup } from '../models/vote-summary.model';

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

export function computeVoteGroups(players: Player[]): VoteGroup[] {
  const activePlayers = players.filter(p => p.mode === 'player' && p.selectedCard !== null);

  const map = new Map<string, VoteGroup>();
  for (const player of activePlayers) {
    const card = player.selectedCard!;
    const existing = map.get(card.id);
    if (existing) {
      existing.count++;
    } else {
      map.set(card.id, { cardId: card.id, value: card.value, count: 1 });
    }
  }

  return [...map.values()].sort((a, b) => {
    const aNum = typeof a.value === 'number' ? a.value : Infinity;
    const bNum = typeof b.value === 'number' ? b.value : Infinity;
    return aNum - bNum;
  });
}

export function computeAverage(players: Player[]): number | null {
  const numericVotes = players
    .filter(p => p.mode === 'player' && p.selectedCard !== null)
    .map(p => p.selectedCard!.value)
    .filter((v): v is number => typeof v === 'number');

  if (numericVotes.length === 0) return null;

  const sum = numericVotes.reduce((acc, v) => acc + v, 0);
  const avg = sum / numericVotes.length;

  return Math.round(avg * 10) / 10;
}