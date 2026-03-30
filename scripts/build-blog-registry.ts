/**
 * Build-time: reads `src/content/blog/*.mdx`, parses frontmatter with gray-matter (Node-only),
 * validates SEO contract, merges FAQ map from `blog-faqs.ts`, writes `registry-data.json` for the app bundle.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { FAQ_BY_SLUG } from '../src/content/blog/blog-faqs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mdxDir = path.join(root, 'src/content/blog');
const outFile = path.join(mdxDir, 'registry-data.json');

type Frontmatter = {
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
  primaryKeyword?: string;
  excerpt?: string;
};

type BlogPostWithPath = {
  path: string;
  entry: {
    slug: string;
    title: string;
    description: string;
    date: string;
    primaryKeyword: string;
    excerpt: string;
    raw: string;
    faqs: { question: string; answer: string }[];
  };
};

const SLUG_RE = /^[a-z0-9-]+$/;

function slugFromFilename(file: string): string {
  return path.basename(file, '.mdx');
}

function validateBlogPosts(items: BlogPostWithPath[]): void {
  const slugCounts = new Map<string, string[]>();
  for (const { path: p, entry } of items) {
    const list = slugCounts.get(entry.slug) ?? [];
    list.push(p);
    slugCounts.set(entry.slug, list);
  }

  for (const { path: p, entry } of items) {
    const filename = p.replace(/^\.\//, '');
    const req: Array<[string, string | undefined]> = [
      ['slug', entry.slug],
      ['title', entry.title],
      ['description', entry.description],
      ['date', entry.date],
      ['primaryKeyword', entry.primaryKeyword],
      ['excerpt', entry.excerpt],
    ];
    for (const [field, val] of req) {
      if (typeof val !== 'string' || val.trim() === '') {
        throw new Error(`MDX validation failed: ${filename} — ${field}: required (non-empty string)`);
      }
    }
    if (!SLUG_RE.test(entry.slug)) {
      throw new Error(
        `MDX validation failed: ${filename} — slug: must be lowercase letters, digits, and hyphens only`,
      );
    }
    if (entry.title.length > 60) {
      throw new Error(`MDX validation failed: ${filename} — title: exceeds 60 characters`);
    }
    if (entry.description.length > 155) {
      throw new Error(`MDX validation failed: ${filename} — description: exceeds 155 characters`);
    }
    if (entry.excerpt.length > 300) {
      throw new Error(`MDX validation failed: ${filename} — excerpt: exceeds 300 characters`);
    }
  }

  for (const [slug, paths] of slugCounts) {
    if (paths.length > 1) {
      throw new Error(
        `MDX validation failed: ${paths[0] ?? slug} — slug: duplicate slug "${slug}" (also in ${paths.slice(1).join(', ')})`,
      );
    }
  }
}

function main(): void {
  if (!fs.existsSync(mdxDir)) {
    console.error('build-blog-registry: missing', mdxDir);
    process.exit(1);
  }

  const files = fs.readdirSync(mdxDir).filter((f) => f.endsWith('.mdx'));
  const withPath: BlogPostWithPath[] = [];

  for (const f of files) {
    const rel = `./${f}`;
    const full = path.join(mdxDir, f);
    const fileRaw = fs.readFileSync(full, 'utf8');
    const { data, content } = matter(fileRaw);
    const fm = data as Frontmatter;
    const slug = (fm.slug ?? slugFromFilename(f)).trim();

    const entry: BlogPostWithPath['entry'] = {
      slug,
      title: typeof fm.title === 'string' ? fm.title : '',
      description: typeof fm.description === 'string' ? fm.description : '',
      date: typeof fm.date === 'string' ? fm.date : '',
      primaryKeyword: typeof fm.primaryKeyword === 'string' ? fm.primaryKeyword : '',
      excerpt: typeof fm.excerpt === 'string' ? fm.excerpt : '',
      raw: content.replace(/^\s+/, ''),
      faqs: FAQ_BY_SLUG[slug] ?? [],
    };

    withPath.push({ path: rel, entry });
  }

  validateBlogPosts(withPath);

  const sorted = withPath
    .map((w) => w.entry)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  fs.writeFileSync(outFile, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  console.log('build-blog-registry: wrote', outFile, `(${sorted.length} posts)`);
}

main();
