export const clampRelationship = (value: number): number => Math.max(0, Math.min(5, Math.trunc(value)));
export const applyRelationshipDelta = (value: number, delta: number): number => clampRelationship(value + delta);
export function relationshipLabel(value: number): string {
  const clamped = clampRelationship(value);
  if (clamped === 0) return 'Si stanno studiando';
  if (clamped <= 2) return 'Si stanno abituando';
  if (clamped <= 4) return 'Si cercano';
  return 'Amici';
}
