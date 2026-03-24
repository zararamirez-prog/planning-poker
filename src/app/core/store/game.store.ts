import { Injectable, signal, computed } from '@angular/core';
import { Game, Player, PlayerMode } from '../models/game.model';
import { createInitialGame } from '../utils/game.utils';

@Injectable({ providedIn: 'root' })
export class GameStore {
  private readonly _game = signal<Game | null>(null);

  readonly game = computed(() => this._game());
  readonly gameName = computed(() => this._game()?.name ?? '');
  readonly players = computed(() => this._game()?.players ?? []);
  readonly status = computed(() => this._game()?.status ?? 'waiting');
  readonly inviteLink = computed(() => this._game()?.inviteLink ?? '');

  createGame(name: string): void {
    this._game.set(createInitialGame(name));
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
      players: [adminPlayer]
    });
  }
}