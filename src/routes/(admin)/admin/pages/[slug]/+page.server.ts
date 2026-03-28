import { db } from '$lib/server/db';
import { page } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Block } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const [pageData] = await db.select().from(page).where(eq(page.slug, params.slug)).limit(1);

	if (!pageData) {
		error(404, 'Page not found');
	}

	return {
		page: pageData
	};
};

export const actions: Actions = {
	save: async ({ params, request }) => {
		const formData = await request.formData();
		const blocksJson = formData.get('blocks') as string;
		const title = formData.get('title') as string;
		const newSlug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
		const description = formData.get('description') as string | null;
		const ogImage = formData.get('ogImage') as string | null;

		if (!blocksJson) {
			return fail(400, { error: 'Missing blocks data' });
		}

		if (!newSlug) {
			return fail(400, { error: 'Slug is required' });
		}

		let blocks: Block[];
		try {
			blocks = JSON.parse(blocksJson);
		} catch {
			return fail(400, { error: 'Invalid blocks JSON' });
		}

		// Check if slug changed and new slug isn't taken
		if (newSlug !== params.slug) {
			const [existing] = await db.select().from(page).where(eq(page.slug, newSlug)).limit(1);
			if (existing) {
				return fail(400, { error: `Slug "${newSlug}" is already in use` });
			}
		}

		await db
			.update(page)
			.set({
				slug: newSlug,
				blocks,
				title,
				description: description || null,
				ogImage: ogImage || null,
				updatedAt: new Date()
			})
			.where(eq(page.slug, params.slug));

		// If slug changed, redirect to the new URL
		if (newSlug !== params.slug) {
			redirect(303, `/admin/pages/${newSlug}`);
		}

		return { success: true };
	}
};
