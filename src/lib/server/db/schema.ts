import { pgTable, text, timestamp, boolean, jsonb, serial, integer } from 'drizzle-orm/pg-core';

// ============================================
// Block Types for Content Editor
// ============================================

export type BlockType = 'text' | 'section' | 'quote' | 'cta' | 'hr' | 'image' | 'youtube';

export interface BaseBlock {
	id: string;
	type: BlockType;
}

export interface TextBlock extends BaseBlock {
	type: 'text';
	content: string; // HTML from Tiptap (includes headings)
}

export interface SectionBlock extends BaseBlock {
	type: 'section';
	imageUrl: string;
	imageAlt: string;
	title?: string;
	content: string; // HTML from Tiptap
	flip?: boolean;
	layout?: 'side' | 'hero'; // 'side' = image beside text (default), 'hero' = image on top, full-width text below
}

export interface QuoteBlock extends BaseBlock {
	type: 'quote';
	text: string;
	attribution?: string;
}

export interface CTABlock extends BaseBlock {
	type: 'cta';
	links: Array<{
		text: string;
		href: string;
	}>;
}

export interface HRBlock extends BaseBlock {
	type: 'hr';
}

export interface ImageBlock extends BaseBlock {
	type: 'image';
	url: string;
	alt: string;
	caption?: string;
}

export interface YouTubeBlock extends BaseBlock {
	type: 'youtube';
	videoId: string;
	caption?: string;
}

export type Block =
	| TextBlock
	| SectionBlock
	| QuoteBlock
	| CTABlock
	| HRBlock
	| ImageBlock
	| YouTubeBlock;

// Helper to create a new block with UUID
export function createBlock<T extends Block>(type: T['type'], data: Omit<T, 'id' | 'type'>): T {
	return {
		id: crypto.randomUUID(),
		type,
		...data
	} as T;
}

// ============================================
// Database Tables
// ============================================

// Users for admin access
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Pages - stores all site content as blocks
export const page = pgTable('page', {
	slug: text('slug').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	ogImage: text('og_image'), // Open Graph image for social sharing
	blocks: jsonb('blocks').$type<Block[]>().default([]),
	published: boolean('published').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// Menu items — supports multiple menus via `location` (e.g. "main", "footer")
export const menuItem = pgTable('menu_item', {
	id: serial('id').primaryKey(),
	location: text('location').notNull().default('main'),
	label: text('label').notNull(),
	href: text('href').notNull(),
	parentId: integer('parent_id'),
	order: integer('sort_order').notNull().default(0)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Page = typeof page.$inferSelect;
export type NewPage = typeof page.$inferInsert;
export type MenuItem = typeof menuItem.$inferSelect;
export type NewMenuItem = typeof menuItem.$inferInsert;
