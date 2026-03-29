import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import Navbar from '../../components/Navigation';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import pricingSource from '../../content/guides/pricing-2025.mdx?raw';

const PAGE_TITLE = '2025 Culinary Service Rates | Spice Krewe';
const PAGE_DESCRIPTION =
  'Transparent SK Verified rate bands for private chefs, recipe developers, and food stylists—contrasted with typical unvetted marketplace pricing.';

export default function PricingGuide2025Page() {
  const html = useMemo(
    () => marked.parse(pricingSource, { async: false, gfm: true }) as string,
    [],
  );

  return (
    <div className="min-h-screen bg-sk-body-bg flex flex-col">
      <SEO
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        path="/guides/pricing-2025"
        ogTitle={PAGE_TITLE}
        ogDescription={PAGE_DESCRIPTION}
      />
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-sk-gold">Guides</p>
          <article
            className="rounded-sk-lg border border-sk-card-border bg-white p-6 shadow-sm sm:p-10
              [&_a]:font-semibold [&_a]:text-spice-purple [&_a]:no-underline hover:[&_a]:underline
              [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-sk-navy sm:[&_h1]:text-4xl
              [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-sk-navy
              [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-sk-navy
              [&_li]:mb-1 [&_li]:text-sk-text-muted
              [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-sk-text-muted
              [&_strong]:text-sk-navy
              [&_table]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm
              [&_td]:border [&_td]:border-sk-card-border [&_td]:p-3 [&_td]:text-sk-text-muted
              [&_th]:border [&_th]:border-sk-card-border [&_th]:bg-sk-purple-light/15 [&_th]:p-3 [&_th]:text-xs [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-sk-navy
              [&_tr:nth-child(even)]:bg-sk-body-bg/80
              [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-sk-text-muted
              [&_hr]:my-10 [&_hr]:border-sk-card-border"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/hire"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sk-md bg-spice-purple px-6 py-2.5 text-sm font-bold text-white no-underline shadow-md shadow-spice-purple/30 hover:bg-spice-blue"
            >
              Post a project
            </Link>
            <Link
              to="/talent"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sk-md border border-sk-card-border bg-white px-6 py-2.5 text-sm font-semibold text-spice-purple no-underline hover:bg-sk-purple-light/20"
            >
              Browse talent
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
