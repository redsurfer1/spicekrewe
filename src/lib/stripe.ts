/**
 * Spice Krewe — Stripe Checkout handshake (client only).
 * Session creation with the secret key must run on your serverless/backend endpoint.
 * Pattern: Flomisma-style Result union + defensive fetch (escrow-service shape).
 */

import type { Result } from './types/results';

const CHECKOUT_TIMEOUT_MS = 25_000;

function getPublishableKey(): string | undefined {
  return import.meta.env.VITE_STRIPE_PUBLIC_KEY?.trim() || undefined;
}

function getCheckoutEndpoint(): string | undefined {
  return import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT_URL?.trim() || undefined;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise
      .then((v) => {
        window.clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        window.clearTimeout(t);
        reject(e instanceof Error ? e : new Error(String(e)));
      });
  });
}

type CheckoutEndpointBody = {
  briefId: string;
  amountUsd: number;
  stripePublishableKey: string;
  /** Flat string pairs for Stripe Checkout `metadata` (server maps to session). */
  metadata: Record<string, string>;
};

/**
 * Ask the backend to create a Stripe Checkout Session and return the hosted URL.
 * Expected successful JSON: `{ "url": "https://checkout.stripe.com/..." }` or `{ "checkoutUrl": "..." }`.
 */
export async function createCheckoutSession(
  briefId: string,
  amount: number,
  metadata: Record<string, string> = {},
): Promise<Result<string, Error>> {
  const publishableKey = getPublishableKey();
  if (!publishableKey) {
    return { success: false, error: new Error('Stripe publishable key is not configured (VITE_STRIPE_PUBLIC_KEY)') };
  }

  const endpoint = getCheckoutEndpoint();
  if (!endpoint) {
    return {
      success: false,
      error: new Error('Stripe checkout API URL is not configured (VITE_STRIPE_CHECKOUT_ENDPOINT_URL)'),
    };
  }

  if (!briefId.trim()) {
    return { success: false, error: new Error('briefId is required for checkout') };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: new Error('amount must be a positive number (USD)') };
  }

  const body: CheckoutEndpointBody = {
    briefId: briefId.trim(),
    amountUsd: amount,
    stripePublishableKey: publishableKey,
    metadata: { ...metadata, briefId: briefId.trim() },
  };

  try {
    const res = await withTimeout(
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      }),
      CHECKOUT_TIMEOUT_MS,
      'Stripe checkout request',
    );

    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      return {
        success: false,
        error: new Error(
          res.ok
            ? 'Checkout endpoint returned non-JSON'
            : `Checkout failed (${res.status}): ${text.slice(0, 200)}`,
        ),
      };
    }

    if (!res.ok) {
      const msg =
        typeof json === 'object' && json !== null && 'error' in json
          ? String((json as { error?: unknown }).error)
          : text.slice(0, 200);
      return { success: false, error: new Error(`Checkout ${res.status}: ${msg || res.statusText}`) };
    }

    const url =
      typeof json === 'object' && json !== null
        ? (json as { url?: unknown; checkoutUrl?: unknown }).url ??
          (json as { checkoutUrl?: unknown }).checkoutUrl
        : undefined;

    if (typeof url !== 'string' || !url.startsWith('http')) {
      return { success: false, error: new Error('Checkout endpoint did not return a valid URL') };
    }

    return { success: true, data: url };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err };
  }
}
