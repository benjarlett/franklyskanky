/**
 * Generate thumbnails for images referenced as /thumbs/... in Svelte files.
 *
 * Usage in markup:
 *   <img src="/thumbs/img/future-self.webp" width="560" height="560" ... />
 *
 * The script:
 *   1. Scans src/routes/**\/*.svelte for <img src="/thumbs/..."> tags
 *   2. Strips /thumbs/ prefix to locate the source image in static/
 *   3. Uses the width (and optional height) attribute as the resize target
 *   4. Writes the thumbnail to static/thumbs/{original-path}
 *
 * If the same image is referenced at multiple sizes, the largest width wins.
 * Originals are never modified.
 *
 * Run: node scripts/gen-thumbs.mjs
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, relative, extname } from 'path';
import { globSync } from 'glob';

const ROOT   = resolve(import.meta.dirname, '..');
const STATIC = resolve(ROOT, 'static');
const THUMBS = resolve(STATIC, 'thumbs');

// ── 1. Collect all /thumbs/ img refs from Svelte files ────────────────────────

const svelteFiles = globSync('src/routes/**/*.svelte', { cwd: ROOT });

// Match full <img ... /> tags
const imgTagRe = /<img\b([^>]+?)\/>/g;
const attrRe   = /(\w[\w-]*)="([^"]*)"/g;

// Map: thumbRelPath → { width, height }  (e.g. "img/future-self.webp" → {width:560})
const jobs = new Map();

for (const rel of svelteFiles) {
	const content = readFileSync(resolve(ROOT, rel), 'utf8');
	let m;
	imgTagRe.lastIndex = 0;
	while ((m = imgTagRe.exec(content)) !== null) {
		const attrs = {};
		let a;
		attrRe.lastIndex = 0;
		while ((a = attrRe.exec(m[1])) !== null) attrs[a[1]] = a[2];

		const src = attrs.src ?? '';
		if (!src.startsWith('/thumbs/')) continue;

		const thumbRel = src.replace(/^\/thumbs\//, ''); // e.g. img/future-self.webp
		const width    = attrs.width  ? parseInt(attrs.width,  10) : undefined;
		const height   = attrs.height ? parseInt(attrs.height, 10) : undefined;

		if (!width) {
			console.warn(`  ⚠  No width attr on ${src} in ${rel}`);
			continue;
		}

		// If same image referenced multiple times, keep the largest width
		const existing = jobs.get(thumbRel);
		if (!existing || width > existing.width) {
			jobs.set(thumbRel, { width, height });
		}
	}
}

console.log(`Found ${jobs.size} unique thumbnail targets in Svelte files\n`);

// ── 2. Generate thumbnails ─────────────────────────────────────────────────────

let totalBefore = 0;
let totalAfter  = 0;
let generated   = 0;
let skipped     = 0;
let missing     = 0;

for (const [thumbRel, { width, height }] of [...jobs.entries()].sort()) {
	const srcPath = resolve(STATIC, thumbRel); // original image in static/

	if (!existsSync(srcPath)) {
		console.warn(`  ✗  MISSING source: static/${thumbRel}`);
		missing++;
		continue;
	}

	const outPath = resolve(THUMBS, thumbRel);
	mkdirSync(dirname(outPath), { recursive: true });

	// SVGs are already vector — just copy them
	if (extname(thumbRel).toLowerCase() === '.svg') {
		copyFileSync(srcPath, outPath);
		console.log(`  ✓  thumbs/${thumbRel}  (SVG copied)`);
		generated++;
		continue;
	}

	const input = readFileSync(srcPath);
	const meta  = await sharp(input).metadata();

	const alreadySmall =
		meta.width  <= (width  ?? Infinity) &&
		meta.height <= (height ?? Infinity);

	if (alreadySmall) {
		copyFileSync(srcPath, outPath);
		console.log(`  copy  thumbs/${thumbRel}  (${meta.width}×${meta.height} already ≤ target, copied as-is)`);
		skipped++;
		continue;
	}

	const output = await sharp(input)
		.resize({ width, height, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 75 })
		.toBuffer();

	const meta2  = await sharp(output).metadata();
	writeFileSync(outPath, output);

	const before = Math.round(input.length  / 1024);
	const after  = Math.round(output.length / 1024);
	totalBefore += input.length;
	totalAfter  += output.length;
	generated++;

	console.log(`  ✓  thumbs/${thumbRel}  (${meta.width}×${meta.height} → ${meta2.width}×${meta2.height}  ${before}KB → ${after}KB)`);
}

const savedTotal = Math.round((totalBefore - totalAfter) / 1024);
console.log(`\nGenerated: ${generated}  Skipped: ${skipped}  Missing: ${missing}  Saved: ${savedTotal} KB`);
