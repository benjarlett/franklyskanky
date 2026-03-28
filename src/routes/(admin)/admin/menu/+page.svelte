<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	type Item = { id?: number; label: string; href: string; parentId: number | null };

	let items = $state<Item[]>([]);
	let saving = $state(false);
	let isDirty = $state(false);

	// Sync from server data (on load and after save) — mirrors pattern in page editor
	$effect(() => {
		const incoming = data.items;
		items = incoming.map((i) => ({ id: i.id, label: i.label, href: i.href, parentId: i.parentId }));
		isDirty = false;
	});

	function addItem() {
		items = [...items, { label: '', href: '/', parentId: null }];
		isDirty = true;
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
		isDirty = true;
	}

	function moveItem(index: number, direction: -1 | 1) {
		const target = index + direction;
		if (target < 0 || target >= items.length) return;
		const copy = [...items];
		[copy[index], copy[target]] = [copy[target], copy[index]];
		items = copy;
		isDirty = true;
	}

	function markDirty() {
		isDirty = true;
	}

	// Check if an href matches a known page
	function isPageHref(href: string) {
		return data.pages.some((p) => hrefForSlug(p.slug) === href);
	}

	function hrefForSlug(slug: string) {
		return slug === 'home' ? '/' : `/${slug}`;
	}

	function handleHrefSelect(item: Item, value: string) {
		if (value === '__custom__') {
			item.href = '';
		} else {
			item.href = value;
		}
		isDirty = true;
	}
</script>

<svelte:head>
	<title>Menu ({data.locations.find((l) => l.value === data.location)?.label ?? data.location}) - Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-primary">Menu</h1>
		<button
			type="button"
			onclick={addItem}
			class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
		>
			+ Add Item
		</button>
	</div>

	<!-- Location tabs -->
	<nav class="flex gap-1 border-b border-border/30">
		{#each data.locations as loc (loc.value)}
			<a
				href="?location={loc.value}"
				class="px-4 py-2 text-sm font-medium transition-colors rounded-t-md {data.location === loc.value
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
			>
				{loc.label}
			</a>
		{/each}
	</nav>

	{#if form?.success}
		<div class="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-500">
			Menu saved successfully!
		</div>
	{/if}

	{#if form?.error}
		<div class="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
			{form.error}
		</div>
	{/if}

	<form
		id="menu-form"
		method="POST"
		action="?/save&location={data.location}"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update();
				saving = false;
				isDirty = false;
			};
		}}
	>
		<input type="hidden" name="items" value={JSON.stringify(items)} />
	</form>

	<div class="space-y-2">
		{#each items as item, i (i)}
			<div class="flex items-center gap-3 rounded-lg border border-border/20 bg-background/95 px-4 py-3">
				<!-- Reorder buttons -->
				<div class="flex flex-col gap-0.5">
					<button
						type="button"
						onclick={() => moveItem(i, -1)}
						disabled={i === 0}
						class="text-xs text-muted-foreground hover:text-foreground disabled:opacity-20"
						aria-label="Move up"
					>▲</button>
					<button
						type="button"
						onclick={() => moveItem(i, 1)}
						disabled={i === items.length - 1}
						class="text-xs text-muted-foreground hover:text-foreground disabled:opacity-20"
						aria-label="Move down"
					>▼</button>
				</div>

				<!-- Label -->
				<div class="flex-1">
					<input
						type="text"
						bind:value={item.label}
						oninput={markDirty}
						placeholder="Label"
						class="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>

				<!-- Href -->
				<div class="flex-1">
					<select
						value={isPageHref(item.href) ? item.href : '__custom__'}
						onchange={(e) => handleHrefSelect(item, e.currentTarget.value)}
						class="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					>
						{#each data.pages as p}
							<option value={hrefForSlug(p.slug)}>{p.title}</option>
						{/each}
						<option value="__custom__">Custom URL...</option>
					</select>
				</div>
				{#if !isPageHref(item.href)}
					<div class="flex-1">
						<input
							type="text"
							bind:value={item.href}
							oninput={markDirty}
							placeholder="https://... or /custom-path"
							class="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>
				{/if}

				<!-- Parent selector -->
				<div class="w-32">
					<select
						bind:value={item.parentId}
						onchange={markDirty}
						class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					>
						<option value={null}>Top level</option>
						{#each items as parent, pi (pi)}
							{#if pi !== i && !parent.parentId}
								<option value={parent.id ?? pi}>{parent.label || `Item ${pi + 1}`}</option>
							{/if}
						{/each}
					</select>
				</div>

				<!-- Delete -->
				<button
					type="button"
					onclick={() => removeItem(i)}
					class="text-sm text-destructive hover:text-destructive/80"
					aria-label="Remove item"
				>✕</button>
			</div>
		{/each}

		{#if items.length === 0}
			<div class="rounded-lg border border-border/20 bg-background/95 px-4 py-12 text-center text-muted-foreground">
				No menu items yet. Add your first item!
			</div>
		{/if}
	</div>

	<!-- Save button -->
	<div class="sticky bottom-4 flex justify-end">
		<button
			type="submit"
			form="menu-form"
			disabled={!isDirty || saving}
			class="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
		>
			{#if saving}
				Saving...
			{:else if isDirty}
				Save Menu
			{:else}
				Saved
			{/if}
		</button>
	</div>
</div>
