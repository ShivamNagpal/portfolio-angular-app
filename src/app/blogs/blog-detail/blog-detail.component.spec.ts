import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  RouterModule,
  convertToParamMap,
} from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withXhr } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { BlogDetailComponent } from './blog-detail.component';
import { BLOG_FIXTURES, STUB_DATA_SERVICE } from '../../data/test-fixtures';
import { DataService } from '../../shared/services/data.service';
import { routes } from '../../app-routing.module';

function configure(slug: string) {
  return TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes), BlogDetailComponent],
    providers: [
      provideHttpClient(withXhr()),
      provideHttpClientTesting(),
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
      const md = fixture.debugElement.query(By.directive(MarkdownComponent));
      expect(md).toBeTruthy();
      expect(md.componentInstance.src).toBe(`assets/blogs/${validSlug}.md`);
    });

    it('should compute reading time when markdown loads', () => {
      component.onMarkdownLoaded('one two three four five six');
      expect(component.readingMinutes()).toBe(1);
    });

    it('should fetch and render markdown using the page providers', async () => {
      const http = TestBed.inject(HttpTestingController);
      http
        .expectOne(`assets/blogs/${validSlug}.md`)
        .flush('# Blog heading\n\nMarkdown **body**.');

      await fixture.whenStable();
      fixture.detectChanges();

      const md: HTMLElement = fixture.nativeElement.querySelector('markdown');
      expect(md.querySelector('h1')?.textContent).toBe('Blog heading');
      expect(md.querySelector('strong')?.textContent).toBe('body');
      expect(component.readingMinutes()).toBe(1);
      http.verify();
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
