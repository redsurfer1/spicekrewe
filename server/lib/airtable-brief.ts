import type { Result } from './result';

type AirtableRecord<T = Record<string, unknown>> = {
  id: string;
  createdTime?: string;
  fields: T;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

type AirtableCreateResponse = {
  records: { id: string }[];
};

function getEnv(): { token: string | undefined; baseId: string | undefined; table: string } {
  return {
    token: process.env.AIRTABLE_SECRET_PAT?.trim(),
    baseId: process.env.AIRTABLE_BASE_ID?.trim(),
    table: process.env.AIRTABLE_BRIEFS_TABLE?.trim() || 'Briefs',
  };
}

async function airtableRequest(path: string, init?: RequestInit): Promise<Result<Response, Error>> {
  const { token } = getEnv();
  if (!token) {
    return { success: false, error: new Error('AIRTABLE_SECRET_PAT is not configured') };
  }
  try {
    const res = await fetch(`https://api.airtable.com/v0/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init?.headers as Record<string, string>),
      },
    });
    return { success: true, data: res };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err };
  }
}

export async function getBriefRecord(recordId: string): Promise<Result<AirtableRecord, Error>> {
  const { baseId, table } = getEnv();
  if (!baseId) {
    return { success: false, error: new Error('AIRTABLE_BASE_ID is not configured') };
  }
  const id = recordId?.trim();
  if (!id) {
    return { success: false, error: new Error('recordId is required') };
  }

  const path = `${baseId}/${encodeURIComponent(table)}/${encodeURIComponent(id)}`;
  const fr = await airtableRequest(path, { method: 'GET' });
  if (!fr.success) return fr;

  if (!fr.data.ok) {
    const text = await fr.data.text().catch(() => fr.data.statusText);
    return {
      success: false,
      error: new Error(`Airtable GET ${fr.data.status}: ${text.slice(0, 300)}`),
    };
  }

  try {
    const json = (await fr.data.json()) as AirtableRecord;
    if (!json?.id) {
      return { success: false, error: new Error('Airtable returned invalid record') };
    }
    return { success: true, data: json };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err };
  }
}

export async function patchBriefRecord(
  recordId: string,
  fields: Record<string, string | number | boolean>,
): Promise<Result<void, Error>> {
  const { baseId, table } = getEnv();
  if (!baseId) {
    return { success: false, error: new Error('AIRTABLE_BASE_ID is not configured') };
  }
  const id = recordId?.trim();
  if (!id) {
    return { success: false, error: new Error('recordId is required') };
  }

  const path = `${baseId}/${encodeURIComponent(table)}/${encodeURIComponent(id)}`;
  const fr = await airtableRequest(path, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });

  if (!fr.success) return fr;

  if (!fr.data.ok) {
    const text = await fr.data.text().catch(() => fr.data.statusText);
    return {
      success: false,
      error: new Error(`Airtable PATCH ${fr.data.status}: ${text.slice(0, 300)}`),
    };
  }

  return { success: true, data: undefined };
}

/**
 * Read PaymentStatus from Airtable (supports common label variants).
 */
export function isBriefMarkedPaid(fields: Record<string, unknown>): boolean {
  const raw = fields.PaymentStatus ?? fields.paymentStatus;
  if (raw === true) return true;
  if (typeof raw === 'string' && raw.trim().toLowerCase() === 'paid') return true;
  return false;
}

/**
 * Create a Briefs row (server-only). Callers must sanitize short text fields.
 */
export async function createBriefRecord(
  fields: Record<string, string | number | boolean | string[]>,
): Promise<Result<{ recordId: string }, Error>> {
  const { baseId, table } = getEnv();
  if (!baseId) {
    return { success: false, error: new Error('AIRTABLE_BASE_ID is not configured') };
  }

  const path = `${baseId}/${encodeURIComponent(table)}`;
  const fr = await airtableRequest(path, {
    method: 'POST',
    body: JSON.stringify({ records: [{ fields }] }),
  });

  if (!fr.success) return fr;

  if (!fr.data.ok) {
    const text = await fr.data.text().catch(() => fr.data.statusText);
    return {
      success: false,
      error: new Error(`Airtable POST ${fr.data.status}: ${text.slice(0, 300)}`),
    };
  }

  try {
    const json = (await fr.data.json()) as AirtableCreateResponse;
    const id = json.records?.[0]?.id;
    if (!id) return { success: false, error: new Error('Airtable returned no record id') };
    return { success: true, data: { recordId: id } };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err };
  }
}

export type BriefAuditRow = {
  recordId: string;
  /** ISO time from Airtable when present */
  createdTime: string | null;
  projectTitleObfuscated: string;
  clientNameObfuscated: string;
  /** When `PredictiveMatchSummary` exists on the Briefs record (matchmaker pipeline). */
  predictiveMatchSummary?: string;
};

function obfuscateLabel(s: string): string {
  const t = s.trim();
  if (t.length <= 1) return '•••';
  if (t.length === 2) return `${t[0]}•`;
  return `${t[0]}•••${t[t.length - 1]}`;
}

/**
 * Recent Briefs for admin health (PII minimized). Fetches up to `pageSize` and sorts by createdTime.
 */
export async function listRecentBriefsForAudit(pageSize: number): Promise<Result<BriefAuditRow[], Error>> {
  const { baseId, table } = getEnv();
  if (!baseId) {
    return { success: false, error: new Error('AIRTABLE_BASE_ID is not configured') };
  }

  const qs = new URLSearchParams();
  qs.set('pageSize', String(Math.min(Math.max(pageSize, 1), 30)));

  const path = `${baseId}/${encodeURIComponent(table)}?${qs.toString()}`;
  const fr = await airtableRequest(path, { method: 'GET' });
  if (!fr.success) return fr;

  if (!fr.data.ok) {
    const text = await fr.data.text().catch(() => fr.data.statusText);
    return {
      success: false,
      error: new Error(`Airtable LIST ${fr.data.status}: ${text.slice(0, 300)}`),
    };
  }

  try {
    const json = (await fr.data.json()) as AirtableListResponse;
    const rows = [...(json.records ?? [])].sort((a, b) => {
      const ta = a.createdTime ? Date.parse(a.createdTime) : 0;
      const tb = b.createdTime ? Date.parse(b.createdTime) : 0;
      return tb - ta;
    });

    const mapped: BriefAuditRow[] = rows.slice(0, pageSize).map((rec) => {
      const f = rec.fields as Record<string, unknown>;
      const pt = f.ProjectTitle ?? f.projectTitle;
      const cn = f.ClientName ?? f.clientName;
      const pm = f.PredictiveMatchSummary ?? f.predictiveMatchSummary;
      return {
        recordId: rec.id,
        createdTime: rec.createdTime ?? null,
        projectTitleObfuscated: obfuscateLabel(typeof pt === 'string' ? pt : 'Brief'),
        clientNameObfuscated: obfuscateLabel(typeof cn === 'string' ? cn : 'Client'),
        predictiveMatchSummary:
          typeof pm === 'string' && pm.trim() ? pm.trim().slice(0, 2000) : undefined,
      };
    });

    return { success: true, data: mapped };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err };
  }
}

/** Lightweight connectivity probe (GET base meta is not available — list 1 record). */
export async function pingAirtableBriefsTable(): Promise<Result<'ok', Error>> {
  const r = await listRecentBriefsForAudit(1);
  if (!r.success) return r;
  return { success: true, data: 'ok' };
}
