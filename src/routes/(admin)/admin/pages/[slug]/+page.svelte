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

	let serverDataVersion = $state(data.page.updatedAt?.getTime() ?? 0);
	$effect(() => {
		const newVersion = data.page.updatedAt?.getTime() ?? 0;
		if (newVersion !== serverDataVersion) {
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

	let descLength = $derived(description.length);
	let seoOpen = $state(false);
</script>

<svelte:head>
	<title>Edit: {data.page.title} | Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold" style="color:#111111;">Edit Page</h1>
		<a href="/admin/pages" class="rounded-md px-4 py-2 text-sm" style="background:#eeeeee; color:#111111;">
			Back to Pages
		</a>
	</div>

	{#if form?.success}
		<div class="rounded-md px-4 py-3 text-sm" style="background:#dcfce7; color:#166534;">
			Page saved successfully!
		</div>
	{/if}

	{#if form?.error}
		<div class="rounded-md px-4 py-3 text-sm" style="background:#fee2e2; color:#991b1b;">
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
		<div class="space-y-4 rounded-lg border p-4" style="border-color:#dddddd; background:#f9f9f9;">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="title" class="mb-1 block text-sm font-medium" style="color:#111111;">
						Page Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						bind:value={title}
						oninput={() => { isDirty = true; }}
						class="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1"
						style="background:#ffffff; color:#111111; border-color:#cccccc;"
					/>
				</div>
				<div>
					<label for="slug" class="mb-1 block text-sm font-medium" style="color:#111111;">
						URL Slug
					</label>
					<div class="flex items-center gap-1">
						<span class="text-sm" style="color:#666666;">/</span>
						<input
							id="slug"
							name="slug"
							type="text"
							bind:value={slug}
							oninput={() => { isDirty = true; }}
							pattern="[a-z0-9\-]+"
							class="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1"
							style="background:#ffffff; color:#111111; border-color:#cccccc;"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="rounded-lg border mt-4" style="border-color:#dddddd; background:#f9f9f9;">
			<button
				type="button"
				onclick={() => { seoOpen = !seoOpen; }}
				class="flex w-full items-center gap-2 px-4 py-3 text-left"
				style="color:#111111;"
			>
				<span class="text-xs" style="color:#999999;">{seoOpen ? '▼' : '▶'}</span>
				<span class="text-sm font-semibold uppercase tracking-wider" style="color:#555555;">
					SEO & Social Sharing
				</span>
				{#if !seoOpen && description}
					<span class="truncate text-xs" style="color:#999999;">
						{description.slice(0, 60)}{description.length > 60 ? '...' : ''}
					</span>
				{/if}
			</button>

			{#if seoOpen}
				<div class="space-y-4 border-t px-4 pb-4 pt-3" style="border-color:#dddddd;">
					<div>
						<label for="description" class="mb-1 block text-sm font-medium" style="color:#111111;">
							Meta Description
							<span class="ml-1 font-normal" style="color:#666666;">(shown in Google & social previews)</span>
						</label>
						<textarea
							id="description"
							name="description"
							bind:value={description}
							oninput={() => { isDirty = true; }}
							rows="2"
							placeholder="A compelling 150-160 character description of this page..."
							class="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1"
							style="background:#ffffff; color:#111111; border-color:#cccccc;"
						></textarea>
						<p class="mt-1 text-xs" style="color:{descLength > 160 ? '#d97706' : descLength > 0 ? '#16a34a' : '#999999'};">
							{descLength}/160 characters {descLength > 160 ? '(may be truncated)' : descLength >= 120 && descLength <= 160 ? '(ideal length)' : ''}
						</p>
					</div>

					<div>
						<label for="ogImage" class="mb-1 block text-sm font-medium" style="color:#111111;">
							Social Image
							<span class="ml-1 font-normal" style="color:#666666;">(optional - shown when shared on social media)</span>
						</label>
						<input
							id="ogImage"
							name="ogImage"
							type="text"
							bind:value={ogImage}
							oninput={() => { isDirty = true; }}
							placeholder="/img/og-image.webp"
							class="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1"
							style="background:#ffffff; color:#111111; border-color:#cccccc;"
						/>
						{#if ogImage}
							<div class="mt-2">
								<img src={ogImage} alt="Social preview" class="h-24 rounded border object-cover" style="border-color:#cccccc;" />
							</div>
						{/if}
						<p class="mt-1 text-xs" style="color:#999999;">
							Recommended: 1200x630px. Leave blank to use site default.
						</p>
					</div>
				</div>
			{/if}
		</div>

		<input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
	</form>

	<div class="border-t pt-6" style="border-color:#dddddd;">
		<h2 class="mb-4 text-lg font-semibold" style="color:#111111;">Content Blocks</h2>
		<BlockEditor initialBlocks={data.page.blocks ?? []} onUpdate={handleBlocksUpdate} resetKey={serverDataVersion} />
	</div>

	<div class="sticky bottom-4 flex justify-end">
		<button
			type="button"
			onclick={handleSave}
			disabled={!isDirty || saving}
			class="rounded-lg px-6 py-2 font-medium transition-colors disabled:opacity-50"
			style="background:#cc0000; color:#ffffff;"
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
