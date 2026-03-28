import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://gn_app:WG0CReaHtBfgMq9v5TMfDBIB@localhost:5432/franklyskanky';
const sql = postgres(DATABASE_URL);

const updates = [
	{
		slug: 'about-me',
		description: 'The life story of Dee Jarlett — from Manchester to Bristol, through music, motherhood, and founding the Gasworks Choir.',
		ogImage: '/og-default.jpg'
	},
	{
		slug: 'my-family',
		description: "Meet Dee Jarlett's family — parents Donald and Audrey, children Ben, Joe and Amy, and the next generation of grandchildren.",
		ogImage: '/og-default.jpg'
	},
	{
		slug: 'gasworks-choir',
		description: 'The Gasworks Choir — a 150-strong community harmony choir in Bristol, founded in 1997 by Dee Jarlett and Ali Orbaum.',
		ogImage: '/og-default.jpg'
	},
	{
		slug: 'gasworks-studio',
		description: 'The Gasworks Studio in St Werburghs, Bristol — a soundproofed rehearsal space and home of the Gasworks Choir since 1994.',
		ogImage: '/og-default.jpg'
	},
	{
		slug: 'arrangements',
		description: "Dee Jarlett's vocal arrangements — songs arranged for community choirs, a cappella groups and singing workshops.",
		ogImage: '/og-default.jpg'
	},
	{
		slug: 'contact',
		description: 'Get in touch with Dee Jarlett — musician, choir director, and founder of the Gasworks Choir in Bristol.',
		ogImage: '/og-default.jpg'
	},
	{
		slug: 'links',
		description: 'Useful links — the Gasworks Choir website, Martin Solomon, and other connections from Dee Jarlett.',
		ogImage: '/og-default.jpg'
	}
];

async function update() {
	for (const u of updates) {
		const result = await sql`
			UPDATE page SET
				description = ${u.description},
				og_image = ${u.ogImage},
				updated_at = now()
			WHERE slug = ${u.slug}
		`;
		console.log(`Updated: /${u.slug} (${result.count} rows)`);
	}
	await sql.end();
	console.log('Done!');
}

update().catch((err) => {
	console.error(err);
	process.exit(1);
});
