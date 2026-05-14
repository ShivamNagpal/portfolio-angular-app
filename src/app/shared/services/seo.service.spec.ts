import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';

import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let title: Title;
  let meta: Meta;

  beforeEach(() => {
    const existing = document.getElementById('json-ld');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    } else {
      existing.textContent = '';
    }

    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
  });

  it('should set browser title with brand suffix', () => {
    service.setMeta({
      title: 'About',
      description: 'About page',
      url: '/about',
    });
    expect(title.getTitle()).toBe('About · Shivam Nagpal');
  });

  it('should use the home title format when title is "Home"', () => {
    service.setMeta({ title: 'Home', description: 'd', url: '/' });
    expect(title.getTitle()).toContain('Shivam Nagpal');
    expect(title.getTitle()).toContain('Backend');
  });

  it('should update the description meta tag', () => {
    service.setMeta({
      title: 'About',
      description: 'A short bio.',
      url: '/about',
    });
    const tag = meta.getTag('name="description"');
    expect(tag?.content).toBe('A short bio.');
  });

  it('should set og:title with brand suffix', () => {
    service.setMeta({ title: 'About', description: 'd', url: '/about' });
    const og = meta.getTag('property="og:title"');
    expect(og?.content).toBe('About · Shivam Nagpal');
  });

  it('should write JSON to the json-ld script element', () => {
    service.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
    });
    const el = document.getElementById('json-ld')!;
    expect(el.textContent).toContain('"Person"');
  });

  it('should clear the json-ld script element when called with null', () => {
    service.setStructuredData({ '@type': 'X' });
    service.setStructuredData(null);
    const el = document.getElementById('json-ld')!;
    expect(el.textContent).toBe('');
  });

  it('should make canonical URL absolute with trailing slash', () => {
    service.setMeta({ title: 'Code', description: 'd', url: '/code' });
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    expect(canonical?.href).toBe('https://shivamnagpal.dev/code/');
  });

  it('should leave the root canonical URL untouched', () => {
    service.setMeta({ title: 'Home', description: 'd', url: '/' });
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    expect(canonical?.href).toBe('https://shivamnagpal.dev/');
  });

  it('should set og:url with trailing slash to match canonical', () => {
    service.setMeta({ title: 'Blog', description: 'd', url: '/blogs/my-post' });
    const og = meta.getTag('property="og:url"');
    expect(og?.content).toBe('https://shivamnagpal.dev/blogs/my-post/');
  });
});
