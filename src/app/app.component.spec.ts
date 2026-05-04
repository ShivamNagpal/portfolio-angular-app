import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DataService } from './shared/services/data.service';
import { STUB_DATA_SERVICE } from './data/test-fixtures';

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
});
