/**
 * Gemini-powered culinary need summary. Intended for server-side or secure workers only —
 * do not bundle API keys into public client chunks. In a Vite SPA, call this from a future
 * API route / serverless function with GOOGLE_API_KEY set in the environment.
 */

import { GoogleGenAI } from '@google/genai';
import { scrubContext, scrubContextForLLM, type PrivacyShieldLogger } from './privacy';

const GEMINI_MODEL = 'gemini-1.5-flash';

export type CulinaryNeedSummary = {
  headline: string;
  serviceTypes: string[];
  scopeSummary: string;
  suggestedDeliverables: string[];
  constraintsOrRisks?: string;
};

export type BriefGeneratorPrivacyContext = {
  userRole: string;
  agentId?: string | null;
  isAdminRoute: boolean;
  logToAuditEvidence: PrivacyShieldLogger;
};

function getGeminiApiKey(): string {
  const fromProcess =
    typeof process !== 'undefined' ? process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY : undefined;
  const fromVite = import.meta.env?.VITE_GEMINI_API_KEY;
  const key = fromProcess ?? fromVite;
  if (!key) {
    throw new Error(
      'No Gemini API key: set GOOGLE_API_KEY for server builds or VITE_GEMINI_API_KEY for local dev only (never commit production secrets to the client).',
    );
  }
  return key;
}

/** Heuristic summary when Gemini is unavailable or the request fails (keeps the wizard usable). */
export function buildFallbackCulinarySummary(rawProjectDescription: string): CulinaryNeedSummary {
  const scrubbed = scrubContext(rawProjectDescription.trim(), 'INDIVIDUAL');
  const firstLine = scrubbed.split('\n').find((l) => l.trim().length > 0)?.trim().slice(0, 140) ?? 'Your culinary project';
  const headline = firstLine.length >= 10 ? (firstLine.endsWith('.') ? firstLine : `${firstLine}.`) : 'Culinary project brief';

  return {
    headline,
    serviceTypes: ['Culinary consulting', 'Menu & operations'],
    scopeSummary: scrubbed.slice(0, 500) + (scrubbed.length > 500 ? '…' : ''),
    suggestedDeliverables: [
      'Align on deliverables, milestones, and review checkpoints with your pro',
      'Confirm dietary, allergen, and brand guardrails in writing',
      'Schedule a kickoff (virtual or on-site) to lock scope and timeline',
    ],
  };
}

/**
 * Takes a raw project description, runs privacy scrub, returns structured "Culinary Need" JSON.
 */
export async function generateCulinaryNeedBrief(
  rawProjectDescription: string,
  options?: {
    /** Defaults to INDIVIDUAL (full scrub). */
    userRole?: string;
    isAdminRoute?: boolean;
    /** When set, uses async scrub + audit logging like Flomisma. */
    privacyContext?: BriefGeneratorPrivacyContext;
  },
): Promise<CulinaryNeedSummary> {
  const userRole = options?.userRole ?? 'INDIVIDUAL';
  const isAdminRoute = options?.isAdminRoute === true;

  const scrubbedDescription = options?.privacyContext
    ? await scrubContextForLLM(rawProjectDescription, options.privacyContext, options.privacyContext.logToAuditEvidence)
    : scrubContext(rawProjectDescription, userRole, { isAdminRoute });

  const apiKey = getGeminiApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a senior culinary operations analyst for Spice Krewe. Given this scrubbed client project description (PII may already be redacted), produce a concise internal "Culinary Need" summary.

Project description:
"""
${scrubbedDescription}
"""

Respond in the following JSON format only (no markdown fences, no extra text):
{
  "headline": "One line summary of the culinary need",
  "serviceTypes": ["e.g. recipe development", "food styling"],
  "scopeSummary": "2-4 sentences on scope, audience, and success criteria",
  "suggestedDeliverables": ["3-6 concrete deliverables"],
  "constraintsOrRisks": "Optional one sentence on timing, allergen, regulatory, or brand constraints"
}
Return only valid JSON.`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      maxOutputTokens: 768,
      temperature: 0.25,
    },
  });

  const text = (response.text ?? '').trim();
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}') + 1;
  const jsonStr = start >= 0 && end > start ? cleaned.slice(start, end) : cleaned;

  const parsed = JSON.parse(jsonStr) as CulinaryNeedSummary;
  if (!parsed.headline) parsed.headline = 'Culinary project brief';
  if (!Array.isArray(parsed.serviceTypes)) parsed.serviceTypes = [];
  if (!parsed.scopeSummary) parsed.scopeSummary = 'See project description.';
  if (!Array.isArray(parsed.suggestedDeliverables)) parsed.suggestedDeliverables = [];
  return parsed;
}
