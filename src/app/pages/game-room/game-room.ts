import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/organisms/header/header';
import { CardComponent } from '../../shared/atoms/card/card';
import { UserFormComponent } from '../../shared/organisms/user-form/user-form';
import { GameStore } from '../../core/store/game.store';
import { DEFAULT_CARDS } from '../../core/utils/game.utils';
import { PlayerMode } from '../../core/models/game.model';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [HeaderComponent, CardComponent, UserFormComponent],
  templateUrl: './game-room.html',
  styleUrl: './game-room.css'
})
export class GameRoomComponent {
  readonly cards = DEFAULT_CARDS;
  readonly showInviteModal = signal(false);

  readonly currentUser = computed(() =>
    this.gameStore.players().find(p => p.role === 'admin') ?? null
  );

  readonly showUserForm = computed(() => !this.currentUser());
  readonly currentUserId = computed(() => this.currentUser()?.id ?? '');
  readonly gameName = computed(() => this.gameStore.gameName());
  readonly players = computed(() => this.gameStore.players());
  readonly inviteLink = computed(() => this.gameStore.inviteLink());

  constructor(
    private readonly router: Router,
    private readonly gameStore: GameStore
  ) {}

  onUserCreated(data: { name: string; mode: PlayerMode }): void {
    this.gameStore.addAdminPlayer(data.name, data.mode);
  }

  onInviteClick(): void {
    this.showInviteModal.set(true);
  }

  onCloseInvite(): void {
    this.showInviteModal.set(false);
  }
}