import { MEMPHIS_VOICE_SEARCH_FAQ_ITEMS } from '../../lib/seo/memphisVoiceFaq';

export type BlogFaqItem = { question: string; answer: string };

/**
 * FAQPage JSON-LD sources — keyed by slug; body + SEO metadata live in each `.mdx` frontmatter.
 * Used at build time by `scripts/build-blog-registry.ts` to embed `faqs` in `registry-data.json`.
 */
export const FAQ_BY_SLUG: Record<string, BlogFaqItem[]> = {
  'private-chef-cost': [
    {
      question: 'How much to hire a private chef for one night?',
      answer:
        'Labor often ranges $800–$3,500+ for a single evening before groceries, depending on menu, headcount, and travel.',
    },
    {
      question: 'What is the difference between a personal chef and a private chef?',
      answer:
        'Private chef usually means an on-site event; personal chef often implies recurring meal prep—define format in your brief.',
    },
    {
      question: 'Personal chef vs private chef—how do costs differ?',
      answer:
        'Private events concentrate hours into one night; personal-chef programs spread cost across weekly visits.',
    },
    {
      question: 'How much do freelance chefs charge per hour?',
      answer:
        'SK Verified anchors on Spice Krewe are $150–$190/hr across Marcus Johnson, Aisha Thompson, Dana Nguyen, and Rafael Cruz.',
    },
  ],
  'sk-verified': [
    {
      question: 'What is a vetted culinary professional marketplace?',
      answer:
        'A platform that reviews work and references before listing talent—Spice Krewe uses SK Verified gating for that purpose.',
    },
    {
      question: 'Is there a culinary freelancer platform with vetting?',
      answer: 'Yes—Spice Krewe combines SK Verified review with structured briefs and our Matching Engine.',
    },
    {
      question: 'What questions should I ask before hiring a food consultant?',
      answer:
        'Ask about deliverables, revisions, IP, timeline, expenses, and co-packer handoff format before you sign.',
    },
  ],
  'memphis-culinary-talent': [...MEMPHIS_VOICE_SEARCH_FAQ_ITEMS],
};
