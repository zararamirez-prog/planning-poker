import { Component, input, output } from '@angular/core';

export interface RadioOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  templateUrl: './radio-group.html',
  styleUrl: './radio-group.css'
})
export class RadioGroupComponent {
  readonly options = input<RadioOption[]>([]);
  readonly selected = input<string>('');
  readonly name = input<string>('radio-group');

  readonly selectedChange = output<string>();

  onSelect(value: string): void {
    this.selectedChange.emit(value);
  }
}