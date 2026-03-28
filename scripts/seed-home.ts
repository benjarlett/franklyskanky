import { config } from 'dotenv';
config({ path: '.env.local' });
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { page, menuItem } from '../src/lib/server/db/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function seed() {
	// Insert home page if it doesn't exist
	const existing = await db.select().from(page).where(eq(page.slug, 'home')).limit(1);

	if (existing.length === 0) {
		await db.insert(page).values({
			slug: 'home',
			title: 'Welcome',
			description: "Welcome to Dee Jarlett's website — home of the Gasworks Studio, Gasworks Choir, and more.",
			blocks: [
				{
					id: crypto.randomUUID(),
					type: 'text',
					content:
						"<h1>Welcome</h1><p>Hello! I'm Dee Jarlett — musician, choir director, and founder of the Gasworks Studio in Bristol. Have a look around and find out what I've been up to.</p>"
				}
			],
			published: true
		});
		console.log('Inserted home page');
	} else {
		console.log('Home page already exists, skipping');
	}

	// Insert homepage menu items (the sidebar links)
	const existingMenu = await db
		.select()
		.from(menuItem)
		.where(eq(menuItem.location, 'homepage'))
		.limit(1);

	if (existingMenu.length === 0) {
		const homepageLinks = [
			{ label: 'Gasworks Choir', href: '/gasworks-choir', order: 0 },
			{ label: 'Gasworks Studio', href: '/gasworks-studio', order: 1 },
			{ label: 'About Me', href: '/about-me', order: 2 },
			{ label: 'My Family', href: '/my-family', order: 3 },
			{ label: 'Arrangements', href: '/arrangements', order: 4 },
			{ label: 'Get in Touch', href: '/contact', order: 5 }
		];

		await db
			.insert(menuItem)
			.values(homepageLinks.map((i) => ({ ...i, location: 'homepage' })));
		console.log(`Inserted ${homepageLinks.length} homepage menu items`);
	} else {
		console.log('Homepage menu items already exist, skipping');
	}

	await client.end();
}

seed().catch(console.error);
