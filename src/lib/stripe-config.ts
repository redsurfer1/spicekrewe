/**
 * Client-side Stripe readiness (publishable key + checkout API URL).
 * Missing either value disables Featured checkout without throwing.
 */
export function isClientStripeCheckoutEnabled(): boolean {
  const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY?.trim();
  const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT_URL?.trim();
  return Boolean(pk && endpoint);
}
