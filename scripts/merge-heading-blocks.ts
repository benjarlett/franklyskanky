/**
 * Merges HeadingBlock + TextBlock sequences into single TextBlocks
 * Run with: npx tsx scripts/merge-heading-blocks.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { page } from '../src/lib/server/db/schema';
import type { Block, TextBlock, HeadingBlock } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

function mergeBlocks(blocks: Block[]): Block[] {
	const result: Block[] = [];
	let i = 0;

	while (i < blocks.length) {
		const current = blocks[i];

		// If it's a heading block, convert to text and try to merge with following text
		if (current.type === 'heading') {
			const heading = current as HeadingBlock;
			const headingHtml = `<h${heading.level}>${heading.text}</h${heading.level}>`;

			// Check if next block is text - merge them
			const next = blocks[i + 1];
			if (next && next.type === 'text') {
				const textBlock = next as TextBlock;
				const mergedBlock: TextBlock = {
					id: crypto.randomUUID(),
					type: 'text',
					content: headingHtml + '\n' + textBlock.content
				};
				result.push(mergedBlock);
				i += 2; // Skip both blocks
			} else {
				// Just convert heading to text block
				const textBlock: TextBlock = {
					id: crypto.randomUUID(),
					type: 'text',
					content: headingHtml
				};
				result.push(textBlock);
				i += 1;
			}
		} else {
			// Keep other blocks as-is
			result.push(current);
			i += 1;
		}
	}

	return result;
}

async function migrate() {
	console.log('Merging heading blocks into text blocks...\n');

	const pages = await db.select().from(page);

	for (const p of pages) {
		if (!p.blocks || p.blocks.length === 0) continue;

		const headingCount = p.blocks.filter((b) => b.type === 'heading').length;
		if (headingCount === 0) {
			console.log(`${p.slug}: No headings to merge`);
			continue;
		}

		const originalCount = p.blocks.length;
		const merged = mergeBlocks(p.blocks);

		console.log(`${p.slug}: ${originalCount} blocks -> ${merged.length} blocks`);

		await db
			.update(page)
			.set({
				blocks: merged,
				updatedAt: new Date()
			})
			.where(eq(page.slug, p.slug));
	}

	console.log('\nDone!');
	process.exit(0);
}

migrate().catch((err) => {
	console.error('Failed:', err);
	process.exit(1);
});
