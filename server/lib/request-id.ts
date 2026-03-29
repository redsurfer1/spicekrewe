import { randomBytes } from 'node:crypto';

/** SOC2-style correlation id for serverless audit logs (Vercel / stdout). */
export function createRequestId(): string {
  return `req_${randomBytes(12).toString('hex')}`;
}
