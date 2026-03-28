import { db } from '$lib/server/db';
import { page, menuItem } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [pageData, homeMenuItems] = await Promise.all([
		db
			.select()
			.from(page)
			.where(eq(page.slug, 'home'))
			.limit(1)
			.then((rows) => rows[0]),
		db
			.select({
				id: menuItem.id,
				label: menuItem.label,
				href: menuItem.href,
				order: menuItem.order
			})
			.from(menuItem)
			.where(eq(menuItem.location, 'homepage'))
			.orderBy(asc(menuItem.order))
	]);

	if (!pageData || !pageData.published) {
		error(404, 'Home page not found');
	}

	return { page: pageData, homeMenu: homeMenuItems };
};
