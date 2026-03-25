import { Component, input } from '@angular/core';
import { Player } from '../../../core/models/game.model';
import { PlayerCardComponent } from '../../molecules/player-card/player-card';

const MAX_PLAYERS = 8;
const ELLIPSE_RATIO = 345 / 603;

@Component({
  selector: 'app-voting-table',
  standalone: true,
  imports: [PlayerCardComponent],
  templateUrl: './voting-table.html',
  styleUrl: './voting-table.css'
})
export class VotingTableComponent {
  readonly players = input<Player[]>([]);
  readonly currentUserId = input<string>('');

  getAngle(index: number, total: number): number {
    if (total === 0) return 0;

    const capped = Math.min(total, MAX_PLAYERS);
    const step = (2 * Math.PI) / capped;

    const raw = Math.PI / 2 + step * index;

    return Math.atan2(
      Math.sin(raw) / ELLIPSE_RATIO,
      Math.cos(raw)
    );
  }
}