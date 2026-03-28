import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session) {
			await auth.invalidateSession(event.locals.session.id);
		}
		auth.deleteSessionTokenCookie(event);
		redirect(303, '/admin/login');
	}
};

export const load: PageServerLoad = async (event) => {
	if (event.locals.session) {
		await auth.invalidateSession(event.locals.session.id);
	}
	auth.deleteSessionTokenCookie(event);
	redirect(303, '/admin/login');
};
