import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DataService } from './data.service';
import { Manifest } from '../../data/interfaces';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch the blogs manifest from /assets/data/blogs/index.json', () => {
    const manifest: Manifest = {
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      keys: ['welcome'],
    };
    service.blogsManifest$.subscribe((m) => expect(m).toEqual(manifest));
    const req = httpMock.expectOne('/assets/data/blogs/index.json');
    expect(req.request.method).toBe('GET');
    req.flush(manifest);
  });

  it('should fetch a blogs page on demand and memoise per page', () => {
    service.getBlogsPage(1).subscribe();
    service.getBlogsPage(1).subscribe();
    const reqs = httpMock.match('/assets/data/blogs/page-1.json');
    expect(reqs.length).toBe(1);
    reqs[0].flush([]);
  });

  it('should fetch separate URLs for different pages', () => {
    service.getBlogsPage(1).subscribe();
    service.getBlogsPage(2).subscribe();
    httpMock.expectOne('/assets/data/blogs/page-1.json').flush([]);
    httpMock.expectOne('/assets/data/blogs/page-2.json').flush([]);
  });

  it('should resolve findBlogBySlug to the right page', () => {
    let result: unknown;
    service.findBlogBySlug('welcome').subscribe((r) => (result = r));

    httpMock.expectOne('/assets/data/blogs/index.json').flush({
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      keys: ['welcome'],
    } satisfies Manifest);
    httpMock
      .expectOne('/assets/data/blogs/page-1.json')
      .flush([{ slug: 'welcome', title: 'W', summary: 's', author: 'A' }]);

    expect((result as { slug: string }).slug).toBe('welcome');
  });

  it('should return null from findBlogBySlug when slug is not in manifest', () => {
    let result: unknown = 'unset';
    service.findBlogBySlug('nope').subscribe((r) => (result = r));

    httpMock.expectOne('/assets/data/blogs/index.json').flush({
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      keys: ['welcome'],
    } satisfies Manifest);

    expect(result).toBeNull();
  });

  it('should compute the correct page number from manifest keys', () => {
    let result: { slug: string } | null = null;
    service
      .findBlogBySlug('eleventh')
      .subscribe((r) => (result = r as { slug: string } | null));

    const keys = Array.from({ length: 15 }, (_, i) => `slug-${i}`);
    keys[10] = 'eleventh';
    httpMock.expectOne('/assets/data/blogs/index.json').flush({
      pageSize: 10,
      totalItems: 15,
      totalPages: 2,
      keys,
    } satisfies Manifest);
    // 11th key (index 10) → page 2
    httpMock
      .expectOne('/assets/data/blogs/page-2.json')
      .flush([{ slug: 'eleventh', title: 'E', summary: 's', author: 'A' }]);

    expect(result!.slug).toBe('eleventh');
  });

  it('should fetch flat data types from their direct JSON URLs', () => {
    service.companies$.subscribe();
    service.talks$.subscribe();
    service.skills$.subscribe();
    service.socialLinks$.subscribe();

    httpMock.expectOne('/assets/data/companies.json').flush([]);
    httpMock.expectOne('/assets/data/talks.json').flush([]);
    httpMock.expectOne('/assets/data/skills.json').flush([]);
    httpMock.expectOne('/assets/data/social-links.json').flush([]);
  });
});
