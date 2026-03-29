/**
 * Server-only Airtable integration barrel.
 * Briefs / payment-linked rows MUST be read or written only from `api/*` routes
 * using `AIRTABLE_SECRET_PAT` — never expose PAT to the browser.
 */
export * from './airtable-brief';
export * from './request-id';
