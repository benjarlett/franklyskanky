<script lang="ts">
	import type { PageData } from './$types';
	import { BlockRenderer } from '$lib/components/blocks';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	let pageDescription = $derived(data.page.description ?? '');

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'MusicGroup',
		name: 'Frankly Skanky',
		description: 'Sacred dub roots reggae band based in Stroud, Gloucestershire, UK.',
		genre: ['Reggae', 'Dub', 'Roots Reggae'],
		url: 'https://franklyskanky.co.uk',
		image: 'https://franklyskanky.co.uk/frankly-logo.jpg',
		location: {
			'@type': 'Place',
			name: 'Stroud',
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Stroud',
				addressRegion: 'Gloucestershire',
				addressCountry: 'GB'
			}
		},
		member: [
			{ '@type': 'OrganizationRole', member: { '@type': 'Person', name: 'Kardien Gerb Gerbrands' }, roleName: 'Vocals, Guitar, Dub Siren' },
			{ '@type': 'OrganizationRole', member: { '@type': 'Person', name: 'Ben Jamin Jah Jarlett' }, roleName: 'Bass' },
			{ '@type': 'OrganizationRole', member: { '@type': 'Person', name: 'Jon Wally Robinson' }, roleName: 'Drums' },
			{ '@type': 'OrganizationRole', member: { '@type': 'Person', name: 'Crispin Pin Hebron' }, roleName: 'Alto and Baritone Saxophone, Percussion' }
		],
		sameAs: [
			'https://www.facebook.com/franklyskanqui'
		]
	};
</script>

<svelte:head>
	<title>Frankly Skanky — Sacred Dub Roots Reggae from Stroud</title>
	{#if pageDescription}
		<meta name="description" content={pageDescription} />
	{/if}
	<meta property="og:title" content="Frankly Skanky — Sacred Dub Roots Reggae from Stroud" />
	{#if pageDescription}
		<meta property="og:description" content={pageDescription} />
	{/if}
	<meta property="og:url" content="https://franklyskanky.co.uk" />
	<meta property="og:site_name" content="Frankly Skanky" />
	<meta name="geo.region" content="GB-GLS" />
	<meta name="geo.placename" content="Stroud, Gloucestershire" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
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
