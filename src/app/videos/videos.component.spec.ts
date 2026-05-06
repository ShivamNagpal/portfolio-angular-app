import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { VideosComponent } from './videos.component';
import { VIDEO_FIXTURES, STUB_DATA_SERVICE } from '../data/test-fixtures';
import { DataService } from '../shared/services/data.service';
import { routes } from '../app-routing.module';

describe('VideosComponent', () => {
  let component: VideosComponent;
  let fixture: ComponentFixture<VideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), VideosComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }).compileComponents();

    fixture = TestBed.createComponent(VideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to page 1', () => {
    expect(component.currentPage()).toBe(1);
  });

  it('should render a card for each video on the current page', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-video-card');
    expect(cards.length).toBe(VIDEO_FIXTURES.length);
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

  it('should filter videos when tags are selected', () => {
    const tag = component.allTags()[0];
    component.onSelectedTagsChange([tag]);
    fixture.detectChanges();

    const expected = VIDEO_FIXTURES.filter((v) => v.tags?.includes(tag)).length;
    const cards = fixture.nativeElement.querySelectorAll('app-video-card');
    expect(cards.length).toBe(expected);
  });
});
