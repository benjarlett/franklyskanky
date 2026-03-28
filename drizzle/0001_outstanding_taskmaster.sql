CREATE TABLE "menu_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"location" text DEFAULT 'main' NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"parent_id" integer,
	"sort_order" integer DEFAULT 0 NOT NULL
);
