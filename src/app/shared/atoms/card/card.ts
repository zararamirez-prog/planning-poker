import { Component, input, computed } from '@angular/core';

export type CardState = 'empty' | 'selected' | 'revealed';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class CardComponent {
  readonly state = input<CardState>('empty');
  readonly value = input<string | number>('');
  readonly isSpectator = input<boolean>(false);
  readonly isSelectable = input<boolean>(false);
  readonly isActive = input<boolean>(false);

  readonly classes = computed(() => [
    'card',
    `card--${this.state()}`,
    this.isSpectator() ? 'card--spectator' : '',
    this.isSelectable() ? 'card--selectable' : '',
    this.isActive() ? 'card--active' : ''
  ].filter(Boolean).join(' '));

  readonly showValue = computed(() =>
    this.state() !== 'empty' && !this.isSpectator()
  );
}