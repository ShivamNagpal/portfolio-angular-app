import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { CodeComponent } from './code.component';
import { PROJECT_FIXTURES, STUB_DATA_SERVICE } from '../data/test-fixtures';
import { DataService } from '../shared/services/data.service';
import { routes } from '../app-routing.module';

describe('CodeComponent', () => {
  let component: CodeComponent;
  let fixture: ComponentFixture<CodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), CodeComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to page 1', () => {
    expect(component.currentPage()).toBe(1);
  });

  it('should render a card for each project on the current page', () => {
    const cards = fixture.nativeElement.querySelectorAll('.grid > div');
    expect(cards.length).toBe(PROJECT_FIXTURES.length);
  });

  it('should show project title and summary', () => {
    const text = fixture.nativeElement.textContent;
    const first = PROJECT_FIXTURES[0];
    expect(text).toContain(first.title);
    expect(text).toContain(first.summary);
  });

  it('should render the role badge', () => {
    const text = fixture.nativeElement.textContent;
    const first = PROJECT_FIXTURES[0];
    expect(text).toContain(first.role === 'author' ? 'Author' : 'Contributor');
  });

  it('should render tag chips from project.tags', () => {
    const text = fixture.nativeElement.textContent;
    const first = PROJECT_FIXTURES[0];
    first.tags.forEach((tag) => expect(text).toContain(tag));
  });

  it('should render GitHub link when repoUrl is set', () => {
    const first = PROJECT_FIXTURES[0];
    if (first.repoUrl) {
      const anchors: HTMLAnchorElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('a[target="_blank"]'),
      );
      const match = anchors.find((a) => a.href === first.repoUrl);
      expect(match).toBeTruthy();
    }
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

  it('should filter projects when tags are selected', () => {
    if (component.allTags().length === 0) return;
    const tag = component.allTags()[0];
    component.onSelectedTagsChange([tag]);
    fixture.detectChanges();

    const expected = PROJECT_FIXTURES.filter((p) =>
      p.tags?.includes(tag),
    ).length;
    const cards = fixture.nativeElement.querySelectorAll('.grid > div');
    expect(cards.length).toBe(expected);
  });
});
