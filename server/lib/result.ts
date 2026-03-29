/**
 * Server-side Result union — matches Spice Krewe client pattern (Flomisma-style).
 */

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
