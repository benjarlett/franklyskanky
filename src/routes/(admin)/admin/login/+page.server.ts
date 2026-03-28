import { redirect } from '@sveltejs/kit';
import { isAllowedEmail } from '$lib/server/admin-auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && isAllowedEmail(locals.user.email)) {
		redirect(302, '/admin');
	}
};
