import { Component, input, computed } from '@angular/core';
import { CardComponent, CardState } from '../../atoms/card/card';
import { AvatarComponent } from '../../atoms/avatar/avatar';
import { Card } from '../../../core/models/game.model';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CardComponent, AvatarComponent],
  templateUrl: './player-card.html',
  styleUrl: './player-card.css'
})
export class PlayerCardComponent {
  readonly playerName = input<string>('');
  readonly cardState = input<CardState>('empty');
  readonly cardValue = input<Card | null>(null);
  readonly isSpectator = input<boolean>(false);
  readonly isCurrentUser = input<boolean>(false);
}