# Content Structure Guide

This document explains how content is structured and stored in the joejarlett.co.uk site.

## Overview

Content is stored as **blocks** in a JSONB column on the `page` table. Each page has an array of blocks that render in sequence. This block-based approach allows flexible, component-driven content without requiring code changes.

## Page Schema

Each page in the database has:

| Field | Type | Description |
|-------|------|-------------|
| `slug` | `text` | URL path (primary key) |
| `title` | `text` | Page title (browser tab, search results) |
| `description` | `text` | Meta description (SEO, social previews) |
| `ogImage` | `text` | Open Graph image URL for social sharing |
| `blocks` | `jsonb` | Array of content blocks |
| `published` | `boolean` | Whether page is publicly visible |
| `createdAt` | `timestamp` | Creation date |
| `updatedAt` | `timestamp` | Last modification date |

## Block Types

All blocks have a base structure:

```typescript
interface BaseBlock {
  id: string;    // UUID
  type: BlockType;
}
```

### text

Rich HTML content from Tiptap editor. Can include headings (H1-H3), paragraphs, lists, links, bold, italic, etc.

```typescript
{
  id: string,
  type: 'text',
  content: string  // HTML from Tiptap
}
```

**Best for:** Main content sections, articles, descriptions. Use headings within text blocks to structure content.

### section

Image + text side-by-side layout with optional flip and layout modes.

```typescript
{
  id: string,
  type: 'section',
  imageUrl: string,
  imageAlt: string,
  title?: string,
  content: string,     // HTML from Tiptap
  flip?: boolean,      // true = image on right
  layout?: 'side' | 'hero'  // 'side' (default) or 'hero' (full-width image on top)
}
```

**Best for:** Feature showcases, product highlights, alternating image/text layouts.

**Layouts:**
- `side` (default): Image beside text, can flip left/right
- `hero`: Full-width image on top, text below

### quote

Blockquote with optional attribution.

```typescript
{
  id: string,
  type: 'quote',
  text: string,
  attribution?: string
}
```

**Best for:** Testimonials, pull quotes, notable statements.

### cta

Call-to-action link buttons.

```typescript
{
  id: string,
  type: 'cta',
  links: Array<{ text: string, href: string }>
}
```

**Best for:** Navigation prompts, action buttons at section ends.

### hr

Horizontal rule / section divider.

```typescript
{
  id: string,
  type: 'hr'
}
```

**Best for:** Visual separation between major page sections.

### skills

List of skills or tags displayed as pills/badges.

```typescript
{
  id: string,
  type: 'skills',
  title?: string,
  items: string[]
}
```

**Best for:** Skill lists, technology stacks, tag clouds.

### image

Standalone image with caption.

```typescript
{
  id: string,
  type: 'image',
  url: string,
  alt: string,
  caption?: string
}
```

**Best for:** Full-width images, figures with captions.

### awards

Grid of award/certification images with labels.

```typescript
{
  id: string,
  type: 'awards',
  title?: string,
  items: Array<{
    imageUrl: string,
    label: string
  }>
}
```

**Best for:** Award badges, certifications, partner logos.

## Current Pages

| Slug | Title | Blocks | Description |
|------|-------|--------|-------------|
| home | EdTech Psychologist | 21 | Main landing page with sections on future-self thinking, AI, education |
| about | Who am I...? | 14 | Background, vision, skills, and awards |
| services | The Best is Done Together | 14 | Consulting, coaching, and workshop offerings |
| projects | Tools for You | 7 | Grounded Ninja and other products |
| research | Forever Learning | 17 | Academic research and ongoing explorations |
| contact | Contact | 1 | Contact information |
| privacy | Privacy Policy | 1 | Legal privacy policy |

**Block types currently in use:** `text`, `section`, `hr`, `skills`, `cta`, `awards`

**Block types available but unused:** `image`, `quote`

## Content Guidelines

### Use HR blocks as section dividers
HR blocks visually separate major sections. Content between HRs should be thematically related.

### Keep text blocks cohesive
Merge related content into single text blocks. A text block can contain multiple headings and paragraphs - use headings within Tiptap to structure content.

### Use appropriate block types
- Don't put images in text blocks using raw HTML - use `image` or `section` blocks
- Don't put button links in text blocks - use `cta` blocks
- Don't use text blocks for skill lists - use `skills` blocks
- Use `awards` for logo/badge grids, not inline images

## SEO & Social Sharing

Each page has dedicated SEO fields:

- **title**: Appears in browser tab and Google search results
- **description**: Shown in search results and social previews (ideal: 150-160 characters)
- **ogImage**: Image shown when sharing on social media (recommended: 1200x630px)

These are edited in the admin UI under "SEO & Social Sharing" section.

Open Graph and Twitter Card meta tags are automatically generated from these fields.

## Modifying Content

### Via Admin UI
1. Go to `/admin/login`
2. Enter the `ADMIN_PASSWORD` from `.env.local`
3. Navigate to `/admin/pages`
4. Click a page to edit blocks and SEO settings

### Via Database Scripts

Scripts in `/scripts` can modify content programmatically:

```bash
# Check current block structure
npx tsx scripts/check-blocks.ts

# Consolidate consecutive text blocks
npx tsx scripts/consolidate-blocks.ts
```

### Direct Database Access

Use Drizzle ORM to query/update:

```typescript
import { db } from '$lib/server/db';
import { page } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Read
const [pageData] = await db.select().from(page).where(eq(page.slug, 'home'));

// Update
await db.update(page).set({
  blocks: newBlocks,
  updatedAt: new Date()
}).where(eq(page.slug, 'home'));
```

## Rendering

Blocks are rendered by `BlockRenderer.svelte`:

```svelte
<BlockRenderer blocks={data.page.blocks} />
```

Each block type has a corresponding renderer component in `src/lib/components/blocks/`.

## Adding a New Block Type

1. Add type to `BlockType` union in `schema.ts`
2. Add interface extending `BaseBlock`
3. Add to `Block` union type
4. Create renderer in `src/lib/components/blocks/`
5. Create editor in `src/lib/components/admin/editors/`
6. Update `BlockRenderer.svelte` and `BlockEditor.svelte`
7. Export from index files
