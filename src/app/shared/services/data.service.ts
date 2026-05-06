import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import {
  BlogPost,
  Company,
  Manifest,
  Project,
  SkillGroup,
  SocialLink,
  Talk,
  VideoItem,
} from '../../data/interfaces';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  // Flat-array data types (small, capped — fetched once, cached forever)
  readonly companies$: Observable<Company[]> = this.fetchOnce<Company[]>(
    '/assets/data/companies.json',
  );
  readonly talks$: Observable<Talk[]> = this.fetchOnce<Talk[]>(
    '/assets/data/talks.json',
  );
  readonly skills$: Observable<SkillGroup[]> = this.fetchOnce<SkillGroup[]>(
    '/assets/data/skills.json',
  );
  readonly socialLinks$: Observable<SocialLink[]> = this.fetchOnce<
    SocialLink[]
  >('/assets/data/social-links.json');

  // Paginated data types: manifest + per-page fetches
  readonly blogsManifest$ = this.fetchOnce<Manifest>(
    '/assets/data/blogs/index.json',
  );
  readonly videosManifest$ = this.fetchOnce<Manifest>(
    '/assets/data/videos/index.json',
  );
  readonly projectsManifest$ = this.fetchOnce<Manifest>(
    '/assets/data/projects/index.json',
  );

  private blogPages = new Map<number, Observable<BlogPost[]>>();
  private videoPages = new Map<number, Observable<VideoItem[]>>();
  private projectPages = new Map<number, Observable<Project[]>>();

  getBlogsPage(page: number): Observable<BlogPost[]> {
    return this.getPage(this.blogPages, 'blogs', page);
  }

  getVideosPage(page: number): Observable<VideoItem[]> {
    return this.getPage(this.videoPages, 'videos', page);
  }

  getProjectsPage(page: number): Observable<Project[]> {
    return this.getPage(this.projectPages, 'projects', page);
  }

  /**
   * Resolves a blog post by slug. Uses the manifest's `keys` index to figure
   * out which page contains the slug, fetches just that page, and returns the
   * matching post (or null when not found).
   */
  findBlogBySlug(slug: string): Observable<BlogPost | null> {
    return this.blogsManifest$.pipe(
      switchMap((manifest) => {
        const idx = manifest.keys.indexOf(slug);
        if (idx === -1) return of(null);
        const page = Math.floor(idx / manifest.pageSize) + 1;
        return this.getBlogsPage(page).pipe(
          map((posts) => posts.find((p) => p.slug === slug) ?? null),
        );
      }),
    );
  }

  private getPage<T>(
    cache: Map<number, Observable<T[]>>,
    type: 'blogs' | 'videos' | 'projects',
    page: number,
  ): Observable<T[]> {
    if (!cache.has(page)) {
      cache.set(
        page,
        this.fetchOnce<T[]>(`/assets/data/${type}/page-${page}.json`),
      );
    }
    return cache.get(page)!;
  }

  private fetchOnce<T>(url: string): Observable<T> {
    return this.http
      .get<T>(url)
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  }
}
