import { Component, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FeaturedCardsComponent } from './components/featured-cards/featured-cards.component';
import { SeoService } from '../shared/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage, MatIcon, FeaturedCardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Shivam Nagpal',
      url: 'https://shivamnagpal.dev/',
      jobTitle: 'Tech Lead / SDE-3',
      worksFor: {
        '@type': 'Organization',
        name: 'Inflection.io',
      },
      sameAs: [
        'https://github.com/ShivamNagpal',
        'https://www.linkedin.com/in/shivamnagpal/',
      ],
    });
  }
}
