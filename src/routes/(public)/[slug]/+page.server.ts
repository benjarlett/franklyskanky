import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { page } from '$lib/server/db/schema';
import type { Page } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }): Promise<{ page: Page }> => {
	const [pageData] = await db
		.select()
		.from(page)
		.where(eq(page.slug, params.slug))
		.limit(1);

	if (!pageData || !pageData.published) {
		error(404, 'Page not found');
	}

	return { page: pageData };
};
