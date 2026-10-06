export interface RandomSource {
  /** A value in [0, 1). */
  next(): number;
}
