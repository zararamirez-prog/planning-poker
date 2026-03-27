import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { Game, Player, PlayerMode, Card } from '../models/game.model';
import { createInitialGame, createCards, DEFAULT_CARDS } from '../utils/game.utils';

@Injectable({ providedIn: 'root' })
export class GameStore implements OnDestroy {
  private readonly _game = signal<Game | null>(null);
  private readonly _currentPlayerId = signal<string | null>(null);
  private readonly _cards = signal<Card[]>(DEFAULT_CARDS);

  private readonly STORAGE_KEY = 'planning_poker_game';
  private readonly PLAYER_KEY = 'planning_poker_player_id';

  // Canal de comunicación entre pestañas del mismo origen
  // Permite sincronizar el estado del juego en tiempo real sin backend
  private readonly channel = new BroadcastChannel('planning_poker');

  constructor() {
    // Restaura el juego desde localStorage al inicializar (compartido entre pestañas)
    const savedGame = this.loadFromStorage();
    if (savedGame) this._game.set(savedGame);

    // [CORREGIDO] Usa sessionStorage para el PLAYER_KEY
    // sessionStorage es por pestaña — cada pestaña recuerda su propio jugador
    // Esto evita que pestañas nuevas hereden el jugador de otra pestaña
    const savedPlayerId = sessionStorage.getItem(this.PLAYER_KEY);
    if (savedPlayerId) this._currentPlayerId.set(savedPlayerId);

    // Escucha cambios emitidos por otras pestañas y actualiza el signal del juego
    this.channel.onmessage = (event: MessageEvent<Game | null>) => {
      this._game.set(event.data);
    };
  }

  ngOnDestroy(): void {
    this.channel.close();
  }

  // ─── Computed signals ────────────────────────────────────────────────────

  readonly game = computed(() => this._game());
  readonly gameName = computed(() => this._game()?.name ?? '');
  readonly players = computed(() => this._game()?.players ?? []);
  readonly status = computed(() => this._game()?.status ?? 'waiting');
  readonly inviteLink = computed(() => this._game()?.inviteLink ?? '');
  readonly availableCards = computed(() => this._cards());

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

  readonly hasAnyVote = computed(() => {
    return this.players().some(p => p.mode === 'player' && p.selectedCard !== null);
  });

  // ─── Storage helpers ─────────────────────────────────────────────────────

  // El juego va en localStorage — compartido entre todas las pestañas del origen
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

  // Emite el estado actualizado a todas las pestañas que escuchan el canal
  private broadcast(game: Game | null): void {
    this.channel.postMessage(game);
  }

  // ─── Acciones ────────────────────────────────────────────────────────────

  setCards(values: (string | number)[]): void {
    this._cards.set(createCards(values));
  }

  createGame(gameName: string): void {
    const game = createInitialGame(gameName);
    this._game.set(game);
    this.saveToStorage(game);
    // No broadcast aquí — el juego recién creado aún no tiene jugadores
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

    const updated: Game = {
      ...game,
      players: [adminPlayer],
      status: 'voting'
    };

    this._game.set(updated);
    this.saveToStorage(updated);
    this.broadcast(updated);

    this._currentPlayerId.set(adminPlayer.id);
    // [CORREGIDO] sessionStorage — solo esta pestaña recuerda que es el admin
    sessionStorage.setItem(this.PLAYER_KEY, adminPlayer.id);
  }

  joinGame(gameId: string, playerName: string, playerMode: PlayerMode): void {
    const game = this._game();

    if (!game) {
      console.warn('No existe una partida activa. El link solo funciona en el mismo navegador donde se creó la partida.');
      return;
    }

    if (game.id !== gameId) {
      console.warn('El gameId del link no coincide con la partida activa.');
      return;
    }

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      role: 'player',
      mode: playerMode,
      selectedCard: null
    };

    const updated: Game = {
      ...game,
      players: [...game.players, newPlayer],
      status: 'voting'
    };

    this._game.set(updated);
    this.saveToStorage(updated);
    // Notifica a todas las pestañas que un nuevo jugador se unió
    this.broadcast(updated);

    this._currentPlayerId.set(newPlayer.id);
    // [CORREGIDO] sessionStorage — solo esta pestaña recuerda que es este jugador
    // Otras pestañas que abran el link tendrán su sessionStorage vacío
    // y deberán ingresar su propio nombre
    sessionStorage.setItem(this.PLAYER_KEY, newPlayer.id);
  }

  updatePlayerVote(playerId: string, card: Card): void {
    const game = this._game();
    if (!game || game.status !== 'voting') return;

    const updated: Game = {
      ...game,
      players: game.players.map(player =>
        player.id === playerId && player.mode === 'player'
          ? { ...player, selectedCard: card }
          : player
      )
    };

    this._game.set(updated);
    this.saveToStorage(updated);
    this.broadcast(updated);
  }

  revealCards(): void {
    const game = this._game();
    if (!game || !this.isCurrentUserAdmin()) return;

    const updated: Game = { ...game, status: 'revealed' };
    this._game.set(updated);
    this.saveToStorage(updated);
    this.broadcast(updated);
  }

  resetGame(): void {
    const game = this._game();
    if (!game || !this.isCurrentUserAdmin()) return;

    const updated: Game = {
      ...game,
      players: game.players.map(p => ({ ...p, selectedCard: null })),
      status: 'voting'
    };

    this._game.set(updated);
    this.saveToStorage(updated);
    this.broadcast(updated);
  }

  clearCurrentPlayer(): void {
    this._currentPlayerId.set(null);
    sessionStorage.removeItem(this.PLAYER_KEY);
  }
}