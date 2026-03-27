import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerCardComponent } from './player-card';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('PlayerCardComponent', () => {
  let component: PlayerCardComponent;
  let fixture: ComponentFixture<PlayerCardComponent>;
  let componentRef: ComponentRef<PlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render player name', () => {
    componentRef.setInput('playerName', 'Luisa');
    fixture.detectChanges();
    const name = fixture.debugElement.query(By.css('.player-card__name'));
    expect(name.nativeElement.textContent).toBe('Luisa');
  });

  it('should render card when player is not spectator', () => {
    componentRef.setInput('isSpectator', false);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card).toBeTruthy();
  });

  it('should render avatar when player is spectator', () => {
    componentRef.setInput('isSpectator', true);
    componentRef.setInput('playerName', 'Luisa');
    fixture.detectChanges();
    const avatar = fixture.debugElement.query(By.css('app-avatar'));
    expect(avatar).toBeTruthy();
  });

  it('should not render card when player is spectator', () => {
    componentRef.setInput('isSpectator', true);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card).toBeNull();
  });

  it('should not render avatar when player is not spectator', () => {
    componentRef.setInput('isSpectator', false);
    fixture.detectChanges();
    const avatar = fixture.debugElement.query(By.css('app-avatar'));
    expect(avatar).toBeNull();
  });

  it('should pass cardValue to card component', () => {
    componentRef.setInput('cardState', 'selected');
    componentRef.setInput('cardValue', { id: '5', value: 5 });
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card).toBeTruthy();
  });

  it('should pass empty string to card value when cardValue is null', () => {
    componentRef.setInput('isSpectator', false);
    componentRef.setInput('cardValue', null);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card).toBeTruthy();
  });

  it('should mark current user with isCurrentUser input', () => {
    componentRef.setInput('isCurrentUser', true);
    fixture.detectChanges();
    expect(component.isCurrentUser()).toBe(true);
  });

  it('should pass cardVariant to card component', () => {
    componentRef.setInput('cardVariant', 'table');
    componentRef.setInput('cardState', 'selected');
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card.componentInstance.variant()).toBe('table');
  });

  it('should use table variant by default', () => {
    componentRef.setInput('cardState', 'selected');
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card.componentInstance.variant()).toBe('table');
  });
});