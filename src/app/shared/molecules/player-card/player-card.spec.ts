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

  it('should render avatar when isCurrentUser is true', () => {
    componentRef.setInput('isCurrentUser', true);
    componentRef.setInput('playerName', 'Luisa');
    fixture.detectChanges();
    const avatar = fixture.debugElement.query(By.css('app-avatar'));
    expect(avatar).toBeTruthy();
  });

  it('should not render avatar when isCurrentUser is false', () => {
    const avatar = fixture.debugElement.query(By.css('app-avatar'));
    expect(avatar).toBeNull();
  });

  it('should pass cardState to card component', () => {
    componentRef.setInput('cardState', 'selected');
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card).toBeTruthy();
  });

  it('should pass isSpectator to card component', () => {
    componentRef.setInput('isSpectator', true);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-card'));
    expect(card).toBeTruthy();
  });
});