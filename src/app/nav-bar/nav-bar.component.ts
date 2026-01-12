import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, MatIcon],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isOpen: boolean = false;
  navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    // { name: 'Blogs', path: '/blogs' },
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
    this.isOpen = !this.isOpen;
  }

  closeNavBar() {
    this.isOpen = false;
  }

  private setActiveFromUrl(url: string) {
    const clean = url.split('?')[0].split('#')[0];

    const match = this.navItems
      .filter((i) => clean === i.path || clean.startsWith(i.path + '/'))
      .sort((a, b) => b.path.length - a.path.length)[0];

    this.activeTabName = match?.name ?? '';
  }
}
