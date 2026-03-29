import type { Result } from './result';

type AirtableRecord<T = Record<string, unknown>> = {
  id: string;
  fields: T;
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
