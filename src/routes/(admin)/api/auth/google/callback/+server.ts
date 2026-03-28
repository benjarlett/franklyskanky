import { error, redirect } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { getGoogle, isAllowedEmail } from '$lib/server/admin-auth';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

interface GoogleUser {
	sub: string;
	name?: string;
	email: string;
	email_verified: boolean;
	picture?: string;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	const google = getGoogle(url.origin);

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state');
	const storedCodeVerifier = cookies.get('google_oauth_code_verifier');

	// Clean up cookies
	cookies.delete('google_oauth_state', { path: '/' });
	cookies.delete('google_oauth_code_verifier', { path: '/' });

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		error(400, 'Invalid OAuth state');
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

		const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: { Authorization: `Bearer ${tokens.accessToken()}` }
		});
		const googleUser = (await response.json()) as GoogleUser;

		if (!googleUser.email || !googleUser.email_verified) {
			error(400, 'Email not verified by Google');
		}

		if (!isAllowedEmail(googleUser.email)) {
			error(403, 'You are not authorised to access the admin area');
		}

		// Find or create user
		const [existing] = await db
			.select()
			.from(user)
			.where(eq(user.email, googleUser.email.toLowerCase()))
			.limit(1);

		let userId: string;
		if (existing) {
			userId = existing.id;
		} else {
			userId = googleUser.sub;
			await db.insert(user).values({
				id: userId,
				email: googleUser.email.toLowerCase(),
				name: googleUser.name ?? null
			});
		}

		// Create session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		cookies.set(auth.sessionCookieName, sessionToken, {
			expires: session.expiresAt,
			path: '/'
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			error(400, 'Invalid authorization code');
		}
		throw e;
	}

	redirect(302, '/admin');
};
