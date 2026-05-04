import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SeoService } from './shared/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.applyRouteSeo());
  }

  private applyRouteSeo(): void {
    let route = this.activatedRoute;
    while (route.firstChild) route = route.firstChild;

    const data = route.snapshot.data;
    if (!data['title']) {
      // Dynamic route: the component handles its own SEO
      return;
    }

    this.seo.setMeta({
      title: data['title'],
      description: data['description'] ?? '',
      url: this.router.url,
    });

    // Routes other than home/blog-detail don't carry structured data
    const path = route.snapshot.routeConfig?.path;
    if (path !== '') {
      this.seo.setStructuredData(null);
    }
  }
}
