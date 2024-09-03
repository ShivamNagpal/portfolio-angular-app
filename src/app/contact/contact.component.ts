import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgOptimizedImage, MatIcon],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly email: string = 'hi@shivamnagpal.dev';

  constructor(private clipboard: Clipboard) {}

  copyEmail() {
    this.clipboard.copy(this.email);
  }
}
