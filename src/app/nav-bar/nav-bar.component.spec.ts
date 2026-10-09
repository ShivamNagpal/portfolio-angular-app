import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app-routing.module';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), NavBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens and closes the mobile menu when clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Open menu"]',
    );

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Close menu');
    expect(fixture.nativeElement.querySelector('ul').classList).toContain(
      'flex',
    );

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Open menu');
    expect(fixture.nativeElement.querySelector('ul').classList).toContain(
      'hidden',
    );
  });
});
