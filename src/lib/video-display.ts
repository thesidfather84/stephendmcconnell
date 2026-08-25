/**
 * Some MediaItem fields (dateLabel, durationLabel, note, etc.) carry internal
 * research/verification context that's useful in src/data/media.ts but must
 * never reach the public UI. This strips a trailing parenthetical annotation
 * and blanks out values that are internal notes through and through.
 */
export function publicVideoLabel(text?: string): string | undefined {
  if (!text) return undefined;
  if (/^not confirmed/i.test(text)) return undefined;
  const cleaned = text.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return cleaned.length > 0 ? cleaned : undefined;
}
