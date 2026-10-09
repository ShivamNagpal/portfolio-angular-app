import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DataService } from './shared/services/data.service';
import {
  COMPANY_FIXTURES,
  PROJECT_FIXTURES,
  STUB_DATA_SERVICE,
} from './data/test-fixtures';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), NavBarComponent, FooterComponent],
      declarations: [AppComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders lazy pages and updates navigation after route changes', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/code');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-code')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(
      PROJECT_FIXTURES[0].title,
    );
    expect(
      fixture.nativeElement.querySelector('a[href="/code"]').classList,
    ).toContain('active');

    await router.navigateByUrl('/about');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-about')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(
      COMPANY_FIXTURES[0].name,
    );
    expect(
      fixture.nativeElement.querySelector('a[href="/about"]').classList,
    ).toContain('active');
  });
});
