import { Injectable, signal, computed } from '@angular/core';
import { Game, Player, PlayerMode, Card } from '../models/game.model';
import { createInitialGame, createCards, DEFAULT_CARDS } from '../utils/game.utils';

@Injectable({ providedIn: 'root' })
export class GameStore {
  private readonly _game = signal<Game | null>(null);
  private readonly _currentPlayerId = signal<string | null>(null);
  private readonly _cards = signal<Card[]>(DEFAULT_CARDS);
  private readonly STORAGE_KEY = 'planning_poker_game';
  private readonly PLAYER_KEY = 'planning_poker_player_id';

  constructor() {
    const savedGame = this.loadFromStorage();
    if (savedGame) this._game.set(savedGame);

    const savedPlayerId = localStorage.getItem(this.PLAYER_KEY);
    if (savedPlayerId) this._currentPlayerId.set(savedPlayerId);
  }

  readonly game = computed(() => this._game());
  readonly gameName = computed(() => this._game()?.name ?? '');
  readonly players = computed(() => this._game()?.players ?? []);
  readonly status = computed(() => this._game()?.status ?? 'waiting');
  readonly inviteLink = computed(() => this._game()?.inviteLink ?? '');
  readonly availableCards = computed(() => this._cards());

  private saveToStorage(game: Game | null): void {
    if (game) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(game));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private loadFromStorage(): Game | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  readonly currentPlayer = computed(() => {
    const id = this._currentPlayerId();
    return this.players().find(p => p.id === id) ?? null;
  });

  readonly isCurrentUserAdmin = computed(() => {
    return this.currentPlayer()?.role === 'admin';
  });

  readonly currentUserHasVoted = computed(() => {
    return this.currentPlayer()?.selectedCard !== null;
  });

  readonly currentUserCanVote = computed(() => {
    const player = this.currentPlayer();
    return player?.mode === 'player' && player?.selectedCard === null;
  });

  readonly allPlayersHaveVoted = computed(() => {
    const players = this.players();
    const activePlayers = players.filter(p => p.mode === 'player');
    return activePlayers.length > 0 && activePlayers.every(p => p.selectedCard !== null);
  });

  setCards(values: (string | number)[]): void {
    this._cards.set(createCards(values));
  }

  createGame(gameName: string): void {
    const game = createInitialGame(gameName);
    this._game.set(game);
    this.saveToStorage(game);
  }

  addAdminPlayer(name: string, mode: PlayerMode): void {
    const game = this._game();
    if (!game) return;

    const adminPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      role: 'admin',
      mode,
      selectedCard: null
    };

    this._game.set({
      ...game,
      players: [adminPlayer],
      status: 'voting'
    });

    this.saveToStorage(this._game());
    this._currentPlayerId.set(adminPlayer.id);
    localStorage.setItem(this.PLAYER_KEY, adminPlayer.id);
  }

  joinGame(gameId: string, playerName: string, playerMode: PlayerMode): void {
    const game = this._game();
    if (!game || game.id !== gameId) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      role: 'player',
      mode: playerMode,
      selectedCard: null
    };

    this._game.set({
      ...game,
      players: [...game.players, newPlayer]
    });

    this.saveToStorage(this._game());
    this._currentPlayerId.set(newPlayer.id);
    localStorage.setItem(this.PLAYER_KEY, newPlayer.id);
  }

  updatePlayerVote(playerId: string, card: Card): void {
    const game = this._game();
    if (!game) return;

    const updatedPlayers = game.players.map(player =>
      player.id === playerId && player.mode === 'player'
        ? { ...player, selectedCard: card }
        : player
    );

    this._game.set({
      ...game,
      players: updatedPlayers
    });

    this.saveToStorage(this._game());
  }
}