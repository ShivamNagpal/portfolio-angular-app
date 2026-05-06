import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { TagFilterComponent } from '../shared/components/tag-filter/tag-filter.component';
import { DataService } from '../shared/services/data.service';
import { filterAndSortByTags, uniqueTags } from '../shared/utils/tag-filter';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [NgOptimizedImage, DatePipe, RouterLink, TagFilterComponent],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss',
})
export class BlogsComponent {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  manifest = toSignal(this.data.blogsManifest$, { initialValue: null });

  currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => Math.max(1, Number(p.get('page')) || 1)),
    ),
    { initialValue: 1 },
  );

  posts = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => Math.max(1, Number(p.get('page')) || 1)),
      switchMap((page) => this.data.getBlogsPage(page)),
    ),
    { initialValue: [] },
  );

  allTags = computed(() => uniqueTags(this.posts()));
  selectedTags = signal<string[]>([]);

  filteredPosts = computed(() =>
    filterAndSortByTags(this.posts(), this.selectedTags()),
  );

  pageNumbers = computed(() => {
    const total = this.manifest()?.totalPages ?? 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  onSelectedTagsChange(tags: string[]) {
    this.selectedTags.set(tags);
  }

  goToPage(page: number) {
    if (page < 1) return;
    const total = this.manifest()?.totalPages ?? 1;
    if (page > total) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: page === 1 ? {} : { page },
      queryParamsHandling: 'merge',
    });
  }
}
