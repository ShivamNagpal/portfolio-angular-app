import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  RouterModule,
  convertToParamMap,
} from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BlogDetailComponent } from './blog-detail.component';
import { BLOG_FIXTURES, STUB_DATA_SERVICE } from '../../data/test-fixtures';
import { DataService } from '../../shared/services/data.service';
import { routes } from '../../app-routing.module';

function configure(slug: string) {
  return TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes), BlogDetailComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideMarkdown(),
      { provide: DataService, useValue: STUB_DATA_SERVICE },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: convertToParamMap({ slug }) },
        },
      },
    ],
  }).compileComponents();
}

describe('BlogDetailComponent', () => {
  describe('with valid slug', () => {
    let component: BlogDetailComponent;
    let fixture: ComponentFixture<BlogDetailComponent>;
    const validSlug = BLOG_FIXTURES[0].slug;

    beforeEach(async () => {
      await configure(validSlug);
      fixture = TestBed.createComponent(BlogDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render the post title', () => {
      const post = BLOG_FIXTURES.find((b) => b.slug === validSlug);
      if (!post) return;
      expect(fixture.nativeElement.textContent).toContain(post.title);
    });

    it('should render the markdown directive with the correct src', () => {
      const md = fixture.nativeElement.querySelector('markdown');
      expect(md).toBeTruthy();
      expect(md.getAttribute('ng-reflect-src')).toContain(
        `assets/blogs/${validSlug}.md`,
      );
    });

    it('should compute reading time when markdown loads', () => {
      component.onMarkdownLoaded('one two three four five six');
      expect(component.readingMinutes()).toBe(1);
    });
  });

  describe('with invalid slug', () => {
    let fixture: ComponentFixture<BlogDetailComponent>;

    beforeEach(async () => {
      await configure('does-not-exist');
      fixture = TestBed.createComponent(BlogDetailComponent);
      fixture.detectChanges();
    });

    it('should render a not-found message', () => {
      expect(fixture.nativeElement.textContent).toContain('Post not found');
    });
  });
});
