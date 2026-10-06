import offline from '../../content/offline.json';
import shared from '../../content/shared-events.json';
import discoveries from '../../content/discoveries.json';
export { discoveries };
export type DiscoveryId = keyof typeof discoveries;

export interface OfflineEvent {
  id: string;
  text: string;
  weight: number;
  minElapsedMs: number;
  requiresBowlFilled?: boolean;
  kind?: 'general' | 'bowl' | 'shared';
  minRelation?: number;
  maxRelation?: number;
  relationshipDelta?: number;
  effects?: { berriesDelta?: number; consumeBowl?: boolean };
}
export const offlineEvents: readonly OfflineEvent[] = [...offline.events, ...shared as OfflineEvent[]];
export const offlineConfig = offline.config;

export interface ReturnReport {
  generatedAt: number;
  elapsedMs: number;
  berriesGained: number;
  eventIds: string[];
  discoveryId?: DiscoveryId;
  acknowledged: boolean;
}

export function isReturnReport(value: unknown): value is ReturnReport {
  if (!value || typeof value !== 'object') return false;
  if (!('elapsedMs' in value) || typeof value.elapsedMs !== 'number' ||
      !Number.isSafeInteger(value.elapsedMs) || value.elapsedMs < offlineConfig.thresholdMs) return false;
  const elapsedMs = value.elapsedMs;
  if ('discoveryId' in value && value.discoveryId !== 'nibi_tracks' && value.discoveryId !== 'nibi_arrival') return false;
  const arrival = 'discoveryId' in value && value.discoveryId === 'nibi_arrival';
  return 'generatedAt' in value && typeof value.generatedAt === 'number' && Number.isSafeInteger(value.generatedAt) && value.generatedAt >= 0 &&
    'berriesGained' in value && typeof value.berriesGained === 'number' && Number.isSafeInteger(value.berriesGained) && value.berriesGained >= 0 && value.berriesGained <= offlineConfig.commonBerryCap + 2 &&
    'acknowledged' in value && typeof value.acknowledged === 'boolean' &&
    'eventIds' in value && Array.isArray(value.eventIds) && (arrival ? value.eventIds.length === 0 : value.eventIds.length >= 1) &&
    value.eventIds.length <= (elapsedMs < offlineConfig.twoEventThresholdMs ? 1 : 2) &&
    new Set(value.eventIds).size === value.eventIds.length &&
    value.eventIds.filter((id) => offlineEvents.find((event) => event.id === id)?.kind === 'shared').length <= 1 &&
    value.eventIds.every((id) => offlineEvents.some((event) => event.id === id && event.minElapsedMs <= elapsedMs));
}
