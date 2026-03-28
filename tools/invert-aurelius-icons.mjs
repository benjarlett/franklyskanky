#!/usr/bin/env node
/**
 * Invert icon colors to white on transparent for use as backgrounds
 */

import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';

const icons = [
  {
    input: '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/mirror.png',
    output: '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/mirror-white.png'
  },
  {
    input: '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/compass.png',
    output: '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/compass-white.png'
  },
  {
    input: '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/dojo.png',
    output: '/Users/joejarlett/Documents/dev/groundedninja-business/demos/aureliusfoundation/notes/assets/dojo-white.png'
  }
];

for (const { input, output } of icons) {
  console.log(`Processing ${input.split('/').pop()}...`);

  const buffer = await readFile(input);

  // Invert the image (makes dark -> light, preserves alpha)
  const inverted = await sharp(buffer)
    .negate({ alpha: false })  // Invert colors but not alpha channel
    .toBuffer();

  await writeFile(output, inverted);
  console.log(`  → Created ${output.split('/').pop()}`);
}

console.log('\nAll icons inverted successfully!');
