import { Component, input, computed } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly type = input<'button' | 'submit'>('button');

  readonly classes = computed(() => [
    'btn',
    `btn--${this.variant()}`,
    `btn--${this.size()}`,
    this.fullWidth() ? 'btn--full-width' : '',
    this.disabled() ? 'btn--disabled' : ''
  ].filter(Boolean).join(' '));
}