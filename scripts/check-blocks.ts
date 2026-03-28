import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { page } from '../src/lib/server/db/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function check() {
	const pages = await db.select().from(page);
	for (const p of pages) {
		console.log(`\n=== ${p.slug} ===`);
		console.log(`Blocks: ${p.blocks?.length ?? 0}`);
		if (p.blocks) {
			const types = p.blocks.map((b) => b.type);
			const counts: Record<string, number> = {};
			types.forEach((t) => (counts[t] = (counts[t] || 0) + 1));
			console.log('Types:', counts);
		}
	}
	process.exit(0);
}
check();
