import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import B2BBanner from '../components/B2BBanner';
import SEO from '../components/SEO';
import TalentCard from '../components/TalentCard';
import type { TalentRecord } from '../types/talentRecord';
import { CULINARY_CATEGORIES, fetchTalentDirectory } from '../data/talent';

function matchesSearch(q: string, row: TalentRecord): boolean {
  if (!q.trim()) return true;
  const n = q.toLowerCase();
  const blob = [
    row.name,
    row.initials,
    row.role,
    row.specialty,
    row.bio,
    ...row.tags,
  ]
    .join(' ')
    .toLowerCase();
  return blob.includes(n);
}

type FilterPanelProps = {
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  onClear: () => void;
};

function TalentFilterPanel({ selectedCategories, toggleCategory, onClear }: FilterPanelProps) {
  return (
    <>
      <h2
        style={{
          margin: '0 0 12px 0',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--sk-gold)',
        }}
      >
        Culinary categories
      </h2>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {CULINARY_CATEGORIES.map((cat) => {
          const checked = selectedCategories.includes(cat);
          return (
            <li key={cat}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: checked ? '#fff' : 'var(--sk-muted-purple)',
                  padding: '10px 10px',
                  minHeight: 44,
                  borderRadius: 'var(--sk-radius-md)',
                  background: checked ? 'rgba(77, 47, 145, 0.45)' : 'transparent',
                  border: checked ? '1px solid rgba(77, 47, 145, 0.6)' : '1px solid transparent',
                  boxSizing: 'border-box',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(cat)}
                  style={{ accentColor: 'var(--sk-purple)', width: 18, height: 18, flexShrink: 0 }}
                />
                <span>{cat}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {selectedCategories.length > 0 ? (
        <button
          type="button"
          onClick={onClear}
          style={{
            marginTop: 14,
            width: '100%',
            minHeight: 44,
            padding: '10px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--sk-gold)',
            background: 'transparent',
            border: '1px solid rgba(230, 168, 0, 0.4)',
            borderRadius: 'var(--sk-radius-md)',
            cursor: 'pointer',
          }}
        >
          Clear filters
        </button>
      ) : null}
    </>
  );
}

function DirectorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" aria-busy="true" aria-label="Loading talent directory">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            borderRadius: 'var(--sk-radius-lg)',
            border: '1px solid var(--sk-card-border)',
            padding: 20,
            minHeight: 220,
            background: 'linear-gradient(90deg, var(--sk-purple-light) 25%, var(--sk-body-bg) 50%, var(--sk-purple-light) 75%)',
            backgroundSize: '200% 100%',
            animation: 'sk-shimmer 1.2s ease-in-out infinite',
          }}
        />
      ))}
      <style>{`@keyframes sk-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
    </div>
  );
}

export default function FindTalent() {
  const [roster, setRoster] = useState<TalentRecord[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDirectoryLoading(true);
    fetchTalentDirectory().then((list) => {
      if (!cancelled) {
        setRoster(list);
        setDirectoryLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }, []);

  const clearFilters = useCallback(() => setSelectedCategories([]), []);

  const filtered = useMemo(() => {
    return roster.filter((row) => {
      const categoryOk =
        selectedCategories.length === 0 ||
        row.tags.some((tag) => selectedCategories.includes(tag));
      return categoryOk && matchesSearch(debouncedSearch, row);
    });
  }, [roster, debouncedSearch, selectedCategories]);

  const activeFilterCount = selectedCategories.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--sk-body-bg)' }}>
      <SEO title="Find culinary talent – Spice Krewe" path="/talent" />
      <Navbar />

      <div
        className="flex flex-col gap-6 lg:flex-row px-4 sm:px-6 lg:px-8 py-8"
        style={{ flex: 1, maxWidth: 1400, margin: '0 auto', width: '100%' }}
      >
        <button
          type="button"
          className="lg:hidden w-full flex items-center justify-between gap-3 rounded-xl border text-left font-semibold"
          style={{
            background: 'var(--sk-navy)',
            borderColor: 'rgba(230, 168, 0, 0.25)',
            color: '#fff',
            minHeight: 48,
            padding: '12px 16px',
          }}
          aria-expanded={mobileFiltersOpen}
          aria-controls="talent-directory-filters"
          onClick={() => setMobileFiltersOpen((o) => !o)}
        >
          <span>
            Filters
            {activeFilterCount > 0 ? (
              <span style={{ fontWeight: 500, color: 'var(--sk-gold)', marginLeft: 8 }}>({activeFilterCount} active)</span>
            ) : null}
          </span>
          <span style={{ color: 'var(--sk-muted-purple)', fontSize: 18 }} aria-hidden>
            {mobileFiltersOpen ? '−' : '+'}
          </span>
        </button>

        <aside
          id="talent-directory-filters"
          className={`w-full shrink-0 rounded-xl border p-4 lg:sticky lg:self-start lg:w-64 ${
            mobileFiltersOpen ? 'block' : 'hidden'
          } lg:block`}
          style={{
            background: 'var(--sk-navy)',
            borderColor: 'rgba(230, 168, 0, 0.25)',
            top: 88,
          }}
        >
          <TalentFilterPanel
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            onClear={clearFilters}
          />
        </aside>

        <main
          className="min-w-0 flex-1 rounded-xl border overflow-hidden w-full"
          style={{ background: '#fff', borderColor: 'var(--sk-card-border)' }}
        >
          <div
            className="px-4 sm:px-6 pt-6 sm:pt-7 pb-5"
            style={{ borderBottom: '1px solid var(--sk-card-border)' }}
          >
            <h1
              style={{
                margin: '0 0 8px 0',
                fontSize: 'clamp(1.35rem, 4vw, 1.75rem)',
                fontWeight: 700,
                color: 'var(--sk-navy)',
                letterSpacing: '-0.02em',
              }}
            >
              Find culinary talent
            </h1>
            <p style={{ margin: '0 0 20px 0', fontSize: 15, color: '#6b5a88', maxWidth: 560, lineHeight: 1.55 }}>
              Search vetted chefs, developers, stylists, and consultants. Use categories to narrow the directory.
            </p>

            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, specialty, or keyword…"
              aria-label="Search talent"
              className="w-full max-w-full sm:max-w-[480px]"
              style={{
                minHeight: 48,
                padding: '12px 16px',
                fontSize: 16,
                borderRadius: 'var(--sk-radius-md)',
                border: '1px solid var(--sk-card-border)',
                outline: 'none',
                color: 'var(--sk-navy)',
                boxSizing: 'border-box',
              }}
            />
            {searchInput !== debouncedSearch ? (
              <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#a8a0b8' }}>Updating results…</p>
            ) : null}

            <div className="flex flex-wrap gap-2 mt-4">
              {CULINARY_CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="min-h-[44px] px-3"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 'var(--sk-radius-pill)',
                      cursor: 'pointer',
                      border: active ? '1px solid var(--sk-purple)' : '1px solid var(--sk-card-border)',
                      background: active ? 'rgba(77, 47, 145, 0.12)' : '#fff',
                      color: active ? 'var(--sk-purple)' : '#5c5470',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 sm:px-6 py-6">
            <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#6b5a88' }}>
              {filtered.length} professional{filtered.length === 1 ? '' : 's'} match your filters
            </p>
            {directoryLoading ? (
              <DirectorySkeleton />
            ) : filtered.length === 0 ? (
              <p style={{ color: '#6b5a88', fontSize: 15 }}>No matches. Try clearing categories or broadening your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filtered.map((row) => (
                  <TalentCard key={row.id} professional={row} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <B2BBanner />
      <Footer />
    </div>
  );
}
