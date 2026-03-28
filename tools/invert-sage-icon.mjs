#!/usr/bin/env node
/**
 * Invert sage-dialogue icon to white on transparent
 */

import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';

const input = '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/sage-dialogue.png';
const output = '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/sage-dialogue-white.png';

console.log('Processing sage-dialogue.png...');

const buffer = await readFile(input);

// Invert the image (makes dark -> light, preserves alpha)
const inverted = await sharp(buffer)
  .negate({ alpha: false })  // Invert colors but not alpha channel
  .toBuffer();

await writeFile(output, inverted);
console.log(`  → Created sage-dialogue-white.png`);
