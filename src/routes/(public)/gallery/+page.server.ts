import { db } from '$lib/server/db';
import { page } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [pageData] = await db.select().from(page).where(eq(page.slug, 'gallery')).limit(1);

	if (!pageData || !pageData.published) {
		error(404, 'Gallery not found');
	}

	return { page: pageData };
};
