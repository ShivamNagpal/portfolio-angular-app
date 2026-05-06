import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { FeaturedCardsComponent } from './featured-cards.component';
import { routes } from '../../../app-routing.module';
import {
  PROJECT_FIXTURES,
  BLOG_FIXTURES,
  STUB_DATA_SERVICE,
} from '../../../data/test-fixtures';
import { DataService } from '../../../shared/services/data.service';

describe('FeaturedCardsComponent', () => {
  let component: FeaturedCardsComponent;
  let fixture: ComponentFixture<FeaturedCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), FeaturedCardsComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 cards', () => {
    const cards = fixture.nativeElement.querySelectorAll(
      '.grid > a, .grid > div',
    );
    expect(cards.length).toBe(3);
  });

  it('should show featured project title', () => {
    const featuredProject = PROJECT_FIXTURES.find((p) => p.featured);
    if (featuredProject) {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain(featuredProject.title);
    }
  });

  it('should show latest video thumbnail', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('img.youtube.com');
  });

  it('should show the latest blog title from fixtures', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain(BLOG_FIXTURES[0].title);
  });
});
