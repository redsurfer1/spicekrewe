/**
 * Role-based privacy interceptor — scrub PII before outbound LLM calls.
 * Ported from Flomisma `privacy-shield.ts` (Culinary IP + client PII protection).
 */

const PLACEHOLDER_IDENTITY = '[REDACTED_IDENTITY]';
const PLACEHOLDER_VALUATION = '[REDACTED_VALUATION]';
const PLACEHOLDER_PII = '[REDACTED_PII]';

const LEADERSHIP_ROLE = 'LEADERSHIP';
const DOLLAR_THRESHOLD = 100_000;

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_RE =
  /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b|(?:\+[0-9]{1,3}[-.\s]?){1,2}[0-9]{2,4}[-.\s]?[0-9]{2,4}[-.\s]?[0-9]{2,4}\b/g;
const DOLLAR_LARGE_RE = /\$\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?|[0-9]+\.[0-9]{2})\b/g;
const FULL_NAME_RE =
  /\b([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;

function replaceDollarIfOverThreshold(match: string): string {
  const numStr = match.replace(/\$\s*/g, '').replace(/,/g, '');
  const num = parseFloat(numStr);
  return num > DOLLAR_THRESHOLD ? PLACEHOLDER_VALUATION : match;
}

/**
 * Scrub context before sending to an LLM. LEADERSHIP on admin routes may bypass (optional).
 */
export function scrubContext(
  text: string,
  userRole: string,
  options?: { isAdminRoute?: boolean },
): string {
  const isLeadership = (userRole ?? '').toUpperCase() === LEADERSHIP_ROLE;
  const isAdminRoute = options?.isAdminRoute === true;

  if (isLeadership && isAdminRoute) {
    return text;
  }

  let out = text;
  out = out.replace(EMAIL_RE, PLACEHOLDER_PII);
  out = out.replace(PHONE_RE, PLACEHOLDER_PII);
  out = out.replace(FULL_NAME_RE, PLACEHOLDER_IDENTITY);
  out = out.replace(DOLLAR_LARGE_RE, replaceDollarIfOverThreshold);
  return out;
}

export function scrubContextWithDetection(
  text: string,
  userRole: string,
  options?: { isAdminRoute?: boolean },
): { scrubbed: string; wasRedacted: boolean; originalLength: number; scrubbedLength: number } {
  const originalLength = text.length;
  const scrubbed = scrubContext(text, userRole, options);
  const scrubbedLength = scrubbed.length;
  const wasRedacted = scrubbed !== text;
  return { scrubbed, wasRedacted, originalLength, scrubbedLength };
}

export { PLACEHOLDER_IDENTITY, PLACEHOLDER_VALUATION, PLACEHOLDER_PII };

export type PrivacyShieldLogger = (params: {
  originalLength: number;
  scrubbedLength: number;
  agentId: string | null;
}) => Promise<void>;

const noopLogger: PrivacyShieldLogger = async () => {};

/**
 * Scrub and optionally log when redaction occurs (non-leadership).
 */
export async function scrubContextForLLM(
  text: string,
  context: { userRole: string; agentId?: string | null; isAdminRoute?: boolean },
  logToAuditEvidence: PrivacyShieldLogger = noopLogger,
): Promise<string> {
  const { scrubbed, wasRedacted, originalLength, scrubbedLength } = scrubContextWithDetection(
    text,
    context.userRole,
    { isAdminRoute: context.isAdminRoute },
  );
  if (wasRedacted && (context.userRole ?? '').toUpperCase() !== LEADERSHIP_ROLE) {
    await logToAuditEvidence({
      originalLength,
      scrubbedLength,
      agentId: context.agentId ?? null,
    });
  }
  return scrubbed;
}
