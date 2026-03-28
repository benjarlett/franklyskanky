import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { getGoogle } from '$lib/server/admin-auth';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const google = getGoogle(url.origin);
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const authUrl = google.createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile']);

	cookies.set('google_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});
	cookies.set('google_oauth_code_verifier', codeVerifier, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, authUrl.toString());
};
