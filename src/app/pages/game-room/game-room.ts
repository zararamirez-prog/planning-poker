import { Component, computed, inject, signal } from '@angular/core';
import { GameLayoutComponent } from '../../shared/templates/game-layout/game-layout';
import { HeaderComponent } from '../../shared/organisms/header/header';
import { VotingTableComponent } from '../../shared/organisms/voting-table/voting-table';
import { CardPoolComponent } from '../../shared/organisms/card-pool/card-pool';
import { InviteLinkComponent } from '../../shared/molecules/invite-link/invite-link';
import { UserFormComponent } from '../../shared/organisms/user-form/user-form';
import { GameStore } from '../../core/store/game.store';
import { Card } from '../../core/models/game.model';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [
    GameLayoutComponent,
    HeaderComponent,
    VotingTableComponent,
    CardPoolComponent,
    InviteLinkComponent,
    UserFormComponent
  ],
  templateUrl: './game-room.html',
  styleUrl: './game-room.css'
})
export class GameRoomComponent {
  private gameStore = inject(GameStore);

  readonly showInviteModal = signal(false);
  
  readonly gameName = this.gameStore.gameName;
  readonly players = this.gameStore.players;
  readonly inviteLink = this.gameStore.inviteLink;
  readonly currentPlayer = this.gameStore.currentPlayer;
  readonly currentUserHasVoted = this.gameStore.currentUserHasVoted;
  readonly currentUserCanVote = this.gameStore.currentUserCanVote;
  readonly availableCards = this.gameStore.getAvailableCards();
  
  readonly currentUserId = computed(() => this.currentPlayer()?.id ?? '');
  readonly showUserForm = computed(() => !this.currentPlayer());
  
  readonly selectedCardId = computed(() => {
    const player = this.currentPlayer();
    return player?.selectedCard?.id ?? null;
  });
  
  readonly showCardPool = computed(() => {
    const player = this.currentPlayer();
    return player?.mode === 'player' 
      && !this.currentUserHasVoted()
      && this.gameStore.status() === 'voting';
  });

  onUserCreated(data: { name: string; mode: 'player' | 'spectator' }): void {
    this.gameStore.addAdminPlayer(data.name, data.mode);
  }

  onCardSelected(card: Card): void {
    const userId = this.currentUserId();
    if (userId && this.currentUserCanVote()) {
      this.gameStore.updatePlayerVote(userId, card);
    }
  }

  onInviteClick(): void {
    this.showInviteModal.set(true);
  }

  onCloseInvite(): void {
    this.showInviteModal.set(false);
  }
}