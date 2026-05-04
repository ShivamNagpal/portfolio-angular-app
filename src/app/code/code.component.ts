import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { TagFilterComponent } from '../shared/components/tag-filter/tag-filter.component';
import { DataService } from '../shared/services/data.service';
import { filterAndSortByTags, uniqueTags } from '../shared/utils/tag-filter';

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [MatIcon, TagFilterComponent],
  templateUrl: './code.component.html',
  styleUrl: './code.component.scss',
})
export class CodeComponent {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  manifest = toSignal(this.data.projectsManifest$, { initialValue: null });

  currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => Math.max(1, Number(p.get('page')) || 1)),
    ),
    { initialValue: 1 },
  );

  projects = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => Math.max(1, Number(p.get('page')) || 1)),
      switchMap((page) => this.data.getProjectsPage(page)),
    ),
    { initialValue: [] },
  );

  allTags = computed(() => uniqueTags(this.projects()));
  selectedTags = signal<string[]>([]);

  filteredProjects = computed(() =>
    filterAndSortByTags(this.projects(), this.selectedTags()),
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
