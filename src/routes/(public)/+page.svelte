<script lang="ts">
	import type { PageData } from './$types';
	import { BlockRenderer } from '$lib/components/blocks';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	let pageTitle = $derived(`${data.page.title} - Frankly Skanky`);
	let pageDescription = $derived(data.page.description ?? '');
</script>

<svelte:head>
	<title>{pageTitle}</title>
	{#if pageDescription}
		<meta name="description" content={pageDescription} />
	{/if}
	<meta property="og:title" content={pageTitle} />
	{#if pageDescription}
		<meta property="og:description" content={pageDescription} />
	{/if}
	<meta property="og:url" content="https://franklyskanky.co.uk" />
	<meta property="og:site_name" content="Frankly Skanky" />
</svelte:head>

<div class="home-layout">
	<div class="home-content prose-content">
		{#if data.page.blocks && data.page.blocks.length > 0}
			<BlockRenderer blocks={data.page.blocks} />
		{/if}
	</div>

	{#if data.homeMenu.length > 0}
		<div class="home-sidebar-wrap">
			<nav class="home-sidebar" aria-label="Explore the site">
				{#each data.homeMenu as item (item.id)}
					<a href={resolve(item.href)} class="home-sidebar-link">
						{item.label}
					</a>
				{/each}
			</nav>
			<img src="/dice.png" alt="Lion of Judah" class="home-sidebar-lion" />
		</div>
	{/if}
</div>
