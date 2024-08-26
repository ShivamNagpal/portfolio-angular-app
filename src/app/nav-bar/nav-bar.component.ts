import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, MatIcon],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  isOpen: boolean = false;

  toggleNavBar() {
    this.isOpen = !this.isOpen;
  }

  closeNavBar() {
    this.isOpen = false;
  }
}
