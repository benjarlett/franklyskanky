import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Lazy initialisation — DB is only required when admin routes are active.
// Static pages work without DATABASE_URL; set it when wiring up /admin.
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
	if (_db) return _db;
	if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
	const client = postgres(env.DATABASE_URL);
	_db = drizzle(client, { schema });
	return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(_target, prop) {
		return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
	}
});
