# Project Structure

## Tech Stack

- **Framework:** SvelteKit with Svelte 5 (runes)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL with Drizzle ORM
- **Rich Text:** Tiptap editor
- **Deployment:** Vercel

## Directory Structure

```
src/
├── app.d.ts                    # App type definitions
├── app.html                    # HTML template
├── app.css                     # Global styles (Tailwind)
├── hooks.server.ts             # Server hooks (auth)
│
├── lib/
│   ├── server/
│   │   ├── db/
│   │   │   ├── index.ts        # Database client
│   │   │   └── schema.ts       # Drizzle schema & Block types
│   │   ├── auth.ts             # User auth (sessions)
│   │   └── admin-auth.ts       # Admin password auth
│   │
│   ├── components/
│   │   ├── blocks/             # Frontend block renderers
│   │   │   ├── index.ts
│   │   │   ├── BlockRenderer.svelte
│   │   │   ├── TextBlock.svelte
│   │   │   ├── SectionBlock.svelte
│   │   │   ├── QuoteBlock.svelte
│   │   │   ├── CTABlock.svelte
│   │   │   ├── HRBlock.svelte
│   │   │   ├── SkillsBlock.svelte
│   │   │   ├── ImageBlock.svelte
│   │   │   └── AwardsBlock.svelte
│   │   │
│   │   └── admin/              # Admin block editors
│   │       ├── BlockEditor.svelte
│   │       └── editors/
│   │           ├── index.ts
│   │           ├── TextBlockEditor.svelte
│   │           ├── SectionBlockEditor.svelte
│   │           ├── QuoteBlockEditor.svelte
│   │           ├── CTABlockEditor.svelte
│   │           ├── SkillsBlockEditor.svelte
│   │           ├── ImageBlockEditor.svelte
│   │           └── AwardsBlockEditor.svelte
│   │
│   └── config/
│       └── navigation.ts       # Nav menu configuration
│
├── routes/
│   ├── +layout.svelte          # Main layout (header, footer)
│   ├── +layout.server.ts       # Auth loading
│   ├── +page.svelte            # Home page
│   ├── +page.server.ts         # Home data loader
│   │
│   ├── [slug]/                 # Dynamic pages
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   │
│   └── admin/                  # Admin routes
│       ├── +layout.svelte      # Admin layout
│       ├── +page.svelte        # Admin dashboard
│       ├── login/
│       │   ├── +page.svelte
│       │   └── +page.server.ts
│       ├── logout/
│       │   └── +page.server.ts
│       └── pages/
│           ├── +page.svelte    # Page list
│           ├── +page.server.ts
│           └── [slug]/
│               ├── +page.svelte    # Page editor
│               └── +page.server.ts
│
scripts/
├── seed.ts                     # Database seeding
├── check-blocks.ts             # Block structure checker
├── consolidate-blocks.ts       # Text block merging
└── extract-sections.ts         # HTML to section blocks

static/
├── favicon.png
└── img/                        # Site images
    └── og-default.webp         # Default social sharing image

docs/
├── mcp.md                      # MCP server docs
├── content-structure.md        # Block system docs
└── project-structure.md        # This file

mcp/
├── main.go                     # MCP server (Go)
└── go.mod
```

## Key Files

### Schema (`src/lib/server/db/schema.ts`)
Defines all block types and database tables. The `Block` union type is the source of truth for content structure.

### BlockRenderer (`src/lib/components/blocks/BlockRenderer.svelte`)
Renders an array of blocks by delegating to type-specific components.

### BlockEditor (`src/lib/components/admin/BlockEditor.svelte`)
Main admin editor component. Handles block creation, deletion, reordering, and updates.

### Page Editor (`src/routes/admin/pages/[slug]/+page.svelte`)
Full page editor with SEO fields and unified save functionality.

## Svelte 5 Patterns

This project uses Svelte 5 runes:

```svelte
// Props
let { data, form } = $props();

// State
let blocks = $state<Block[]>([]);

// Derived (reactive)
let count = $derived(blocks.length);

// Effects
$effect(() => {
  // Runs when dependencies change
});
```

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgres://...
ADMIN_PASSWORD=your-admin-password
```

## Common Tasks

### Add a new block type
1. Add type to `BlockType` union in `schema.ts`
2. Add interface extending `BaseBlock`
3. Add to `Block` union type
4. Create renderer in `src/lib/components/blocks/`
5. Create editor in `src/lib/components/admin/editors/`
6. Update `BlockRenderer.svelte` and `BlockEditor.svelte`

### Modify page content
1. Use admin UI at `/admin/pages/[slug]`
2. Or write a script in `/scripts` and run with `npx tsx`

### Add a new page
1. Insert into `page` table with unique slug
2. Access at `/{slug}` or via admin at `/admin/pages`

## Commands

```bash
# Development
npm run dev

# Type checking
npm run check

# Database
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio

# Scripts
npx tsx scripts/<script-name>.ts

# Build MCP server
cd mcp && go build -o jj-mcp
```

## Deployment

Configured for Vercel via `@sveltejs/adapter-vercel`. Push to main branch triggers deployment.

Database must be accessible from Vercel (use connection pooling for serverless).
