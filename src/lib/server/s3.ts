import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

function getClient() {
	return new S3Client({
		region: env.S3_REGION || 'eu-west-2',
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY_ID!,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY!
		}
	});
}

const BUCKET = 'franklyskanky-uploads';
const CDN_BASE = `https://${BUCKET}.s3.eu-west-2.amazonaws.com`;

export async function createPresignedUpload(key: string, contentType: string) {
	const client = getClient();
	const command = new PutObjectCommand({
		Bucket: BUCKET,
		Key: key,
		ContentType: contentType
	});
	const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
	const publicUrl = `${CDN_BASE}/${key}`;
	return { uploadUrl, publicUrl };
}
