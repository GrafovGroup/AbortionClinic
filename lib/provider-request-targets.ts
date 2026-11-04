import {providers} from './providers';

export function requestTarget(value: unknown) {
  if (value === undefined || value === '' || value === null) return undefined;
  const provider = providers.find(item => item.id === value);
  if (!provider) throw new Error('Unknown listing');
  return provider;
}

// Older deployments already have provider_requests. Cascading removal preserves
// its existing 90-day retention for the optional listing context as well.
export async function prepareRequestTargets(db: D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS provider_request_targets (
    request_id TEXT PRIMARY KEY NOT NULL REFERENCES provider_requests(id) ON DELETE CASCADE,
    provider_id TEXT NOT NULL,
    provider_name TEXT NOT NULL
  )`).run();
}
