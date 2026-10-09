import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage, MatIcon],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly email: string = 'hi@shivamnagpal.dev';

  constructor(private clipboard: Clipboard) {}

  copyEmail() {
    this.clipboard.copy(this.email);
  }
}
