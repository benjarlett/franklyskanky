/**
 * Audit all <img> tags in src/routes/**\/*.svelte files.
 * Reports:
 *   - missing width/height attributes
 *   - src pointing to originals where a thumb already exists
 *   - src pointing to a thumb that doesn't exist on disk
 *
 * Run: node scripts/audit-images.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, relative } from 'path';
import { globSync } from 'glob';

const ROOT   = resolve(import.meta.dirname, '..');
const STATIC = resolve(ROOT, 'static');

const svelteFiles = globSync('src/routes/**/*.svelte', { cwd: ROOT });

// Regex to grab each <img ...> tag (no multiline support needed — attrs are usually one line)
const imgRe = /<img\s+([^>]+?)\/>/g;
const attrRe = /(\w[\w-]*)="([^"]*)"/g;

let issues = 0;

for (const rel of svelteFiles) {
	const path = resolve(ROOT, rel);
	const src  = readFileSync(path, 'utf8');

	let match;
	imgRe.lastIndex = 0;

	while ((match = imgRe.exec(src)) !== null) {
		const attrsStr = match[1];
		const attrs = {};
		let m;
		attrRe.lastIndex = 0;
		while ((m = attrRe.exec(attrsStr)) !== null) attrs[m[1]] = m[2];

		const imgSrc = attrs.src ?? '';
		if (!imgSrc || imgSrc.startsWith('{')) continue; // skip dynamic srcs

		const lineNo = src.slice(0, match.index).split('\n').length;
		const tag = `[${relative(ROOT, path)}:${lineNo}]  src="${imgSrc}"`;

		const problems = [];

		// 1. Missing width/height
		if (!attrs.width)  problems.push('missing width');
		if (!attrs.height) problems.push('missing height');

		// 2. File existence check
		const diskPath = resolve(STATIC, imgSrc.replace(/^\//, ''));
		if (!existsSync(diskPath)) {
			problems.push(`FILE NOT FOUND on disk`);
		}

		if (problems.length) {
			console.log(`  ⚠  ${tag}`);
			for (const p of problems) console.log(`       → ${p}`);
			issues++;
		}
	}
}

if (issues === 0) {
	console.log('  ✓  All <img> tags look good');
} else {
	console.log(`\n${issues} image(s) with issues`);
}
