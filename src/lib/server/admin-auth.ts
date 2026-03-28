import { Google } from 'arctic';
import { env } from '$env/dynamic/private';

// Allowed admin emails
export const ALLOWED_EMAILS = ['franklyskanky@gmail.com', 'joe.jarlett@gmail.com', 'benjarlett@gmail.com', 'amyhulme5000@gmail.com'];

export function isAllowedEmail(email: string): boolean {
	return ALLOWED_EMAILS.includes(email.toLowerCase());
}

let _google: Google | null = null;

export function getGoogle(origin: string): Google {
	if (_google) return _google;
	const clientId = env.GOOGLE_CLIENT_ID;
	const clientSecret = env.GOOGLE_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set');
	}
	_google = new Google(clientId, clientSecret, `${origin}/api/auth/google/callback`);
	return _google;
}
