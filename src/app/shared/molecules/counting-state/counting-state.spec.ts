import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountingStateComponent } from './counting-state';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('CountingStateComponent', () => {
  let component: CountingStateComponent;
  let fixture: ComponentFixture<CountingStateComponent>;
  let componentRef: ComponentRef<CountingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountingStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CountingStateComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('counting phase (allVoted = false)', () => {
    beforeEach(() => {
      componentRef.setInput('allVoted', false);
      fixture.detectChanges();
    });

    it('should show the dots animation', () => {
      const dots = fixture.debugElement.query(By.css('.counting-state__dots'));
      expect(dots).toBeTruthy();
    });

    it('should show "Contando votos" label', () => {
      const label = fixture.debugElement.query(By.css('.counting-state__label'));
      expect(label.nativeElement.textContent).toContain('Contando votos');
    });

    it('should NOT show the reveal button', () => {
      const btn = fixture.debugElement.query(By.css('.counting-state__reveal-btn'));
      expect(btn).toBeNull();
    });

    it('should NOT show the check icon', () => {
      const check = fixture.debugElement.query(By.css('.counting-state__check'));
      expect(check).toBeNull();
    });
  });

  describe('ready phase (allVoted = true)', () => {
    beforeEach(() => {
      componentRef.setInput('allVoted', true);
      fixture.detectChanges();
    });

    it('should show the check icon', () => {
      const check = fixture.debugElement.query(By.css('.counting-state__check'));
      expect(check).toBeTruthy();
    });

    it('should show "¡Todos votaron!" label', () => {
      const label = fixture.debugElement.query(By.css('.counting-state__label'));
      expect(label.nativeElement.textContent).toContain('¡Todos votaron!');
    });

    it('should NOT show the dots animation', () => {
      const dots = fixture.debugElement.query(By.css('.counting-state__dots'));
      expect(dots).toBeNull();
    });

    it('should show the pulse ring', () => {
      const ring = fixture.debugElement.query(By.css('.counting-state__pulse-ring'));
      expect(ring).toBeTruthy();
    });
  });

  describe('admin behaviour', () => {
    beforeEach(() => {
      componentRef.setInput('allVoted', true);
      componentRef.setInput('isAdmin', true);
      fixture.detectChanges();
    });

    it('should show the reveal button when admin and all voted', () => {
      const btn = fixture.debugElement.query(By.css('.counting-state__reveal-btn'));
      expect(btn).toBeTruthy();
    });

    it('should NOT show the waiting label', () => {
      const waiting = fixture.debugElement.query(By.css('.counting-state__waiting-label'));
      expect(waiting).toBeNull();
    });
  });

  describe('non-admin behaviour', () => {
    beforeEach(() => {
      componentRef.setInput('allVoted', true);
      componentRef.setInput('isAdmin', false);
      fixture.detectChanges();
    });

    it('should NOT show the reveal button', () => {
      const btn = fixture.debugElement.query(By.css('.counting-state__reveal-btn'));
      expect(btn).toBeNull();
    });

    it('should show the waiting label', () => {
      const waiting = fixture.debugElement.query(By.css('.counting-state__waiting-label'));
      expect(waiting).toBeTruthy();
      expect(waiting.nativeElement.textContent).toContain('Esperando al administrador');
    });
  });

  describe('phase computed', () => {
    it('should return "counting" when allVoted is false', () => {
      componentRef.setInput('allVoted', false);
      fixture.detectChanges();
      expect(component.phase()).toBe('counting');
    });

    it('should return "ready" when allVoted is true', () => {
      componentRef.setInput('allVoted', true);
      fixture.detectChanges();
      expect(component.phase()).toBe('ready');
    });
  });
});