import offline from '../../content/offline.json';

export interface OfflineEvent {
  id: string;
  text: string;
  weight: number;
  minElapsedMs: number;
  requiresBowlFilled?: boolean;
  effects?: { berriesDelta?: number; consumeBowl?: boolean };
}
export const offlineEvents: readonly OfflineEvent[] = offline.events;
export const offlineConfig = offline.config;

export interface ReturnReport {
  generatedAt: number;
  elapsedMs: number;
  berriesGained: number;
  eventIds: string[];
  acknowledged: boolean;
}

export function isReturnReport(value: unknown): value is ReturnReport {
  if (!value || typeof value !== 'object') return false;
  if (!('elapsedMs' in value) || typeof value.elapsedMs !== 'number' ||
      !Number.isSafeInteger(value.elapsedMs) || value.elapsedMs < offlineConfig.thresholdMs) return false;
  const elapsedMs = value.elapsedMs;
  return 'generatedAt' in value && typeof value.generatedAt === 'number' && Number.isSafeInteger(value.generatedAt) && value.generatedAt >= 0 &&
    'berriesGained' in value && typeof value.berriesGained === 'number' && Number.isSafeInteger(value.berriesGained) && value.berriesGained >= 0 && value.berriesGained <= offlineConfig.commonBerryCap + 2 &&
    'acknowledged' in value && typeof value.acknowledged === 'boolean' &&
    'eventIds' in value && Array.isArray(value.eventIds) && value.eventIds.length >= 1 &&
    value.eventIds.length <= (elapsedMs < offlineConfig.twoEventThresholdMs ? 1 : 2) &&
    new Set(value.eventIds).size === value.eventIds.length &&
    value.eventIds.every((id) => offlineEvents.some((event) => event.id === id && event.minElapsedMs <= elapsedMs));
}
