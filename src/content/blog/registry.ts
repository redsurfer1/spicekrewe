import BLOG_DATA from './registry-data.json';

export type BlogFaqItem = { question: string; answer: string };

export type BlogPostEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  primaryKeyword: string;
  excerpt: string;
  raw: string;
  faqs: BlogFaqItem[];
};

/** Populated at build time from `registry-data.json` (see `scripts/build-blog-registry.ts`). */
export const BLOG_POSTS: BlogPostEntry[] = BLOG_DATA as BlogPostEntry[];

const bySlug = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

export function getBlogPost(slug: string): BlogPostEntry | undefined {
  return bySlug.get(slug);
}

export function listBlogPosts(): BlogPostEntry[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
