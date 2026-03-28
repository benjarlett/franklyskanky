<script lang="ts">
	import { enhance } from '$app/forms';
	import BlockEditor from '$lib/components/admin/BlockEditor.svelte';
	import type { Block } from '$lib/server/db/schema';

	let { data, form } = $props();

	let title = $state(data.page.title);
	let slug = $state(data.page.slug);
	let description = $state(data.page.description ?? '');
	let ogImage = $state(data.page.ogImage ?? '');
	let blocks = $state<Block[]>(data.page.blocks ?? []);
	let saving = $state(false);
	let isDirty = $state(false);

	// Track the server data version to detect when it refreshes after save
	let serverDataVersion = $state(data.page.updatedAt?.getTime() ?? 0);
	$effect(() => {
		const newVersion = data.page.updatedAt?.getTime() ?? 0;
		if (newVersion !== serverDataVersion) {
			// Server data has changed (after save), sync local state
			serverDataVersion = newVersion;
			title = data.page.title;
			slug = data.page.slug;
			description = data.page.description ?? '';
			ogImage = data.page.ogImage ?? '';
			blocks = data.page.blocks ?? [];
			isDirty = false;
		}
	});

	const handleBlocksUpdate = (newBlocks: Block[]) => {
		blocks = newBlocks;
		isDirty = true;
	};

	const handleSave = () => {
		const formEl = document.getElementById('page-form') as HTMLFormElement;
		formEl.requestSubmit();
	};

	// Character count for description (ideal: 150-160)
	let descLength = $derived(description.length);
	let seoOpen = $state(false);
</script>

<svelte:head>
	<title>Edit: {data.page.title} | Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-foreground">Edit Page</h1>
		<a
			href="/admin/pages"
			class="rounded-md bg-muted px-4 py-2 text-sm text-foreground hover:bg-muted/80"
		>
			Back to Pages
		</a>
	</div>

	{#if form?.success}
		<div class="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-500">
			Page saved successfully!
		</div>
	{/if}

	{#if form?.error}
		<div class="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
			{form.error}
		</div>
	{/if}

	<form
		id="page-form"
		method="POST"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update();
				saving = false;
				isDirty = false;
			};
		}}
	>
		<!-- Title & Slug (always visible) -->
		<div class="space-y-4 rounded-lg border border-border/50 bg-muted/20 p-4">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="title" class="mb-1 block text-sm font-medium text-foreground">
						Page Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						bind:value={title}
						oninput={() => { isDirty = true; }}
						class="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>
				<div>
					<label for="slug" class="mb-1 block text-sm font-medium text-foreground">
						URL Slug
					</label>
					<div class="flex items-center gap-1">
						<span class="text-sm text-muted-foreground">/</span>
						<input
							id="slug"
							name="slug"
							type="text"
							bind:value={slug}
							oninput={() => { isDirty = true; }}
							pattern="[a-z0-9\-]+"
							class="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- SEO & Social (collapsible) -->
		<div class="rounded-lg border border-border/50 bg-muted/20">
			<button
				type="button"
				onclick={() => { seoOpen = !seoOpen; }}
				class="flex w-full items-center gap-2 px-4 py-3 text-left"
			>
				<span class="text-xs text-muted-foreground/60">{seoOpen ? '▼' : '▶'}</span>
				<svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<span class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					SEO & Social Sharing
				</span>
				{#if !seoOpen && description}
					<span class="truncate text-xs text-muted-foreground/50">
						{description.slice(0, 60)}{description.length > 60 ? '...' : ''}
					</span>
				{/if}
			</button>

			{#if seoOpen}
				<div class="space-y-4 border-t border-border/20 px-4 pb-4 pt-3">
					<div>
						<label for="description" class="mb-1 block text-sm font-medium text-foreground">
							Meta Description
							<span class="ml-1 font-normal text-muted-foreground">(shown in Google & social previews)</span>
						</label>
						<textarea
							id="description"
							name="description"
							bind:value={description}
							oninput={() => { isDirty = true; }}
							rows="2"
							placeholder="A compelling 150-160 character description of this page..."
							class="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						></textarea>
						<p class="mt-1 text-xs {descLength > 160 ? 'text-amber-500' : descLength > 0 ? 'text-green-500' : 'text-muted-foreground'}">
							{descLength}/160 characters {descLength > 160 ? '(may be truncated)' : descLength >= 120 && descLength <= 160 ? '(ideal length)' : ''}
						</p>
					</div>

					<div>
						<label for="ogImage" class="mb-1 block text-sm font-medium text-foreground">
							Social Image
							<span class="ml-1 font-normal text-muted-foreground">(optional - shown when shared on social media)</span>
						</label>
						<input
							id="ogImage"
							name="ogImage"
							type="text"
							bind:value={ogImage}
							oninput={() => { isDirty = true; }}
							placeholder="/img/og-image.webp"
							class="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
						{#if ogImage}
							<div class="mt-2">
								<img src={ogImage} alt="Social preview" class="h-24 rounded border border-border object-cover" />
							</div>
						{/if}
						<p class="mt-1 text-xs text-muted-foreground">
							Recommended: 1200x630px. Leave blank to use site default.
						</p>
					</div>
				</div>
			{/if}
		</div>

		<input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
	</form>

	<div class="border-t border-border pt-6">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Content Blocks</h2>
		<BlockEditor initialBlocks={data.page.blocks ?? []} onUpdate={handleBlocksUpdate} resetKey={serverDataVersion} />
	</div>

	<!-- Unified save button -->
	<div class="sticky bottom-4 flex justify-end">
		<button
			type="button"
			onclick={handleSave}
			disabled={!isDirty || saving}
			class="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
		>
			{#if saving}
				Saving...
			{:else if isDirty}
				Save Changes
			{:else}
				Saved
			{/if}
		</button>
	</div>
</div>
