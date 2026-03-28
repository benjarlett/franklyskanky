import { db } from '$lib/server/db';
import { menuItem } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const navItems = await db
		.select({
			id: menuItem.id,
			label: menuItem.label,
			href: menuItem.href,
			parentId: menuItem.parentId,
			order: menuItem.order
		})
		.from(menuItem)
		.where(eq(menuItem.location, 'main'))
		.orderBy(asc(menuItem.order));

	return { navItems };
};
