import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-featured-cards',
  standalone: true,
  imports: [NgOptimizedImage, MatIcon, RouterLink],
  templateUrl: './featured-cards.component.html',
  styleUrl: './featured-cards.component.scss',
})
export class FeaturedCardsComponent {
  private data = inject(DataService);

  featuredProject = toSignal(
    this.data
      .getProjectsPage(1)
      .pipe(map((p) => p.find((x) => x.featured) ?? null)),
    { initialValue: null },
  );

  latestVideo = toSignal(
    this.data.getVideosPage(1).pipe(map((v) => (v.length > 0 ? v[0] : null))),
    { initialValue: null },
  );

  // Drafts are already excluded by the build-data-pages script.
  latestBlog = toSignal(
    this.data.getBlogsPage(1).pipe(map((b) => (b.length > 0 ? b[0] : null))),
    { initialValue: null },
  );
}
