import { Component, input, output, computed } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button';

@Component({
  selector: 'app-counting-state',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './counting-state.html',
  styleUrl: './counting-state.css'
})
export class CountingStateComponent {
  readonly isAdmin = input<boolean>(false);
  readonly allVoted = input<boolean>(false);
  readonly revealCards = output<void>();

  readonly phase = computed(() => this.allVoted() ? 'ready' : 'counting');

  readonly showRevealBtn = computed(() => this.isAdmin() && this.allVoted());

  onReveal(): void {
    this.revealCards.emit();
  }
}