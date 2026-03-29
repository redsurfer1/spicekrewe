# Spice Krewe — Compliance Readiness (Flomisma-aligned)

**Scope:** `spicekrewe_NEW` data pipeline, admin operations, and hosting controls.  
**Targets referenced:** SOC 2 (audit logging, access control), ISO 27001 (information security practices), **Flomisma Gold Standard** (operational health visibility, proxy-only sensitive writes).

## 1. Row-level access & identity

| Control | Implementation |
|--------|------------------|
| **Briefs / Payments not callable from browser with PAT** | Project brief **creates** and **patches** go through `POST /api/submit-brief` and `POST /api/patch-brief` only. Server uses `AIRTABLE_SECRET_PAT` (never `VITE_*`). Client `src/lib/airtable.ts` lists **Professionals** only. |
| **Stripe secret** | `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` read **only** from `process.env` in `server/lib/checkout-session.ts` and `server/api/webhooks.ts`. |
| **Request ID audit trail** | Each brief submit returns/logs `requestId` (`X-Request-Id` / JSON). Structured JSON logs to stdout for Vercel log drains (SOC2-friendly). Stripe webhook logs `stripeEventId` + `briefId` (no card data). |

## 2. Encryption & sanitization

| Control | Implementation |
|--------|------------------|
| **Secrets** | No Stripe or Airtable **server** secrets in client bundle; `.env.example` documents server vs `VITE_*` split. |
| **XSS / injection hardening (short fields)** | `server/lib/sanitize-brief-fields.ts` normalizes **ClientName** and **ProjectTitle** before Airtable insert. |

## 3. System health (Flomisma standard)

| Surface | Behavior |
|---------|-----------|
| **`GET /api/admin/health`** | Requires `Authorization: Bearer <signed admin token>`. Returns Airtable connectivity, Stripe webhook configuration, and last brief rows with **obfuscated** titles/names. |
| **`/admin/health` UI** | `src/pages/admin/Health.tsx` — same admin session token as dashboard (`POST /api/admin/session`). |
| **Admin login** | Password verified **server-side** (`ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`); no hardcoded password in source. |

## 4. Privacy & governance

| Control | Implementation |
|--------|------------------|
| **Privacy policy** | `/privacy` route + Footer link. |
| **Consent** | Contact and newsletter UIs require explicit **data consent** checkboxes with links to `/privacy`. |

## 5. Deployment & transport

| Control | Implementation |
|--------|------------------|
| **Security headers** | `vercel.json` sets CSP (Stripe/Airtable/Gemini allowed in `connect-src`), `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`. |
| **Dependencies** | `npm audit fix` applied where non-breaking. Remaining advisories are mostly **transitive** (e.g. `@vercel/node` → `undici` / `path-to-regexp`). Track upstream `@vercel/node` releases or use `overrides` in `package.json` after regression testing — avoid blind `npm audit fix --force` on production without a build smoke test. |

## Residual risks & next steps

1. **Professionals table** still uses a `VITE_AIRTABLE_*` read token — use a **read-only Airtable PAT** scoped to that table/base only.  
2. **Admin token** is stored in `sessionStorage` — acceptable for internal ops; for stricter ISO scope, add **httpOnly cookies** + optional **TOTP** (Flomisma-style 2FA).  
3. **CSP** allows `'unsafe-inline'`/`'unsafe-eval'` for Vite/React; tighten with nonces when feasible.

---

*This document describes implemented controls as of the date in git history; it is not a legal attestation of SOC 2 or ISO 27001 certification.*
