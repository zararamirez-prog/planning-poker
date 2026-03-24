import { Component, input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Player } from '../../../core/models/game.model';
import { PlayerCardComponent } from '../../molecules/player-card/player-card';

@Component({
  selector: 'app-voting-table',
  standalone: true,
  imports: [PlayerCardComponent, NgStyle],
  templateUrl: './voting-table.html',
  styleUrl: './voting-table.css'
})
export class VotingTableComponent implements AfterViewInit, OnDestroy {
  readonly players = input<Player[]>([]);
  readonly currentUserId = input<string>('');

  private resizeObserver: ResizeObserver | null = null;
  private centerX = 0;
  private centerY = 0;
  private tableRX = 0;
  private tableRY = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.updateTableDimensions();
    this.resizeObserver = new ResizeObserver(() => this.updateTableDimensions());
    const tableOuter = this.el.nativeElement.querySelector('.voting-table__outer');
    if (tableOuter) {
      this.resizeObserver.observe(tableOuter);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private updateTableDimensions(): void {
    const tableOuter = this.el.nativeElement.querySelector('.voting-table__outer');
    if (tableOuter) {
      const rect = tableOuter.getBoundingClientRect();
      const containerRect = this.el.nativeElement.getBoundingClientRect();
      
      this.centerX = rect.left + rect.width / 2 - containerRect.left;
      this.centerY = rect.top + rect.height / 2 - containerRect.top;

      this.tableRX = rect.width / 2 + 20; 
      this.tableRY = rect.height / 2 + 20;
    }
  }

  getPlayerStyle(index: number, total: number): { [key: string]: string } {
    if (total === 0) return {};
    
    this.updateTableDimensions();
    
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    const top = this.centerY + this.tableRY * Math.sin(angle);
    const left = this.centerX + this.tableRX * Math.cos(angle);
    
    return {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      transform: 'translate(-50%, -50%)'
    };
  }
}