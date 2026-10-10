import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface NavItem {
  name: string;
  path: string;
}

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, NgClass, MatIcon],
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isOpen = signal(false);
  navItems: NavItem[] = [
    { name: 'About', path: '/about' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Code', path: '/code' },
    { name: 'Videos', path: '/videos' },
    { name: 'Contact', path: '/contact' },
  ];

  activeTabName = '';

  ngOnInit(): void {
    this.setActiveFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.setActiveFromUrl(e.urlAfterRedirects));
  }

  toggleNavBar() {
    this.isOpen.update((open) => !open);
  }

  closeNavBar() {
    this.isOpen.set(false);
  }

  private setActiveFromUrl(url: string) {
    const clean = url.split('?')[0].split('#')[0];

    const match = this.navItems
      .filter((i) => clean === i.path || clean.startsWith(i.path + '/'))
      .sort((a, b) => b.path.length - a.path.length)[0];

    this.activeTabName = match?.name ?? '';
  }
}
