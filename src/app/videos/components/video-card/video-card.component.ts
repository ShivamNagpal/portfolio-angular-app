import { Component, inject, Input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoItem } from '../../../data/interfaces';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [NgOptimizedImage, MatIcon],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss',
})
export class VideoCardComponent {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) video!: VideoItem;
  isPlaying = signal(false);
  embedUrl = signal<SafeResourceUrl | null>(null);

  play() {
    const url = `https://www.youtube.com/embed/${this.video.id}?autoplay=1`;
    this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    this.isPlaying.set(true);
  }
}
