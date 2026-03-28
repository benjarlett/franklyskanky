import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { page } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function show() {
	const slug = process.argv[2] || 'about';
	const [p] = await db.select().from(page).where(eq(page.slug, slug));

	if (!p) {
		console.log('Page not found');
		process.exit(1);
	}

	console.log(`\n=== ${p.slug} ===\n`);
	p.blocks?.forEach((block, i) => {
		console.log(`--- Block ${i} (${block.type}) ---`);
		if (block.type === 'text') {
			console.log(block.content.substring(0, 200) + (block.content.length > 200 ? '...' : ''));
		} else {
			console.log(JSON.stringify(block, null, 2));
		}
		console.log();
	});

	process.exit(0);
}

show();
