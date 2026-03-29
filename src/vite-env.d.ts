/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_AIRTABLE_API_KEY?: string;
  readonly VITE_AIRTABLE_BASE_ID?: string;
  readonly VITE_AIRTABLE_PROFESSIONALS_TABLE?: string;
  /** Optional absolute site origin for API calls (e.g. https://spicekrewe.com). Leave empty for same-origin. */
  readonly VITE_APP_ORIGIN?: string;
  /** Stripe publishable key (client-visible; server must hold the secret key). */
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  /** POST target for your serverless handler that creates a Checkout Session and returns `{ url }`. */
  readonly VITE_STRIPE_CHECKOUT_ENDPOINT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
