import { json, error } from '@sveltejs/kit';
import { createPresignedUpload } from '$lib/server/s3';
import type { RequestHandler } from './$types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: RequestHandler = async ({ request }) => {
	const { filename, contentType, size } = await request.json();

	if (!filename || !contentType) {
		error(400, 'Missing filename or contentType');
	}

	if (!ALLOWED_TYPES.includes(contentType)) {
		error(400, `File type ${contentType} not allowed`);
	}

	if (size && size > MAX_SIZE) {
		error(400, 'File too large (max 10MB)');
	}

	const ext = filename.split('.').pop() || 'jpg';
	const key = `images/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

	try {
		const { uploadUrl, publicUrl } = await createPresignedUpload(key, contentType);
		return json({ uploadUrl, publicUrl });
	} catch (e) {
		console.error('S3 presign error:', e);
		error(500, `Upload error: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};
