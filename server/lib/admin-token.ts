import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const PREFIX = 'sk_admin_v1.';

function getSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET?.trim();
}

/**
 * Mint a short-lived signed token after server-side password verification.
 */
export function mintAdminToken(): string {
  const secret = getSecret();
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }
  const exp = Date.now() + 8 * 60 * 60 * 1000;
  const payload = Buffer.from(
    JSON.stringify({ exp, n: randomBytes(8).toString('hex') }),
    'utf8',
  ).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${PREFIX}${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token?.startsWith(PREFIX)) return false;
  const rest = token.slice(PREFIX.length);
  const dot = rest.lastIndexOf('.');
  if (dot <= 0) return false;
  const payload = rest.slice(0, dot);
  const sig = rest.slice(dot + 1);
  const secret = getSecret();
  if (!secret) return false;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  try {
    const raw = Buffer.from(payload, 'base64url').toString('utf8');
    const data = JSON.parse(raw) as { exp?: number };
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function readBearerToken(authHeader: string | string[] | undefined): string | undefined {
  const h = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!h || typeof h !== 'string') return undefined;
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return m?.[1]?.trim();
}
