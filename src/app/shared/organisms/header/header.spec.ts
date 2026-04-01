import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let componentRef: ComponentRef<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render game name centered when inline is false', () => {
    componentRef.setInput('gameName', 'Sprint 32');
    componentRef.setInput('inline', false);
    fixture.detectChanges();
    const title = fixture.debugElement.query(
      By.css('.header__game-name:not(.header__game-name--inline)')
    );
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Sprint 32');
  });

  it('should not render centered title when gameName is empty', () => {
    componentRef.setInput('inline', false);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.header__game-name'));
    expect(title).toBeNull();
  });

  it('should render game name inline when inline is true', () => {
    componentRef.setInput('gameName', 'Crear partida');
    componentRef.setInput('inline', true);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.header__game-name--inline'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Crear partida');
  });

  it('should not render inline title when gameName is empty', () => {
    componentRef.setInput('inline', true);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.header__game-name--inline'));
    expect(title).toBeNull();
  });

  it('should render avatar when userName is provided', () => {
    componentRef.setInput('userName', 'Luisa');
    fixture.detectChanges();
    const avatar = fixture.debugElement.query(By.css('app-avatar'));
    expect(avatar).toBeTruthy();
  });

  it('should not render actions when userName is empty', () => {
    const actions = fixture.debugElement.query(By.css('.header__actions'));
    expect(actions).toBeNull();
  });

  it('should render invite button when user is logged in', () => {
    componentRef.setInput('userName', 'Luisa');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button).toBeTruthy();
  });

  it('should emit inviteClick when invite button is clicked', () => {
    componentRef.setInput('userName', 'Luisa');
    fixture.detectChanges();
    let emitted = false;
    component.inviteClick.subscribe(() => emitted = true);
    const button = fixture.debugElement.query(By.css('app-button'));
    button.triggerEventHandler('click', null);
    expect(emitted).toBe(true);
  });

  describe('mode menu', () => {
    beforeEach(() => {
      componentRef.setInput('userName', 'Luisa');
      componentRef.setInput('currentMode', 'player');
      fixture.detectChanges();
    });

    it('should not show mode menu by default', () => {
      const menu = fixture.debugElement.query(By.css('.header__mode-menu'));
      expect(menu).toBeNull();
    });

    it('should show mode menu when avatar is clicked', () => {
      const trigger = fixture.debugElement.query(By.css('.header__avatar-trigger'));
      trigger.triggerEventHandler('click', null);
      fixture.detectChanges();
      const menu = fixture.debugElement.query(By.css('.header__mode-menu'));
      expect(menu).toBeTruthy();
    });

    it('should toggle mode menu on consecutive avatar clicks', () => {
      const trigger = fixture.debugElement.query(By.css('.header__avatar-trigger'));
      trigger.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.showModeMenu()).toBe(true);

      trigger.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.showModeMenu()).toBe(false);
    });

    it('should close menu when backdrop is clicked', () => {
      component.showModeMenu.set(true);
      fixture.detectChanges();
      const backdrop = fixture.debugElement.query(By.css('.header__backdrop'));
      backdrop.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.showModeMenu()).toBe(false);
    });

    it('should emit modeChange and close menu when option is selected', () => {
      component.showModeMenu.set(true);
      fixture.detectChanges();
      let emitted: string | null = null;
      component.modeChange.subscribe(v => emitted = v);
      component.onModeSelect('spectator');
      expect(emitted).toBe('spectator');
      expect(component.showModeMenu()).toBe(false);
    });

    it('should mark active option based on currentMode', () => {
      componentRef.setInput('currentMode', 'spectator');
      component.showModeMenu.set(true);
      fixture.detectChanges();
      const options = fixture.debugElement.queryAll(By.css('.header__mode-option--active'));
      expect(options.length).toBe(1);
    });
  });
});