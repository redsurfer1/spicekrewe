import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { INGREDIENT_INSIGHTS } from '../data/intelligence/ingredient';
import { OPERATIONAL_INSIGHTS } from '../data/intelligence/operational';
import { SUPPLY_CHAIN_INSIGHTS } from '../data/intelligence/supplyChain';
import { FINANCIAL_INSIGHTS } from '../data/intelligence/financial';
import { SENSORY_INSIGHTS } from '../data/intelligence/sensory';

export type CulinaryIntelligenceEntry = {
  id: string;
  domain: string;
  insight: string;
  payload: Record<string, unknown>;
};

const POOL: CulinaryIntelligenceEntry[] = [
  ...INGREDIENT_INSIGHTS.map((x) => ({
    id: x.id,
    domain: x.domain,
    insight: x.insight,
    payload: x.payload as Record<string, unknown>,
  })),
  ...OPERATIONAL_INSIGHTS.map((x) => ({
    id: x.id,
    domain: x.domain,
    insight: x.insight,
    payload: x.payload as Record<string, unknown>,
  })),
  ...SUPPLY_CHAIN_INSIGHTS.map((x) => ({
    id: x.id,
    domain: x.domain,
    insight: x.insight,
    payload: x.payload as Record<string, unknown>,
  })),
  ...FINANCIAL_INSIGHTS.map((x) => ({
    id: x.id,
    domain: x.domain,
    insight: x.insight,
    payload: x.payload as Record<string, unknown>,
  })),
  ...SENSORY_INSIGHTS.map((x) => ({
    id: x.id,
    domain: x.domain,
    insight: x.insight,
    payload: x.payload as Record<string, unknown>,
  })),
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

const DOMAIN_LABEL: Record<string, string> = {
  ingredient: 'Ingredient & flavor chemistry',
  operational: 'Operational & SOP',
  supply_chain: 'Supply chain',
  financial: 'Financial / COGS',
  sensory: 'Sensory & culture',
};

export default function DaaSPreview() {
  const pool = useMemo(() => POOL, []);
  const [entry, setEntry] = useState<CulinaryIntelligenceEntry | null>(null);

  const shuffle = useCallback(() => {
    setEntry(pickRandom(pool));
  }, [pool]);

  useEffect(() => {
    shuffle();
  }, [shuffle]);

  if (!entry) {
    return null;
  }

  const domainLabel = DOMAIN_LABEL[entry.domain] ?? entry.domain;

  return (
    <section
      aria-labelledby="daas-preview-heading"
      style={{ padding: '64px 24px', background: 'var(--sk-body-bg)', borderTop: '1px solid var(--sk-card-border)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--sk-gold)',
              }}
            >
              Culinary Intelligence
            </p>
            <h2
              id="daas-preview-heading"
              style={{
                margin: '0 0 10px',
                fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                fontWeight: 700,
                color: 'var(--sk-navy)',
              }}
            >
              Data-as-a-Service Preview
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--sk-text-muted)', maxWidth: 560 }}>
              Machine-readable culinary knowledge—sample a live insight from our structured intelligence layers. Subscribe
              to Intelligence unlocks API-ready payloads for your COS and stage-gate workflows.
            </p>
          </div>
          <button
            type="button"
            onClick={shuffle}
            className="inline-flex items-center gap-2 rounded-sk-md border border-sk-card-border bg-white px-4 py-2.5 text-sm font-semibold text-sk-navy shadow-sm hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} aria-hidden />
            Another insight
          </button>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          style={{ alignItems: 'stretch' }}
        >
          <article
            className="lg:col-span-3 rounded-sk-lg border border-sk-card-border bg-white p-6 shadow-sm"
            style={{ boxShadow: '0 8px 28px rgba(26, 26, 46, 0.07)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-spice-purple shrink-0" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-wide text-spice-purple">{domainLabel}</span>
            </div>
            <p className="m-0 text-base sm:text-lg leading-relaxed text-gray-800 font-medium">{entry.insight}</p>
            <p className="mt-4 mb-0 text-xs text-gray-500">
              Insight ID: <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{entry.id}</code>
            </p>
          </article>

          <aside className="lg:col-span-2 rounded-sk-lg border border-sk-card-border bg-sk-navy text-white p-5 flex flex-col min-h-[200px]">
            <p className="m-0 text-[11px] font-bold uppercase tracking-wider text-sk-purple-light/90 mb-2">
              Machine-readable payload
            </p>
            <pre
              className="m-0 flex-1 overflow-auto text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap break-words font-mono opacity-95"
              style={{ maxHeight: 280 }}
            >
              {JSON.stringify({ id: entry.id, domain: entry.domain, ...entry.payload }, null, 2)}
            </pre>
            <p className="mt-3 mb-0 text-[10px] text-white/60 leading-snug">
              JSON shape is versioned for COS automations, analytics pipelines, and partner-facing APIs.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
