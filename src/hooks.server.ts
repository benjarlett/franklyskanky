import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import { isAllowedEmail } from '$lib/server/admin-auth';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const handleAdminAuth: Handle = async ({ event, resolve }) => {
	if (
		event.url.pathname.startsWith('/admin') &&
		!event.url.pathname.startsWith('/admin/login')
	) {
		const user = event.locals.user;
		const isAdmin = !!user && isAllowedEmail(user.email);
		event.locals.isAdmin = isAdmin;

		if (!isAdmin) {
			return new Response(null, {
				status: 303,
				headers: { Location: '/admin/login' }
			});
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth, handleAdminAuth);
