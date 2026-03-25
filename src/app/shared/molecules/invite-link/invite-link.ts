import { Component, input, signal } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button';

@Component({
  selector: 'app-invite-link',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './invite-link.html',
  styleUrl: './invite-link.css'
})
export class InviteLinkComponent {
  readonly link = input<string>('');

  readonly copied = signal(false);

  copyLink(): void {
    navigator.clipboard.writeText(this.link()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}