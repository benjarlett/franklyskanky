import { db } from '$lib/server/db';
import { page } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const pages = await db
		.select({ slug: page.slug, updatedAt: page.updatedAt })
		.from(page)
		.where(eq(page.published, true));

	const staticRoutes = [
		{ path: '/sounds', priority: '0.7' },
		{ path: '/news', priority: '0.6' },
	];

	const base = 'https://franklyskanky.co.uk';

	const urls = [
		// Homepage first
		`<url><loc>${base}/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>`,

		// DB pages
		...pages
			.filter(p => p.slug !== 'home')
			.map(p => {
				const loc = `${base}/${p.slug}`;
				const lastmod = p.updatedAt ? p.updatedAt.toISOString().split('T')[0] : '';
				return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<priority>0.8</priority><changefreq>monthly</changefreq></url>`;
			}),

		// Static routes not in DB
		...staticRoutes.map(r =>
			`<url><loc>${base}${r.path}</loc><priority>${r.priority}</priority><changefreq>monthly</changefreq></url>`
		),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
