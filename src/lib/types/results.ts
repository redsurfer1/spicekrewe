/**
 * Discriminated result union — same pattern as Flomisma escrow services.
 * Use for domain lookups and API-style success/failure without throwing.
 */

export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };
