import { db } from '$lib/server/db';
import { menuItem, page } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { MENU_LOCATIONS, type MenuLocation } from '$lib/menu-locations';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const location = (url.searchParams.get('location') || 'main') as MenuLocation;

	const [items, pages] = await Promise.all([
		db
			.select()
			.from(menuItem)
			.where(eq(menuItem.location, location))
			.orderBy(asc(menuItem.order)),
		db
			.select({ slug: page.slug, title: page.title })
			.from(page)
			.orderBy(asc(page.title))
	]);

	return { items, pages, location, locations: MENU_LOCATIONS };
};

export const actions: Actions = {
	save: async ({ request, url }) => {
		const location = (url.searchParams.get('location') || 'main') as MenuLocation;
		const formData = await request.formData();
		const itemsJson = formData.get('items') as string;

		if (!itemsJson) {
			return fail(400, { error: 'Missing items data' });
		}

		let items: Array<{ id?: number; label: string; href: string; parentId: number | null; order: number }>;
		try {
			items = JSON.parse(itemsJson);
		} catch {
			return fail(400, { error: 'Invalid JSON' });
		}

		// Delete all existing items for this location, then re-insert
		await db.delete(menuItem).where(eq(menuItem.location, location));

		if (items.length > 0) {
			await db.insert(menuItem).values(
				items.map((item, i) => ({
					location,
					label: item.label,
					href: item.href,
					parentId: item.parentId || null,
					order: i
				}))
			);
		}

		return { success: true };
	}
};
