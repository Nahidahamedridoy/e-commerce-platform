/**
 * Utility for conditional className combination without extra dependencies.
 */
export function cn(...inputs: unknown[]): string {
  return inputs.filter(Boolean).join(" ");
}
