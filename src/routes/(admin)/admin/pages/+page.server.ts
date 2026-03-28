import { db } from '$lib/server/db';
import { page } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const pages = await db
		.select({
			slug: page.slug,
			title: page.title,
			published: page.published,
			updatedAt: page.updatedAt
		})
		.from(page)
		.orderBy(desc(page.updatedAt));

	return { pages };
};
