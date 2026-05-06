import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { VideoCardComponent } from './components/video-card/video-card.component';
import { TagFilterComponent } from '../shared/components/tag-filter/tag-filter.component';
import { DataService } from '../shared/services/data.service';
import { filterAndSortByTags, uniqueTags } from '../shared/utils/tag-filter';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [VideoCardComponent, TagFilterComponent],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  manifest = toSignal(this.data.videosManifest$, { initialValue: null });

  currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => Math.max(1, Number(p.get('page')) || 1)),
    ),
    { initialValue: 1 },
  );

  videoItems = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => Math.max(1, Number(p.get('page')) || 1)),
      switchMap((page) => this.data.getVideosPage(page)),
    ),
    { initialValue: [] },
  );

  allTags = computed(() => uniqueTags(this.videoItems()));
  selectedTags = signal<string[]>([]);

  filteredVideos = computed(() =>
    filterAndSortByTags(this.videoItems(), this.selectedTags()),
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
