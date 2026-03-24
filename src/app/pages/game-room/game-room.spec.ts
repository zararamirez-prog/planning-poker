import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameRoomComponent } from './game-room';
import { Router } from '@angular/router';
import { GameStore } from '../../core/store/game.store';
import { signal } from '@angular/core';
import { Player } from '../../core/models/game.model';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  const mockPlayers: Player[] = [
    { id: 'p1', name: 'Luisa', role: 'admin', mode: 'player', selectedCard: null },
    { id: 'p2', name: 'Oscar', role: 'player', mode: 'player', selectedCard: null },
  ];

  const mockGameStore = {
    players: signal(mockPlayers),
    gameName: signal('Sprint 32'),
    inviteLink: signal('https://planning-poker.com/game-001'),
    status: signal('voting'),
    addAdminPlayer: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRoomComponent],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: GameStore, useValue: mockGameStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current user as admin player', () => {
    expect(component.currentUser()?.name).toBe('Luisa');
  });

  it('should get game name from store', () => {
    expect(component.gameName()).toBe('Sprint 32');
  });

  it('should not show user form when admin player exists', () => {
    expect(component.showUserForm()).toBe(false);
  });

  it('should show user form when no admin player exists', () => {
    mockGameStore.players.set([]);
    fixture.detectChanges();
    expect(component.showUserForm()).toBe(true);
  });

  it('should show invite modal when onInviteClick is called', () => {
    component.onInviteClick();
    expect(component.showInviteModal()).toBe(true);
  });

  it('should hide invite modal when onCloseInvite is called', () => {
    component.onInviteClick();
    component.onCloseInvite();
    expect(component.showInviteModal()).toBe(false);
  });

  it('should call addAdminPlayer when onUserCreated is called', () => {
    component.onUserCreated({ name: 'Luisa', mode: 'player' });
    expect(mockGameStore.addAdminPlayer).toHaveBeenCalledWith('Luisa', 'player');
  });

  it('should render default cards in pool', () => {
    expect(component.cards.length).toBe(12);
  });
});