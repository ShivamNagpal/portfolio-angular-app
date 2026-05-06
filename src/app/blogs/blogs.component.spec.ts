import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { BlogsComponent } from './blogs.component';
import { BLOG_FIXTURES, STUB_DATA_SERVICE } from '../data/test-fixtures';
import { DataService } from '../shared/services/data.service';
import { routes } from '../app-routing.module';

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  let fixture: ComponentFixture<BlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), BlogsComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to page 1', () => {
    expect(component.currentPage()).toBe(1);
  });

  it('should render a card for each post on the current page', () => {
    const cards = fixture.nativeElement.querySelectorAll('.grid > a');
    expect(cards.length).toBe(BLOG_FIXTURES.length);
  });

  it('should render the tag filter component', () => {
    const tagFilter = fixture.nativeElement.querySelector('app-tag-filter');
    expect(tagFilter).toBeTruthy();
  });

  it('should hide pagination UI when manifest has only 1 page', () => {
    const nav = fixture.nativeElement.querySelector(
      'nav[aria-label="Pagination"]',
    );
    expect(nav).toBeFalsy();
  });

  it('should filter posts on the current page only when tags are selected', () => {
    if (component.allTags().length === 0) return;
    const tag = component.allTags()[0];
    component.onSelectedTagsChange([tag]);
    fixture.detectChanges();

    const expected = component
      .posts()
      .filter((p) => p.tags?.includes(tag)).length;
    const cards = fixture.nativeElement.querySelectorAll('.grid > a');
    expect(cards.length).toBe(expected);
  });
});
