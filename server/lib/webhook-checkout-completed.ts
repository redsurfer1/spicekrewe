import type Stripe from 'stripe';
import type { Result } from './result';
import { getBriefRecord, isBriefMarkedPaid, patchBriefRecord } from './airtable-brief';

function alreadyProcessedEvent(fields: Record<string, unknown>, stripeEventId: string): boolean {
  const prev = fields.StripeLastWebhookEventId ?? fields.stripeLastWebhookEventId;
  return typeof prev === 'string' && prev === stripeEventId;
}

/**
 * Apply Airtable updates for a completed Checkout session.
 * Idempotent: skips duplicate Stripe event deliveries and already-paid briefs.
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  stripeEventId: string,
): Promise<Result<{ skipped: boolean; briefId: string }, Error>> {
  const briefId = session.client_reference_id?.trim();
  if (!briefId) {
    return { success: false, error: new Error('Missing client_reference_id on Checkout Session') };
  }

  if (session.payment_status !== 'paid') {
    return { success: true, data: { skipped: true, briefId } };
  }

  const existing = await getBriefRecord(briefId);
  if (!existing.success) {
    return existing;
  }

  const fields = existing.data.fields as Record<string, unknown>;

  if (alreadyProcessedEvent(fields, stripeEventId)) {
    return { success: true, data: { skipped: true, briefId } };
  }

  if (isBriefMarkedPaid(fields)) {
    return { success: true, data: { skipped: true, briefId } };
  }

  const withEventId = await patchBriefRecord(briefId, {
    PaymentStatus: 'Paid',
    IsActive: true,
    StripeLastWebhookEventId: stripeEventId,
  });

  if (withEventId.success) {
    return { success: true, data: { skipped: false, briefId } };
  }

  const fallback = await patchBriefRecord(briefId, {
    PaymentStatus: 'Paid',
    IsActive: true,
  });

  if (!fallback.success) {
    return fallback;
  }

  return { success: true, data: { skipped: false, briefId } };
}
