import { Component, input, computed } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.html',
  styleUrl: './avatar.css'
})
export class AvatarComponent {
  readonly name = input<string>('');
  readonly size = input<AvatarSize>('md');

  readonly initials = computed(() => {
    const words = this.name().trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return this.name().substring(0, 2).toUpperCase();
  });

  readonly classes = computed(() => [
    'avatar',
    `avatar--${this.size()}`
  ].join(' '));
}