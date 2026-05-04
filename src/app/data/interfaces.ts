export type VideoPlatform = 'youtube' | 'vimeo';

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  platform: VideoPlatform;
  publishedDate?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  author: string;
  publishedDate?: string;
  externalUrl?: string;
  tags?: string[];
  coverImage?: string;
  draft?: boolean;
}

export type ProjectRole = 'author' | 'contributor';

export interface Project {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  featured: boolean;
  role: ProjectRole;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Company {
  name: string;
  role: string;
  current?: boolean;
}

export interface Talk {
  title: string;
  venue: string;
  date?: string;
  externalUrl?: string;
  videoId?: string;
}

export type SkillCategory =
  | 'Languages'
  | 'Frameworks'
  | 'Infrastructure'
  | 'Practices';

export interface SkillGroup {
  category: SkillCategory;
  items: string[];
}

/**
 * Manifest produced by `scripts/build-data-pages.js` for paginated content
 * (blogs, videos, projects). `keys` is the ordered list of every entry's
 * primary identifier (slug for blogs, id for videos/projects) so the client
 * can map an identifier to the page it lives on.
 */
export interface Manifest {
  pageSize: number;
  totalItems: number;
  totalPages: number;
  keys: string[];
}
