import { of } from 'rxjs';
import { DataService } from '../shared/services/data.service';
import {
  BlogPost,
  Company,
  Manifest,
  Project,
  SkillGroup,
  SocialLink,
  Talk,
  VideoItem,
} from './interfaces';

export const PROJECT_FIXTURES: Project[] = [
  {
    id: 'logplay',
    title: 'LogPlay',
    summary: 'Open-source framework for durable checkpointed execution.',
    tags: ['Kotlin', 'Durable Execution'],
    repoUrl: 'https://github.com/logplay-dev/logplay-server',
    featured: true,
    role: 'author',
  },
];

export const VIDEO_FIXTURES: VideoItem[] = [
  {
    id: '2SlRRzFaVfA',
    title: 'Deploying Multiple Vert.x Verticles with Spring Boot',
    tags: ['Vert.x', 'Spring Boot', 'Java'],
    platform: 'youtube',
  },
  {
    id: 'T31KQVPnCLo',
    title: 'Vert.x Integration with Spring Boot',
    tags: ['Vert.x', 'Spring Boot', 'Java'],
    platform: 'youtube',
  },
];

export const BLOG_FIXTURES: BlogPost[] = [
  {
    slug: 'welcome',
    title: 'Welcome to the Blog',
    summary: 'A short summary.',
    author: 'Shivam Nagpal',
    publishedDate: '2026-05-04',
    tags: ['Meta'],
  },
];

export const COMPANY_FIXTURES: Company[] = [
  { name: 'Inflection.io', role: 'Tech Lead', current: true },
  { name: 'Amazon', role: 'SDE-2' },
];

export const TALK_FIXTURES: Talk[] = [
  {
    title: 'Unit Testing: TDD and Hexagonal Architecture',
    venue: 'Inflection.io (internal)',
  },
];

export const SKILL_FIXTURES: SkillGroup[] = [
  { category: 'Languages', items: ['Java', 'Kotlin'] },
  { category: 'Frameworks', items: ['Spring Boot'] },
];

export const SOCIAL_LINK_FIXTURES: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/ShivamNagpal', icon: 'github' },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/shivamnagpal/',
    icon: 'linkedin',
  },
  { name: 'Email', url: 'mailto:hi@shivamnagpal.dev', icon: 'email' },
];

function manifest<T>(items: T[], pageSize: number, key: keyof T): Manifest {
  return {
    pageSize,
    totalItems: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    keys: items.map((i) => String(i[key])),
  };
}

export const BLOG_MANIFEST_FIXTURE: Manifest = manifest(
  BLOG_FIXTURES,
  10,
  'slug',
);
export const VIDEO_MANIFEST_FIXTURE: Manifest = manifest(
  VIDEO_FIXTURES,
  12,
  'id',
);
export const PROJECT_MANIFEST_FIXTURE: Manifest = manifest(
  PROJECT_FIXTURES,
  12,
  'id',
);

/**
 * A stub DataService for component tests. Returns the fixtures above as
 * already-emitted observables. Page-1 returns the full fixture array; other
 * pages return empty (tests rarely need pages beyond 1).
 */
export const STUB_DATA_SERVICE: Partial<DataService> = {
  companies$: of(COMPANY_FIXTURES),
  talks$: of(TALK_FIXTURES),
  skills$: of(SKILL_FIXTURES),
  socialLinks$: of(SOCIAL_LINK_FIXTURES),

  blogsManifest$: of(BLOG_MANIFEST_FIXTURE),
  videosManifest$: of(VIDEO_MANIFEST_FIXTURE),
  projectsManifest$: of(PROJECT_MANIFEST_FIXTURE),

  getBlogsPage: (n: number) => of(n === 1 ? BLOG_FIXTURES : []),
  getVideosPage: (n: number) => of(n === 1 ? VIDEO_FIXTURES : []),
  getProjectsPage: (n: number) => of(n === 1 ? PROJECT_FIXTURES : []),

  findBlogBySlug: (slug: string) =>
    of(BLOG_FIXTURES.find((b) => b.slug === slug) ?? null),
};
