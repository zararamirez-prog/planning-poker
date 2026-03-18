import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let componentRef: ComponentRef<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render two initials from a full name', () => {
    componentRef.setInput('name', 'Luisa Uribe');
    fixture.detectChanges();
    const initials = fixture.debugElement.query(By.css('.avatar__initials'));
    expect(initials.nativeElement.textContent).toBe('LU');
  });

  it('should render first two characters when name has one word', () => {
    componentRef.setInput('name', 'Luisa');
    fixture.detectChanges();
    const initials = fixture.debugElement.query(By.css('.avatar__initials'));
    expect(initials.nativeElement.textContent).toBe('LU');
  });

  it('should render initials in uppercase', () => {
    componentRef.setInput('name', 'luisa uribe');
    fixture.detectChanges();
    const initials = fixture.debugElement.query(By.css('.avatar__initials'));
    expect(initials.nativeElement.textContent).toBe('LU');
  });

  it('should apply md size class by default', () => {
    const avatar = fixture.debugElement.query(By.css('.avatar'));
    expect(avatar.nativeElement.classList).toContain('avatar--md');
  });

  it('should apply correct size class', () => {
    componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const avatar = fixture.debugElement.query(By.css('.avatar'));
    expect(avatar.nativeElement.classList).toContain('avatar--lg');
  });
});