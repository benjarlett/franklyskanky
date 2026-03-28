<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	type Item = { id?: number; label: string; href: string; parentId: number | null };

	let items = $state<Item[]>([]);
	let saving = $state(false);
	let isDirty = $state(false);

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

	function markDirty() { isDirty = true; }

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
		<h1 class="text-2xl font-bold" style="color:#111111;">Menu</h1>
		<button
			type="button"
			onclick={addItem}
			class="rounded-md px-4 py-2 text-sm font-medium"
			style="background:#1d4ed8; color:#ffffff;"
		>
			+ Add Item
		</button>
	</div>

	<!-- Location tabs -->
	<nav class="flex gap-1 border-b" style="border-color:#dddddd;">
		{#each data.locations as loc (loc.value)}
			<a
				href="?location={loc.value}"
				class="px-4 py-2 text-sm font-medium rounded-t-md"
				style={data.location === loc.value ? 'background:#1d4ed8; color:#ffffff;' : 'color:#555555;'}
			>
				{loc.label}
			</a>
		{/each}
	</nav>

	{#if form?.success}
		<div class="rounded-md px-4 py-3 text-sm" style="background:#dcfce7; color:#166534;">
			Menu saved successfully!
		</div>
	{/if}

	{#if form?.error}
		<div class="rounded-md px-4 py-3 text-sm" style="background:#fee2e2; color:#991b1b;">
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
			<div class="flex items-center gap-3 rounded-lg border px-4 py-3" style="background:#ffffff; border-color:#dddddd;">
				<!-- Reorder buttons -->
				<div class="flex flex-col gap-0.5">
					<button
						type="button"
						onclick={() => moveItem(i, -1)}
						disabled={i === 0}
						class="text-xs disabled:opacity-20"
						style="color:#555555;"
						aria-label="Move up"
					>▲</button>
					<button
						type="button"
						onclick={() => moveItem(i, 1)}
						disabled={i === items.length - 1}
						class="text-xs disabled:opacity-20"
						style="color:#555555;"
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
						class="w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none"
						style="background:#ffffff; color:#111111; border-color:#cccccc;"
					/>
				</div>

				<!-- Href -->
				<div class="flex-1">
					<select
						value={isPageHref(item.href) ? item.href : '__custom__'}
						onchange={(e) => handleHrefSelect(item, e.currentTarget.value)}
						class="w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none"
						style="background:#ffffff; color:#111111; border-color:#cccccc;"
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
							class="w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none"
							style="background:#ffffff; color:#111111; border-color:#cccccc;"
						/>
					</div>
				{/if}

				<!-- Parent selector -->
				<div class="w-32">
					<select
						bind:value={item.parentId}
						onchange={markDirty}
						class="w-full rounded-md border px-2 py-1.5 text-sm focus:outline-none"
						style="background:#ffffff; color:#111111; border-color:#cccccc;"
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
					class="text-sm"
					style="color:#dc2626;"
					aria-label="Remove item"
				>✕</button>
			</div>
		{/each}

		{#if items.length === 0}
			<div class="rounded-lg border px-4 py-12 text-center" style="background:#f9f9f9; border-color:#dddddd; color:#666666;">
				No menu items yet. Add your first item!
			</div>
		{/if}
	</div>

	<div class="sticky bottom-4 flex justify-end">
		<button
			type="submit"
			form="menu-form"
			disabled={!isDirty || saving}
			class="rounded-lg px-6 py-2 font-medium disabled:opacity-50"
			style="background:#cc0000; color:#ffffff;"
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
