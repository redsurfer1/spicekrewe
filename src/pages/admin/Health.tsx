import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Database, Radio, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/Navigation';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const TOKEN_KEY = 'sk_admin_token';

type HealthPayload = {
  generatedAt: string;
  airtable: { status: string; detail?: string };
  stripeWebhook: { status: string; listener: string };
  recentBriefSyncs: Array<{
    recordIdSuffix: string;
    createdTime: string | null;
    projectTitle: string;
    clientName: string;
  }>;
  recentBriefsError?: string;
};

function apiPath(p: string): string {
  const base = import.meta.env.VITE_APP_ORIGIN?.replace(/\/$/, '') ?? '';
  return `${base}${p}`;
}

export default function AdminHealthPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      navigate('/admin', { replace: true });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath('/api/admin/health'), {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        navigate('/admin', { replace: true });
        return;
      }
      const json = (await res.json()) as HealthPayload & { error?: string };
      if (!res.ok) {
        setError(json.error || res.statusText);
        setData(null);
        return;
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load health');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <SEO title="System Health – Spice Krewe Admin" path="/admin/health" />
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-8 w-8 text-spice-purple" aria-hidden />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System health</h1>
            <p className="text-sm text-gray-600">Flomisma-standard operational view (admin only).</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading status…</p>
        ) : error ? (
          <div className="rounded-sk-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        ) : data ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-sk-md border border-sk-card-border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-spice-purple" aria-hidden />
                  <h2 className="font-semibold text-gray-900">Airtable (Briefs)</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Status:{' '}
                  <strong className={data.airtable.status === 'connected' ? 'text-green-700' : 'text-red-700'}>
                    {data.airtable.status}
                  </strong>
                </p>
                {data.airtable.detail ? (
                  <p className="mt-2 text-xs text-gray-500 break-words">{data.airtable.detail}</p>
                ) : null}
              </div>

              <div className="rounded-sk-md border border-sk-card-border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="h-5 w-5 text-spice-blue" aria-hidden />
                  <h2 className="font-semibold text-gray-900">Stripe webhooks</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Listener:{' '}
                  <strong>{data.stripeWebhook.listener}</strong> ({data.stripeWebhook.status})
                </p>
              </div>
            </div>

            <div className="rounded-sk-md border border-sk-card-border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-spice-purple" aria-hidden />
                <h2 className="font-semibold text-gray-900">Recent brief syncs (PII obfuscated)</h2>
              </div>
              {data.recentBriefsError ? (
                <p className="text-sm text-amber-800">{data.recentBriefsError}</p>
              ) : data.recentBriefSyncs.length === 0 ? (
                <p className="text-sm text-gray-600">No recent rows returned (empty table or new base).</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recentBriefSyncs.map((row) => (
                    <li key={row.recordIdSuffix} className="py-3 text-sm flex flex-wrap gap-x-4 gap-y-1">
                      <span className="text-gray-500">…{row.recordIdSuffix}</span>
                      <span className="text-gray-800">{row.projectTitle}</span>
                      <span className="text-gray-600">{row.clientName}</span>
                      <span className="text-gray-400 text-xs">
                        {row.createdTime ? new Date(row.createdTime).toISOString() : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-gray-500">Generated at {data.generatedAt}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/admin" className="text-spice-purple font-semibold">
                ← Admin home
              </Link>
              <button
                type="button"
                className="text-gray-600 underline"
                onClick={() => {
                  sessionStorage.removeItem(TOKEN_KEY);
                  navigate('/admin');
                }}
              >
                Log out
              </button>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
