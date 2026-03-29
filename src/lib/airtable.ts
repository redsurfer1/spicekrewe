/**
 * Airtable REST client — Result-pattern fetch wrapper (Flomisma escrow-style),
 * adapted for Vite env (`import.meta.env`).
 */

import type { Result } from './types/results';
import type { TalentRecord } from '../types/talentRecord';
import { HireBriefSchema, type HireBriefInput } from './validation';

type AirtableRecord<T = Record<string, unknown>> = {
  id: string;
  fields: T;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

type AirtableCreateResponse = {
  records: { id: string }[];
};

function getEnv(): {
  apiKey: string | undefined;
  baseId: string | undefined;
  professionalsTable: string;
  briefsTable: string;
} {
  const env = import.meta.env;
  return {
    apiKey: env.VITE_AIRTABLE_API_KEY as string | undefined,
    baseId: env.VITE_AIRTABLE_BASE_ID as string | undefined,
    professionalsTable: (env.VITE_AIRTABLE_PROFESSIONALS_TABLE as string) || 'Professionals',
    briefsTable: (env.VITE_AIRTABLE_BRIEFS_TABLE as string) || 'Briefs',
  };
}

function missingConfig(): boolean {
  const { apiKey, baseId } = getEnv();
  return !apiKey?.trim() || !baseId?.trim();
}

async function airtableFetch(path: string, init?: RequestInit): Promise<Result<Response, Error>> {
  const { apiKey } = getEnv();
  if (!apiKey?.trim()) {
    return { success: false, error: new Error('Airtable API key is not configured') };
  }
  try {
    const res = await fetch(`https://api.airtable.com/v0/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

/**
 * Map an Airtable row to TalentRecord. Expected field names (adjust in Airtable to match):
 * Slug (or Name-derived), Name, Initials, Role, Specialty, Rate, Rating, Reviews,
 * Verified, Available, AvatarColor, AvatarText, Tags (multi-select or comma text), Bio
 */
function mapProfessionalRecord(rec: AirtableRecord): TalentRecord | null {
  const f = rec.fields as Record<string, unknown>;
  const str = (k: string, alt?: string) => {
    const v = f[k] ?? (alt ? f[alt] : undefined);
    return v == null ? '' : String(v).trim();
  };
  const num = (k: string, def = 0) => {
    const v = f[k];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string') {
      const n = parseFloat(v);
      return Number.isNaN(n) ? def : n;
    }
    return def;
  };
  const bool = (k: string) => {
    const v = f[k];
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === 1) return true;
    return false;
  };
  const tagsRaw = f.Tags ?? f.tags;
  let tags: string[] = [];
  if (Array.isArray(tagsRaw)) {
    tags = tagsRaw.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof tagsRaw === 'string') {
    tags = tagsRaw.split(/[,;]/).map((t) => t.trim()).filter(Boolean);
  }

  const name = str('Name');
  if (!name) return null;

  let id = str('Slug', 'slug');
  if (!id) {
    id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  if (!id) id = rec.id;

  const initials = str('Initials') || name.split(/\s+/).map((p) => p[0]).join('').slice(0, 3).toUpperCase();
  const avatarText = str('AvatarText', 'Initials') || initials;

  return {
    id,
    name,
    initials,
    role: str('Role') || 'Culinary professional',
    specialty: str('Specialty') || '',
    rate: str('Rate') || '',
    rating: num('Rating'),
    reviews: Math.max(0, Math.floor(num('Reviews'))),
    verified: bool('Verified'),
    available: f.Available === undefined ? true : bool('Available'),
    avatarColor: str('AvatarColor') || 'var(--sk-purple)',
    avatarText,
    tags: tags.length ? tags : ['General'],
    bio: str('Bio') || '',
  };
}

/**
 * List all professionals from Airtable (paginated).
 */
export async function fetchProfessionals(): Promise<Result<TalentRecord[], Error>> {
  if (missingConfig()) {
    return { success: false, error: new Error('Airtable is not configured (missing API key or base id)') };
  }
  const { baseId, professionalsTable } = getEnv();
  const all: AirtableRecord[] = [];
  let offset: string | undefined;

  try {
    do {
      const qs = new URLSearchParams();
      if (offset) qs.set('offset', offset);
      const q = qs.toString();
      const path = `${baseId}/${encodeURIComponent(professionalsTable)}${q ? `?${q}` : ''}`;
      const fr = await airtableFetch(path);
      if (!fr.success) return fr;

      if (!fr.data.ok) {
        const text = await fr.data.text().catch(() => fr.data.statusText);
        return {
          success: false,
          error: new Error(`Airtable ${fr.data.status}: ${text.slice(0, 200)}`),
        };
      }

      const json = (await fr.data.json()) as AirtableListResponse;
      all.push(...(json.records ?? []));
      offset = json.offset;
    } while (offset);

    const mapped = all.map(mapProfessionalRecord).filter((x): x is TalentRecord => x != null);
    return { success: true, data: mapped };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err };
  }
}

/**
 * Create a row in the Briefs table. Validates payload with HireBriefSchema first.
 */
export async function submitProjectBrief(brief: unknown): Promise<Result<{ recordId: string }, Error>> {
  if (missingConfig()) {
    return { success: false, error: new Error('Airtable is not configured') };
  }

  const parsed = HireBriefSchema.safeParse(brief);
  if (!parsed.success) {
    return {
      success: false,
      error: new Error(parsed.error.issues.map((i) => i.message).join('; ')),
    };
  }

  const data: HireBriefInput = parsed.data;
  const { baseId, briefsTable } = getEnv();

  const primaryIds = (data.primaryInterestTalentIds ?? []).filter(Boolean);
  const fields: Record<string, string | number | boolean | string[]> = {
    ClientName: data.clientName,
    ProjectTitle: data.projectTitle,
    BudgetRange: data.budgetRange,
    Timeline: data.timeline,
    Description: data.description,
    RequiredSkills: data.requiredSkills.join('; '),
  };

  if (primaryIds.length) {
    fields.PrimaryInterestTalentIds = primaryIds.join('; ');
  }
  if (data.sourceTalentId?.trim()) {
    fields.SourceTalentId = data.sourceTalentId.trim();
  }

  const path = `${baseId}/${encodeURIComponent(briefsTable)}`;
  const fr = await airtableFetch(path, {
    method: 'POST',
    body: JSON.stringify({ records: [{ fields }] }),
  });

  if (!fr.success) return fr;

  if (!fr.data.ok) {
    const text = await fr.data.text().catch(() => fr.data.statusText);
    return {
      success: false,
      error: new Error(`Airtable ${fr.data.status}: ${text.slice(0, 300)}`),
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

/**
 * Patch a Briefs row (e.g. posting tier after the client chooses Standard vs Featured).
 * Add matching field names in Airtable: PostingTier, PrimaryInterestTalentIds, SourceTalentId.
 */
export async function patchBriefRecord(
  recordId: string,
  fields: Record<string, string | number | boolean>,
): Promise<Result<void, Error>> {
  if (missingConfig()) {
    return { success: false, error: new Error('Airtable is not configured') };
  }
  const id = recordId?.trim();
  if (!id) {
    return { success: false, error: new Error('recordId is required') };
  }

  const { baseId, briefsTable } = getEnv();
  const path = `${baseId}/${encodeURIComponent(briefsTable)}/${encodeURIComponent(id)}`;
  const fr = await airtableFetch(path, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });

  if (!fr.success) return fr;

  if (!fr.data.ok) {
    const text = await fr.data.text().catch(() => fr.data.statusText);
    return {
      success: false,
      error: new Error(`Airtable ${fr.data.status}: ${text.slice(0, 300)}`),
    };
  }

  return { success: true, data: undefined };
}
