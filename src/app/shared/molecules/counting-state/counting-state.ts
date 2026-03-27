import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-counting-state',
  standalone: true,
  templateUrl: './counting-state.html',
  styleUrl: './counting-state.css'
})
export class CountingStateComponent {
  readonly isAdmin = input<boolean>(false);
  readonly allVoted = input<boolean>(false);
  readonly revealCards = output<void>();

  readonly showRevealBtn = computed(() => this.isAdmin() && this.allVoted());

  onReveal(): void {
    this.revealCards.emit();
  }
}