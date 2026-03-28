<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Pages - Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-primary">Pages</h1>
		<a
			href="/admin/pages/new"
			class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
		>
			+ New Page
		</a>
	</div>

	<div class="rounded-lg border border-border/20" style="background:#ffffff; color:#111111;">
		<table class="w-full">
			<thead>
				<tr class="border-b border-border/20 text-left">
					<th class="px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
					<th class="px-4 py-3 text-sm font-medium text-muted-foreground">Slug</th>
					<th class="px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
					<th class="px-4 py-3 text-sm font-medium text-muted-foreground">Updated</th>
					<th class="px-4 py-3 text-sm font-medium text-muted-foreground"></th>
				</tr>
			</thead>
			<tbody>
				{#each data.pages as page}
					<tr class="border-b border-border/10 hover:bg-accent/5">
						<td class="px-4 py-3">
							<a
								href="/admin/pages/{page.slug}"
								style="color:#1d4ed8; font-weight:500;"
							>
								{page.title}
							</a>
						</td>
						<td class="px-4 py-3 text-sm text-muted-foreground">
							/{page.slug === 'home' ? '' : page.slug}
						</td>
						<td class="px-4 py-3">
							{#if page.published}
								<span
									class="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500"
								>
									Published
								</span>
							{:else}
								<span
									class="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-500"
								>
									Draft
								</span>
							{/if}
						</td>
						<td class="px-4 py-3 text-sm text-muted-foreground">
							{page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : '-'}
						</td>
						<td class="px-4 py-3 text-right">
							<a
								href="/admin/pages/{page.slug}"
								style="color:#1d4ed8; font-size:0.875rem;"
							>
								Edit
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if data.pages.length === 0}
			<div class="px-4 py-12 text-center text-muted-foreground">
				No pages yet. Create your first page!
			</div>
		{/if}
	</div>
</div>
