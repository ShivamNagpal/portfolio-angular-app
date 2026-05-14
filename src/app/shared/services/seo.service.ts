import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_NAME = 'Shivam Nagpal';
const SITE_URL = 'https://shivamnagpal.dev';
const DEFAULT_OG_IMAGE = '/assets/og-image.png';
const JSON_LD_ELEMENT_ID = 'json-ld';

export interface SeoMetadata {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  ogImage?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  setMeta(metadata: SeoMetadata): void {
    const isHome = metadata.title === 'Home';
    const fullTitle = isHome
      ? `${SITE_NAME} · Backend & Distributed Systems Engineer`
      : `${metadata.title} · ${SITE_NAME}`;

    const canonicalUrl = this.withTrailingSlash(
      this.toAbsoluteUrl(metadata.url),
    );
    const ogImage = this.toAbsoluteUrl(metadata.ogImage ?? DEFAULT_OG_IMAGE);
    const type = metadata.type ?? 'website';

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: metadata.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({
      property: 'og:description',
      content: metadata.description,
    });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({
      name: 'twitter:description',
      content: metadata.description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    this.setCanonical(canonicalUrl);
  }

  setStructuredData(data: object | null): void {
    const el = this.document.getElementById(JSON_LD_ELEMENT_ID);
    if (!el) return;
    el.textContent = data ? JSON.stringify(data) : '';
  }

  private toAbsoluteUrl(pathOrUrl: string): string {
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${SITE_URL}${path}`;
  }

  // Cloudflare Pages 308-redirects non-trailing-slash URLs to the trailing-slash
  // form (e.g. /about → /about/), and the sitemap uses the trailing-slash form.
  // Canonical / og:url must match the sitemap to avoid Search Console flagging
  // pages as "Page with redirect".
  private withTrailingSlash(absoluteUrl: string): string {
    return absoluteUrl.endsWith('/') ? absoluteUrl : `${absoluteUrl}/`;
  }

  private setCanonical(absoluteUrl: string): void {
    let link = this.document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', absoluteUrl);
  }
}
