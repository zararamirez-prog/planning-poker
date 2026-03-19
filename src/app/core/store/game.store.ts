import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
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
}