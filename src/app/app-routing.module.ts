import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    data: {
      title: 'Home',
      description:
        'Tech Lead and Backend Engineer building scalable distributed systems.',
    },
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
    data: {
      title: 'About',
      description:
        'Backend and distributed-systems engineer with 6+ years building services and data platforms that move data reliably at scale.',
    },
  },
  {
    path: 'code',
    loadComponent: () =>
      import('./code/code.component').then((m) => m.CodeComponent),
    data: {
      title: 'Code',
      description: "Open source projects I've authored and contributed to.",
    },
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('./blogs/blogs.component').then((m) => m.BlogsComponent),
    data: {
      title: 'Blog',
      description:
        'Notes on backend engineering, distributed systems, and the things I have learned shipping them.',
    },
  },
  {
    path: 'blogs/:slug',
    loadComponent: () =>
      import('./blogs/blog-detail/blog-detail.component').then(
        (m) => m.BlogDetailComponent,
      ),
  },
  {
    path: 'videos',
    loadComponent: () =>
      import('./videos/videos.component').then((m) => m.VideosComponent),
    data: {
      title: 'Videos',
      description: 'Tech talks on backend engineering and distributed systems.',
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
    data: {
      title: 'Contact',
      description: 'Get in touch — email or schedule a call.',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
