import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteLinkComponent } from './invite-link';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('InviteLinkComponent', () => {
  let component: InviteLinkComponent;
  let fixture: ComponentFixture<InviteLinkComponent>;
  let componentRef: ComponentRef<InviteLinkComponent>;
  let clipboardSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteLinkComponent]
    }).compileComponents();

    clipboardSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: clipboardSpy }
    });

    fixture = TestBed.createComponent(InviteLinkComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the link', () => {
    componentRef.setInput('link', 'https://planning-poker.com/abc123');
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('.invite-link__text'));
    expect(text.nativeElement.textContent).toBe('https://planning-poker.com/abc123');
  });

  it('should show "Copiar link" by default', () => {
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button.nativeElement.textContent.trim()).toBe('Copiar link');
  });

  it('should call clipboard writeText when copyLink is called', async () => {
    componentRef.setInput('link', 'https://planning-poker.com/abc123');
    fixture.detectChanges();
    await component.copyLink();
    expect(clipboardSpy).toHaveBeenCalledWith('https://planning-poker.com/abc123');
  });

  it('should show "¡Copiado!" after copying', async () => {
    componentRef.setInput('link', 'https://planning-poker.com/abc123');
    fixture.detectChanges();
    await component.copyLink();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button.nativeElement.textContent.trim()).toBe('¡Copiado!');
  });
});