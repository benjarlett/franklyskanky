/**
 * Consolidates consecutive text blocks into single blocks
 * Run with: npx tsx scripts/consolidate-blocks.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { page } from '../src/lib/server/db/schema';
import type { Block, TextBlock } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

/**
 * Merges consecutive text blocks into one
 * Preserves HR blocks as section dividers
 */
function consolidateBlocks(blocks: Block[]): Block[] {
	const result: Block[] = [];
	let currentTextContent: string[] = [];

	const flushText = () => {
		if (currentTextContent.length > 0) {
			const merged: TextBlock = {
				id: crypto.randomUUID(),
				type: 'text',
				content: currentTextContent.join('\n')
			};
			result.push(merged);
			currentTextContent = [];
		}
	};

	for (const block of blocks) {
		if (block.type === 'text') {
			// Accumulate text blocks
			currentTextContent.push((block as TextBlock).content);
		} else {
			// Non-text block - flush accumulated text first
			flushText();
			result.push(block);
		}
	}

	// Flush any remaining text
	flushText();

	return result;
}

async function consolidate() {
	console.log('Consolidating text blocks...\n');

	const pages = await db.select().from(page);

	for (const p of pages) {
		if (!p.blocks || p.blocks.length === 0) continue;

		const originalCount = p.blocks.length;
		const consolidated = consolidateBlocks(p.blocks);

		if (consolidated.length === originalCount) {
			console.log(`${p.slug}: No change (${originalCount} blocks)`);
			continue;
		}

		console.log(`${p.slug}: ${originalCount} blocks -> ${consolidated.length} blocks`);

		await db
			.update(page)
			.set({
				blocks: consolidated,
				updatedAt: new Date()
			})
			.where(eq(page.slug, p.slug));
	}

	console.log('\nDone!');
	process.exit(0);
}

consolidate().catch((err) => {
	console.error('Failed:', err);
	process.exit(1);
});
