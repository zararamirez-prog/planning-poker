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

  it('should render game name when provided', () => {
    componentRef.setInput('gameName', 'Sprint 32');
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.header__title'));
    expect(title.nativeElement.textContent).toBe('Sprint 32');
  });

  it('should not render title when gameName is empty', () => {
    const title = fixture.debugElement.query(By.css('.header__title'));
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

  it('should emit inviteClick when button is clicked', () => {
    componentRef.setInput('userName', 'Luisa');
    fixture.detectChanges();
    let emitted = false;
    component.inviteClick.subscribe(() => emitted = true);
    const button = fixture.debugElement.query(By.css('app-button'));
    button.nativeElement.click();
    expect(emitted).toBe(true);
  });
});