import { redirect, fail } from '@sveltejs/kit';
import { isAllowedEmail } from '$lib/server/admin-auth';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && isAllowedEmail(locals.user.email)) {
		redirect(302, '/admin');
	}
};

export const actions: Actions = {
	password: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		if (
			!username || !password ||
			username !== env.ADMIN_USER ||
			password !== env.ADMIN_PASS
		) {
			return fail(400, { error: 'Invalid username or password' });
		}

		// Find or create admin user in DB
		const adminEmail = `${env.ADMIN_USER}@admin.local`;
		let [user] = await db.select().from(table.user).where(eq(table.user.email, adminEmail));

		if (!user) {
			const [created] = await db.insert(table.user).values({
				id: crypto.randomUUID(),
				email: adminEmail,
				name: env.ADMIN_USER
			}).returning();
			user = created;
		}

		const token = generateSessionToken();
		const session = await createSession(token, user.id);
		setSessionTokenCookie({ cookies } as any, token, session.expiresAt);

		redirect(302, '/admin');
	}
};
