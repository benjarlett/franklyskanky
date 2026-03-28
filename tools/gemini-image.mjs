#!/usr/bin/env node
/**
 * Gemini Image Generation Tool
 *
 * Generates images using Google's Nano Banana (Gemini native) or Imagen 3
 *
 * Usage:
 *   node tools/gemini-image.mjs --prompt "A serene mountain landscape" --output ./images/mountain.webp
 *   node tools/gemini-image.mjs --prompt "..." --model imagen --aspect 16:9
 *
 * Environment:
 *   GENAI_API_KEY or GEMINI_API_KEY - Your Google AI API key (loaded from .env.local)
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { GoogleGenAI } from '@google/genai';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { dirname, basename, extname } from 'path';
import { parseArgs } from 'util';
import sharp from 'sharp';

// Parse command line arguments
const { values } = parseArgs({
  options: {
    prompt: { type: 'string', short: 'p' },
    output: { type: 'string', short: 'o' },
    model: { type: 'string', short: 'm', default: 'imagen' },
    aspect: { type: 'string', short: 'a', default: '16:9' },
    format: { type: 'string', short: 'f', default: 'webp' },
    quality: { type: 'string', short: 'q', default: '90' },
    style: { type: 'string', short: 's' },
    reference: { type: 'string', short: 'r' },  // Reference image for style transfer
    count: { type: 'string', short: 'c', default: '1' },
    prefix: { type: 'string' },       // Filename prefix for batch
    help: { type: 'boolean', short: 'h' }
  }
});

if (values.help || !values.prompt) {
  console.log(`
Gemini Image Generation Tool

Usage:
  node tools/gemini-image.mjs --prompt "Your image description" [options]

Options:
  -p, --prompt     Image description (required)
  -o, --output     Output file/directory path (default: ./output.webp)
  -m, --model      Model to use: 'imagen' or 'nanobanana' (default: imagen)
  -a, --aspect     Aspect ratio: '1:1', '16:9', '9:16', '4:3', '3:4' (default: 16:9)
  -f, --format     Output format: 'webp', 'png', 'jpg' (default: webp)
  -q, --quality    Image quality 1-100 (default: 90, webp/jpg only)
  -s, --style      Style description to append to prompt (for consistent art direction)
  -r, --reference  Path to reference image for style transfer (nanobanana only)
  -c, --count      Number of images to generate (default: 1, max: 10)
  --prefix         Filename prefix for batch output (e.g., 'brain' → brain-01.webp)
  -h, --help       Show this help

Environment:
  API key loaded automatically from .env.local (GEMINI_API_KEY or GENAI_API_KEY)

Style Tips:
  Since Gemini doesn't have --sref like Midjourney, embed style in the prompt:
  - "in the style of moody oil painting with deep shadows"
  - "digital art, soft lighting, contemplative mood, muted earth tones"
  - "artistic, ethereal, with soft bokeh and atmospheric haze"

Examples:
  # Single webp image (default, optimized for web)
  node tools/gemini-image.mjs -p "A philosopher contemplating in a library" -o ./images/philosopher.webp

  # With style reference
  node tools/gemini-image.mjs -p "Neural pathways" -s "moody oil painting, deep shadows, warm amber tones"

  # Batch generation (10 variations)
  node tools/gemini-image.mjs -p "Brain with glowing connections" -c 10 --prefix brain -o ./images/

  # PNG output (larger file size)
  node tools/gemini-image.mjs -p "Mirror reflection showing two selves" -f png
`);
  process.exit(values.help ? 0 : 1);
}

// Get API key
const apiKey = process.env.GENAI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GENAI_API_KEY or GEMINI_API_KEY environment variable required');
  process.exit(1);
}

// Initialize client
const ai = new GoogleGenAI({ apiKey });

// Model selection
const modelId = values.model === 'imagen'
  ? 'imagen-3.0-generate-001'
  : 'gemini-2.5-flash-image';

// Aspect ratio mapping (YouTube-optimized for 1080p+)
const aspectRatios = {
  '1:1': { width: 1080, height: 1080 },
  '16:9': { width: 1920, height: 1080 },  // YouTube 1080p
  '9:16': { width: 1080, height: 1920 },  // YouTube Shorts
  '4:3': { width: 1440, height: 1080 },
  '3:4': { width: 1080, height: 1440 }
};

const aspect = aspectRatios[values.aspect] || aspectRatios['16:9'];

// Generate a single image
async function generateSingleImage(prompt) {
  let imageData;

  if (values.model === 'imagen') {
    // Use Imagen 3 for high-quality generation
    if (values.reference) {
      throw new Error('Reference images not supported with Imagen model - use nanobanana');
    }

    const response = await ai.models.generateImages({
      model: modelId,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: values.aspect.replace(':', '_'),
        safetyFilterLevel: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error('No images generated');
    }

    imageData = response.generatedImages[0].image.imageBytes;
  } else {
    // Use Nano Banana (Gemini native image generation)
    const parts = [];

    // Add reference image if provided
    if (values.reference) {
      const refBuffer = await readFile(values.reference);
      const refBase64 = refBuffer.toString('base64');
      const mimeType = values.reference.endsWith('.png') ? 'image/png' :
                       values.reference.endsWith('.jpg') || values.reference.endsWith('.jpeg') ? 'image/jpeg' :
                       values.reference.endsWith('.webp') ? 'image/webp' : 'image/png';

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: refBase64
        }
      });
    }

    // Add text prompt
    parts.push({
      text: `Generate an image: ${prompt}${values.style ? `. Style: ${values.style}` : ''}${values.reference ? '. Use the provided image as a style reference.' : ''}`
    });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{
        role: 'user',
        parts: parts
      }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      }
    });

    // Extract image from response
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error('No image in response');
    }

    const imagePart = candidate.content.parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
    if (!imagePart) {
      throw new Error('No image data in response');
    }

    imageData = imagePart.inlineData.data;
  }

  return Buffer.from(imageData, 'base64');
}

async function generateImages() {
  const count = Math.min(parseInt(values.count) || 1, 10);
  const fullPrompt = values.prompt + (values.style ? `. Style: ${values.style}` : '');
  const format = values.format || 'webp';
  const quality = parseInt(values.quality) || 90;

  console.log(`Model: ${modelId}`);
  console.log(`Prompt: ${values.prompt}`);
  if (values.style) console.log(`Style: ${values.style}`);
  if (values.reference) console.log(`Reference: ${values.reference}`);
  console.log(`Aspect: ${values.aspect}`);
  console.log(`Format: ${format} (quality: ${quality})`);
  console.log(`Count: ${count}`);
  console.log('');

  const generatedPaths = [];

  for (let i = 0; i < count; i++) {
    const num = String(i + 1).padStart(2, '0');

    // Determine output path
    let outputPath;
    if (count === 1) {
      outputPath = values.output || `./output.${format}`;
    } else {
      // Batch mode: output should be a directory, use prefix for filename
      const outputDir = values.output || './images';
      const prefix = values.prefix || 'image';
      outputPath = `${outputDir}/${prefix}-${num}.${format}`;
    }

    console.log(`Generating ${i + 1}/${count}...`);

    try {
      const buffer = await generateSingleImage(fullPrompt);

      // Ensure directory exists
      await mkdir(dirname(outputPath), { recursive: true });

      // Convert image to requested format
      let processedBuffer;
      const sharpInstance = sharp(buffer);

      if (format === 'webp') {
        processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
      } else if (format === 'jpg' || format === 'jpeg') {
        processedBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
      } else if (format === 'png') {
        processedBuffer = await sharpInstance.png().toBuffer();
      } else {
        processedBuffer = buffer; // Fallback to original
      }

      // Write image file
      await writeFile(outputPath, processedBuffer);

      // Save metadata alongside image
      const metadataPath = outputPath.replace(/\.(png|jpg|jpeg|webp)$/i, '.json');
      const metadata = {
        prompt: values.prompt,
        style: values.style || null,
        reference: values.reference || null,
        fullPrompt: fullPrompt,
        model: modelId,
        aspect: values.aspect,
        format: format,
        quality: quality,
        generatedAt: new Date().toISOString(),
        file: basename(outputPath)
      };
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`  → ${outputPath} (${(processedBuffer.length / 1024).toFixed(1)} KB)`);
      generatedPaths.push(outputPath);

      // Small delay between requests to be gentle with API
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
      // Continue with next image on error
    }
  }

  console.log(`\nGenerated ${generatedPaths.length}/${count} images`);
  return generatedPaths;
}

generateImages();
