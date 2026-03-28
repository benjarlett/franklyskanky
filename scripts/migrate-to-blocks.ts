/**
 * Migration script to convert legacy HTML content to blocks
 *
 * This script reads pages with legacyContent and converts them to block format.
 * Run with: npx tsx scripts/migrate-to-blocks.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { page } from '../src/lib/server/db/schema';
import type { Block, TextBlock, HeadingBlock, HRBlock } from '../src/lib/server/db/schema';
import { eq, isNotNull } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

/**
 * Simple HTML to blocks converter
 * This handles common patterns - may need refinement for complex content
 */
function htmlToBlocks(html: string): Block[] {
	const blocks: Block[] = [];

	// Split by major block elements
	const parts = html.split(/(<h[1-3][^>]*>.*?<\/h[1-3]>|<hr\s*\/?>)/gi);

	for (const part of parts) {
		const trimmed = part.trim();
		if (!trimmed) continue;

		// Check for headings
		const headingMatch = trimmed.match(/<h([1-3])[^>]*>(.*?)<\/h[1-3]>/i);
		if (headingMatch) {
			const level = parseInt(headingMatch[1]) as 1 | 2 | 3;
			const text = headingMatch[2].replace(/<[^>]+>/g, '').trim();
			const headingBlock: HeadingBlock = {
				id: crypto.randomUUID(),
				type: 'heading',
				level,
				text
			};
			blocks.push(headingBlock);
			continue;
		}

		// Check for HR
		if (/<hr\s*\/?>/i.test(trimmed)) {
			const hrBlock: HRBlock = {
				id: crypto.randomUUID(),
				type: 'hr'
			};
			blocks.push(hrBlock);
			continue;
		}

		// Everything else is text content
		if (trimmed.length > 0) {
			// Wrap in paragraph if not already wrapped
			let content = trimmed;
			if (!content.startsWith('<')) {
				content = `<p>${content}</p>`;
			}

			const textBlock: TextBlock = {
				id: crypto.randomUUID(),
				type: 'text',
				content
			};
			blocks.push(textBlock);
		}
	}

	return blocks;
}

async function migrate() {
	console.log('Starting migration...\n');

	// Get all pages with legacy content
	const pages = await db
		.select()
		.from(page)
		.where(isNotNull(page.legacyContent));

	console.log(`Found ${pages.length} pages with legacy content\n`);

	for (const p of pages) {
		console.log(`Processing: ${p.slug}`);

		if (!p.legacyContent) {
			console.log('  - No legacy content, skipping\n');
			continue;
		}

		// Skip if already has blocks
		if (p.blocks && p.blocks.length > 0) {
			console.log('  - Already has blocks, skipping\n');
			continue;
		}

		const blocks = htmlToBlocks(p.legacyContent);
		console.log(`  - Converted to ${blocks.length} blocks`);

		// Update the page
		await db
			.update(page)
			.set({
				blocks,
				updatedAt: new Date()
			})
			.where(eq(page.slug, p.slug));

		console.log('  - Saved\n');
	}

	console.log('Migration complete!');
	process.exit(0);
}

migrate().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
