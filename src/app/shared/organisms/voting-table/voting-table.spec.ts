import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VotingTableComponent } from './voting-table';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { Player } from '../../../core/models/game.model';

describe('VotingTableComponent', () => {
  let component: VotingTableComponent;
  let fixture: ComponentFixture<VotingTableComponent>;
  let componentRef: ComponentRef<VotingTableComponent>;

  const mockPlayers: Player[] = [
    { id: 'p1', name: 'Luisa', role: 'admin', mode: 'player', selectedCard: null },
    { id: 'p2', name: 'Oscar', role: 'player', mode: 'player', selectedCard: null },
    { id: 'p3', name: 'Vale', role: 'player', mode: 'spectator', selectedCard: null },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VotingTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all players', () => {
    componentRef.setInput('players', mockPlayers);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('app-player-card'));
    expect(cards.length).toBe(3);
  });

  it('should render empty state when no players', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-player-card'));
    expect(cards.length).toBe(0);
  });

  it('should calculate correct style for first player (top center)', () => {
    const style = component.getPlayerStyle(0, 4);
    expect(style['position']).toBe('absolute');
    expect(style['transform']).toBe('translate(-50%, -50%)');
    const top = parseFloat(style['top']);
    expect(top).toBeCloseTo(172 - 190, 0);
  });

  it('should apply ngStyle to each player container', () => {
    componentRef.setInput('players', mockPlayers);
    fixture.detectChanges();
    const playerDivs = fixture.debugElement.queryAll(By.css('.voting-table__player'));
    expect(playerDivs.length).toBe(3);
    playerDivs.forEach(div => {
      const style = div.nativeElement.style;
      expect(style.position).toBe('absolute');
    });
  });

  it('should render three table layers', () => {
    const outer = fixture.debugElement.query(By.css('.voting-table__outer'));
    const middle = fixture.debugElement.query(By.css('.voting-table__middle'));
    const inner = fixture.debugElement.query(By.css('.voting-table__inner'));
    expect(outer).toBeTruthy();
    expect(middle).toBeTruthy();
    expect(inner).toBeTruthy();
  });
});