/**
 * Extracts embedded <div class="section"> HTML into proper section blocks
 * Run with: npx tsx scripts/extract-sections.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { page } from '../src/lib/server/db/schema';
import type { Block, TextBlock, SectionBlock } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

/**
 * Parse a single <div class="section"> or <div class="section flip"> and extract data
 */
function parseSectionDiv(html: string): SectionBlock | null {
	// Check if it's a section div
	const sectionMatch = html.match(/<div\s+class="section(\s+flip)?">/i);
	if (!sectionMatch) return null;

	const flip = !!sectionMatch[1];

	// Extract image
	const imgMatch = html.match(/<img\s+[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/i) ||
		html.match(/<img\s+[^>]*alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/i);

	let imageUrl = '';
	let imageAlt = '';
	if (imgMatch) {
		// Handle both src/alt orders
		if (html.indexOf('src=') < html.indexOf('alt=')) {
			imageUrl = imgMatch[1];
			imageAlt = imgMatch[2];
		} else {
			imageAlt = imgMatch[1];
			imageUrl = imgMatch[2];
		}
	}

	// Extract title from h3
	const titleMatch = html.match(/<h3[^>]*>([^<]+)<\/h3>/i);
	const title = titleMatch ? titleMatch[1].trim() : undefined;

	// Extract content - everything in section-content div after the h3
	let content = '';
	const contentMatch = html.match(/<div\s+class="section-content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
	if (contentMatch) {
		content = contentMatch[1];
		// Remove the h3 from content since we extracted it as title
		content = content.replace(/<h3[^>]*>[^<]*<\/h3>/i, '').trim();
	}

	return {
		id: crypto.randomUUID(),
		type: 'section',
		imageUrl,
		imageAlt,
		title,
		content,
		flip
	};
}

/**
 * Process a text block and extract any section divs into separate blocks
 */
function processTextBlock(block: TextBlock): Block[] {
	const result: Block[] = [];
	let remaining = block.content;

	// Pattern to match section divs (non-greedy)
	const sectionPattern = /<div\s+class="section(?:\s+flip)?"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;

	let lastIndex = 0;
	let match;

	while ((match = sectionPattern.exec(block.content)) !== null) {
		// Add any text before this section
		const before = block.content.slice(lastIndex, match.index).trim();
		if (before) {
			result.push({
				id: crypto.randomUUID(),
				type: 'text',
				content: before
			});
		}

		// Parse and add the section
		const section = parseSectionDiv(match[0]);
		if (section) {
			result.push(section);
		}

		lastIndex = match.index + match[0].length;
	}

	// Add any remaining text after the last section
	const after = block.content.slice(lastIndex).trim();
	if (after) {
		result.push({
			id: crypto.randomUUID(),
			type: 'text',
			content: after
		});
	}

	// If no sections found, return original block
	if (result.length === 0) {
		return [block];
	}

	return result;
}

async function migrate() {
	console.log('Extracting section divs into proper blocks...\n');

	const pages = await db.select().from(page);

	for (const p of pages) {
		if (!p.blocks || p.blocks.length === 0) continue;

		const newBlocks: Block[] = [];
		let changed = false;

		for (const block of p.blocks) {
			if (block.type === 'text' && block.content.includes('class="section')) {
				const extracted = processTextBlock(block as TextBlock);
				if (extracted.length > 1 || extracted[0] !== block) {
					changed = true;
					newBlocks.push(...extracted);
					console.log(`  ${p.slug}: Extracted ${extracted.filter(b => b.type === 'section').length} section(s)`);
				} else {
					newBlocks.push(block);
				}
			} else {
				newBlocks.push(block);
			}
		}

		if (changed) {
			console.log(`${p.slug}: ${p.blocks.length} blocks -> ${newBlocks.length} blocks`);

			await db
				.update(page)
				.set({
					blocks: newBlocks,
					updatedAt: new Date()
				})
				.where(eq(page.slug, p.slug));
		} else {
			console.log(`${p.slug}: No sections to extract`);
		}
	}

	console.log('\nDone!');
	process.exit(0);
}

migrate().catch((err) => {
	console.error('Failed:', err);
	process.exit(1);
});
