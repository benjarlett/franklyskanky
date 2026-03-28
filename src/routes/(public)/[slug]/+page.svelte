<script lang="ts">
	import type { PageData } from './$types';
	import { BlockRenderer } from '$lib/components/blocks';

	let { data }: { data: PageData } = $props();

	let pageTitle = $derived(`${data.page.title} - Dee Jarlett`);
	let pageDescription = $derived(data.page.description ?? '');
	let ogImage = $derived(data.page.ogImage ?? '/img/og-default.webp');
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
	<meta property="og:url" content="https://franklyskanky.co.uk/{data.page.slug}" />
	<meta property="og:site_name" content="Dee Jarlett" />
</svelte:head>

{#if data.page.blocks && data.page.blocks.length > 0}
	<BlockRenderer blocks={data.page.blocks} />
{:else}
	<p>No content available.</p>
{/if}
