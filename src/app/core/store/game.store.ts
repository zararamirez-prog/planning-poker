import { Injectable, signal, computed } from '@angular/core';
import { Game, Player, PlayerMode, Card } from '../models/game.model';
import { createInitialGame, DEFAULT_CARDS } from '../utils/game.utils';

@Injectable({ providedIn: 'root' })
export class GameStore {
  private readonly _game = signal<Game | null>(null);
  private readonly _currentPlayerId = signal<string | null>(null);

  readonly game = computed(() => this._game());
  readonly gameName = computed(() => this._game()?.name ?? '');
  readonly players = computed(() => this._game()?.players ?? []);
  readonly status = computed(() => this._game()?.status ?? 'waiting');
  readonly inviteLink = computed(() => this._game()?.inviteLink ?? '');

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

  createGame(gameName: string): void {
    this._game.set(createInitialGame(gameName));
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

    this._currentPlayerId.set(adminPlayer.id);
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

    this._currentPlayerId.set(newPlayer.id);
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
  }

  getAvailableCards(): Card[] {
    return DEFAULT_CARDS;
  }
}