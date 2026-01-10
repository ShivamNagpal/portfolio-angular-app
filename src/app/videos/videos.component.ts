import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

class VideoItem {
  title: string;
  id: string;

  constructor(title: string, id: string) {
    this.title = title;
    this.id = id;
  }

  track = () => {
    return this.id;
  };
}

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {
  videoItems: VideoItem[] = [
    new VideoItem(
      'Deploying Multiple Vert.x Verticles with Spring Boot',
      '2SlRRzFaVfA',
    ),
    new VideoItem('Vert.x Integration with Spring Boot', 'T31KQVPnCLo'),
  ];
}
