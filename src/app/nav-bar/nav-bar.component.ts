import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

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
export class NavBarComponent {
  isOpen: boolean = false;
  navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    // { name: 'Blogs', path: '/blogs' },
    { name: 'Videos', path: '/videos' },
    { name: 'Contact', path: '/contact' },
  ];

  toggleNavBar() {
    this.isOpen = !this.isOpen;
  }

  closeNavBar() {
    this.isOpen = false;
  }
}
