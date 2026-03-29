<script lang="ts">
	import { onMount } from 'svelte';
	import type { FacebookVideoBlock as FacebookVideoBlockType } from '$lib/server/db/schema';

	let { block }: { block: FacebookVideoBlockType } = $props();

	let consented = $state(false);

	onMount(() => {
		consented = localStorage.getItem('cookie-consent') === 'accepted';
		window.addEventListener('storage', () => {
			consented = localStorage.getItem('cookie-consent') === 'accepted';
		});
	});

	const isPortrait = block.portrait === true;
	const embedWidth = isPortrait ? 314 : 560;
	const embedHeight = isPortrait ? 560 : 314;
	const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(block.url)}&show_text=false&width=${embedWidth}&height=${embedHeight}`;
</script>

<div class="fb-video-wrap">
	{#if consented}
		<div class="fb-iframe-wrap" class:portrait={isPortrait}>
			<iframe
				src={embedUrl}
				width={embedWidth}
				height={embedHeight}
				style="border:none;overflow:hidden"
				scrolling="no"
				frameborder="0"
				allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
				allowfullscreen
				title={block.caption ?? 'Facebook video'}
			></iframe>
		</div>
	{:else}
		<div class="fb-blocked">
			<p>This Facebook video requires cookies to load.</p>
			<a href={block.url} target="_blank" rel="noopener noreferrer">Watch on Facebook →</a>
		</div>
	{/if}
	{#if block.caption}
		<p class="fb-caption">{block.caption}</p>
	{/if}
</div>

<style>
	.fb-video-wrap {
		margin: 1.5rem 0;
	}

	.fb-iframe-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 16/9;
	}

	.fb-iframe-wrap.portrait {
		aspect-ratio: 9/16;
		max-width: 360px;
		margin-inline: auto;
	}

	.fb-iframe-wrap iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.fb-blocked {
		background: #f5f5f5;
		border-left: 4px solid #cc0000;
		padding: 1rem 1.25rem;
	}

	.fb-blocked p {
		margin: 0 0 0.5rem;
		color: #444444;
		font-size: 1rem;
	}

	.fb-blocked a {
		color: #cc0000;
		font-weight: 700;
		text-decoration: none;
	}

	.fb-blocked a:hover {
		text-decoration: underline;
	}

	.fb-caption {
		font-size: 0.85rem;
		color: #666666;
		text-align: center;
		margin-top: 0.4rem;
	}
</style>
