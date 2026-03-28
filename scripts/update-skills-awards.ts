import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { page } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Block } from '../src/lib/server/db/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

// New skills blocks to add
const skillsBlocks: Block[] = [
	{
		id: crypto.randomUUID(),
		type: 'skills',
		title: 'Professional Skills',
		items: ['Director', 'CTO', 'Senior Management', 'Product Owner', 'Agile Leadership']
	},
	{
		id: crypto.randomUUID(),
		type: 'skills',
		title: 'Technical Proficiencies',
		items: [
			'ES6/TypeScript',
			'Python',
			'Go',
			'PHP',
			'C++',
			'Svelte',
			'UX/UI',
			'SCORM/cmi5',
			'AI',
			'Pydantic/FastAPI',
			'Postgres',
			'Graph/NoSQL',
			'AWS/Google Cloud',
			'Docker'
		]
	},
	{
		id: crypto.randomUUID(),
		type: 'skills',
		title: 'Music & Audio',
		items: ['A/V Engineering', 'Musician', 'Acoustics Engineering']
	},
	{
		id: crypto.randomUUID(),
		type: 'skills',
		title: 'Psychology & Philosophy',
		items: ['Psychosynthesis', 'Cognitive Science', 'Life Coaching']
	}
];

// Awards block with images
const awardsBlock: Block = {
	id: crypto.randomUUID(),
	type: 'awards',
	title: 'Education & Awards',
	items: [
		{ imageUrl: '/img/awards/brunel-university.webp', label: 'MSc Psychological Sciences' },
		{ imageUrl: '/img/awards/psychosynthesis-trust.svg', label: 'Psychosynthesis Diploma' },
		{ imageUrl: '/img/awards/nimble-business-awards-2017.webp', label: 'Nimble: Business Award (2017)' },
		{
			imageUrl: '/img/awards/nimble-stroud-awards-2017.webp',
			label: 'Nimble: Stroud Business Award (2017)'
		},
		{
			imageUrl: '/img/awards/bristol-business-college.webp',
			label: 'Senior Management Training Programme'
		},
		{ imageUrl: '/img/awards/bath-spa-university.webp', label: 'MA Creative Music Technology' },
		{ imageUrl: '/img/awards/salford-university.webp', label: 'BSc Music, Acoustics & Recording' }
	]
};

async function updatePage(slug: string) {
	console.log(`\nUpdating ${slug} page...`);

	// Get current page
	const [currentPage] = await db.select().from(page).where(eq(page.slug, slug));

	if (!currentPage) {
		console.log(`Page "${slug}" not found`);
		return;
	}

	const blocks = currentPage.blocks || [];
	console.log(`Current blocks: ${blocks.length}`);

	// Find where to insert - look for the "Skills & Awards" h2 section
	// We'll find the text block containing "Skills & Awards" and replace everything after it
	let skillsIndex = -1;
	let ctaIndex = -1;

	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];
		if (block.type === 'text' && (block.content.includes('Skills & Awards') || block.content.includes('Skills &amp; Awards'))) {
			skillsIndex = i;
		}
		// Find the CTA block at the end (the "About Me →" or "Services →" link)
		if (block.type === 'cta') {
			ctaIndex = i;
		}
	}

	if (skillsIndex === -1) {
		console.log('Could not find Skills & Awards section');
		// List all text block contents for debugging
		blocks.forEach((b, i) => {
			if (b.type === 'text') {
				console.log(`  Block ${i}: ${b.content.substring(0, 100)}...`);
			}
		});
		return;
	}

	console.log(`Found Skills section at index ${skillsIndex}`);
	console.log(`Found CTA at index ${ctaIndex}`);

	// Keep everything before Skills section, then add our new blocks, then the final CTA
	const beforeSkills = blocks.slice(0, skillsIndex);

	// Add the h2 heading for Skills & Awards
	const skillsHeading: Block = {
		id: crypto.randomUUID(),
		type: 'text',
		content: '<h2>Skills & Awards</h2>'
	};

	// Build new blocks array
	const newBlocks: Block[] = [
		...beforeSkills,
		skillsHeading,
		...skillsBlocks,
		awardsBlock,
		// Keep the final CTA if it exists
		...(ctaIndex !== -1 ? [blocks[ctaIndex]] : [])
	];

	console.log(`New blocks: ${newBlocks.length}`);

	// Update the page
	await db.update(page).set({ blocks: newBlocks }).where(eq(page.slug, slug));

	console.log(`✓ Updated ${slug}`);
}

async function main() {
	try {
		// Update both about and home pages (they both have Skills & Awards sections)
		await updatePage('about');
		await updatePage('home');
		console.log('\nDone!');
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await client.end();
	}
}

main();
