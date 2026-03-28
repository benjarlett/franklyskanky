# MCP Server Configuration

This project uses two MCP servers for development.

## Svelte MCP Server

Provides Svelte 5 and SvelteKit documentation and code assistance.

### Available Tools

#### list-sections
Lists all available Svelte 5 and SvelteKit documentation sections. Use this first to discover what documentation is available.

#### get-documentation
Retrieves full documentation for specific sections. Accepts single or multiple section names.

#### svelte-autofixer
Analyzes Svelte code and returns issues/suggestions. Should be used when writing Svelte code.

#### playground-link
Generates a Svelte Playground link for code snippets.

## JJ MCP Server (Custom)

Go-based MCP server for direct database access. Located in `/mcp`.

### Available Tools

#### jj_sql
Execute raw SQL queries against the PostgreSQL database.

```
jj_sql(query: string, allow_writes?: boolean)
```

#### jj_pages
Manage site pages (CRUD operations).

```
jj_pages(action: 'list' | 'get' | 'create' | 'update' | 'delete', ...)
```

#### jj_status
Check database connection status.

### Building the MCP Server

```bash
cd mcp
go build -o jj-mcp
```

### Configuration

The MCP server is configured in Claude Code settings. It connects to the same PostgreSQL database as the main app using the `DATABASE_URL` environment variable.

## Usage in CLAUDE.md

The project's `CLAUDE.md` instructs AI assistants to:

1. Always call `list-sections` first for any Svelte query
2. Analyze use_cases to find relevant documentation
3. Fetch all relevant sections with `get-documentation`
4. Run `svelte-autofixer` on Svelte code before presenting to user
