import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { BlogPost } from '../../data/interfaces';
import { estimateReadingMinutes } from '../../shared/utils/reading-time';
import { SeoService } from '../../shared/services/seo.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [DatePipe, NgOptimizedImage, RouterLink, MatIcon, MarkdownModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private data = inject(DataService);
  private destroyRef = inject(DestroyRef);

  readonly slug: string = this.route.snapshot.paramMap.get('slug') ?? '';
  post = signal<BlogPost | null>(null);
  readingMinutes = signal<number | null>(null);

  ngOnInit(): void {
    this.data
      .findBlogBySlug(this.slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((found) => {
        this.post.set(found);
        if (found) {
          this.seo.setMeta({
            title: found.title,
            description: found.summary,
            url: `/blogs/${found.slug}`,
            type: 'article',
            ogImage: found.coverImage,
          });
          this.seo.setStructuredData({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: found.title,
            description: found.summary,
            datePublished: found.publishedDate,
            author: { '@type': 'Person', name: found.author },
            url: `https://shivamnagpal.dev/blogs/${found.slug}`,
          });
        } else {
          this.seo.setMeta({
            title: 'Post not found',
            description: 'The requested blog post could not be found.',
            url: `/blogs/${this.slug}`,
          });
          this.seo.setStructuredData(null);
        }
      });
  }

  onMarkdownLoaded(content: string) {
    this.readingMinutes.set(estimateReadingMinutes(content));
  }
}
