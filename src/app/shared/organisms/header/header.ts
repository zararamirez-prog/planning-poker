import { Component, input, output, signal } from '@angular/core';
import { AvatarComponent } from '../../atoms/avatar/avatar';
import { ButtonComponent } from '../../atoms/button/button';
import { PlayerMode } from '../../../core/models/game.model';

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
  readonly inline = input<boolean>(false);
  readonly isAdmin = input<boolean>(false);
  readonly currentMode = input<PlayerMode>('player');

  readonly inviteClick = output<void>();
  readonly modeChange = output<PlayerMode>();

  readonly showModeMenu = signal(false);

  onInviteClick(): void {
    this.inviteClick.emit();
  }

  onAvatarClick(): void {
    this.showModeMenu.update(v => !v);
  }

  onModeSelect(mode: PlayerMode): void {
    this.modeChange.emit(mode);
    this.showModeMenu.set(false);
  }

  onCloseMenu(): void {
    this.showModeMenu.set(false);
  }
}