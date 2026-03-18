import { Component, input, output } from '@angular/core';
import { AvatarComponent } from '../../atoms/avatar/avatar';
import { ButtonComponent } from '../../atoms/button/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarComponent, ButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  readonly gameName = input<string>('');
  readonly userName = input<string>('');

  readonly inviteClick = output<void>();

  onInviteClick(): void {
    this.inviteClick.emit();
  }
}