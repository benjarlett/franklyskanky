import postgres from 'postgres';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const sql = postgres(DATABASE_URL);

async function preserveContent() {
	console.log('Preserving existing content before schema migration...');

	// Add legacy_content column if it doesn't exist and copy content to it
	await sql`
		ALTER TABLE page
		ADD COLUMN IF NOT EXISTS legacy_content text;
	`;

	// Copy content to legacy_content
	await sql`
		UPDATE page
		SET legacy_content = content
		WHERE legacy_content IS NULL AND content IS NOT NULL;
	`;

	// Add blocks column if it doesn't exist
	await sql`
		ALTER TABLE page
		ADD COLUMN IF NOT EXISTS blocks jsonb DEFAULT '[]'::jsonb;
	`;

	console.log('Done! Content preserved in legacy_content column.');
	console.log('You can now safely run: npm run db:push');

	await sql.end();
}

preserveContent().catch(console.error);
