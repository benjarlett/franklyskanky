import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://gn_app:WG0CReaHtBfgMq9v5TMfDBIB@localhost:5432/franklyskanky';
const sql = postgres(DATABASE_URL);

const page = {
	slug: 'arrangements',
	title: 'Arrangements',
	description: "Dee Jarlett's vocal arrangements — songs arranged for community choirs, a cappella groups and singing workshops.",
	ogImage: '/og-default.jpg',
	blocks: [
		{
			id: crypto.randomUUID(),
			type: 'text',
			content:
				"<h1>Arrangements</h1><p>I'm in the process of adding these. Please check back soon.</p>"
		}
	]
};

async function seed() {
	await sql`
		INSERT INTO page (slug, title, description, og_image, blocks, published, created_at, updated_at)
		VALUES (${page.slug}, ${page.title}, ${page.description}, ${page.ogImage}, ${sql.json(page.blocks)}, true, now(), now())
		ON CONFLICT (slug) DO UPDATE SET
			title = EXCLUDED.title,
			description = EXCLUDED.description,
			og_image = EXCLUDED.og_image,
			blocks = EXCLUDED.blocks,
			updated_at = now()
	`;
	console.log(`Seeded: /${page.slug}`);
	await sql.end();
	console.log('Done!');
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
