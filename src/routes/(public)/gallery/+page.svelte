<script lang="ts">
	import type { PageData } from './$types';
	import type { ImageBlock } from '$lib/server/db/schema';

	let { data }: { data: PageData } = $props();

	const images = (data.page.blocks ?? []).filter((b): b is ImageBlock => b.type === 'image');
	let lightbox = $state<number | null>(null);

	function openLightbox(i: number) { lightbox = i; }
	function closeLightbox() { lightbox = null; }

	function handleKey(e: KeyboardEvent) {
		if (lightbox === null) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowRight' && lightbox < images.length - 1) lightbox++;
		if (e.key === 'ArrowLeft' && lightbox > 0) lightbox--;
	}
</script>

<svelte:head>
	<title>Gallery — Frankly Skanky</title>
	<meta name="description" content="Photos of Frankly Skanky — sacred dub roots reggae from Stroud." />
</svelte:head>

<svelte:window onkeydown={handleKey} />

<h1>Gallery</h1>

<div class="gallery-grid">
	{#each images as img, i}
		<button class="gallery-item" onclick={() => openLightbox(i)} aria-label={img.alt || 'View image'}>
			<img src={img.url} alt={img.alt || 'Frankly Skanky'} loading="lazy" />
		</button>
	{/each}
</div>

{#if lightbox !== null}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="lightbox" onclick={closeLightbox} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="lightbox-inner" onclick={(e) => e.stopPropagation()}>
			<img src={images[lightbox].url} alt={images[lightbox].alt || 'Frankly Skanky'} />
			{#if images[lightbox].caption}
				<p class="lightbox-caption">{images[lightbox].caption}</p>
			{/if}
			<div class="lightbox-controls">
				{#if lightbox > 0}
					<button onclick={() => lightbox!--}>← Prev</button>
				{/if}
				<button class="lightbox-close" onclick={closeLightbox}>✕ Close</button>
				{#if lightbox < images.length - 1}
					<button onclick={() => lightbox!++}>Next →</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.gallery-item {
		all: unset;
		cursor: pointer;
		display: block;
		overflow: hidden;
		border-left: 4px solid #cc0000;
		aspect-ratio: 1;
	}

	.gallery-item:nth-child(3n+2) { border-left-color: #ffd700; }
	.gallery-item:nth-child(3n+3) { border-left-color: #1a7b1a; }

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.2s ease, opacity 0.2s;
	}

	.gallery-item:hover img {
		transform: scale(1.04);
		opacity: 0.9;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.92);
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.lightbox-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		max-width: 90vw;
		max-height: 90vh;
	}

	.lightbox-inner img {
		max-width: 100%;
		max-height: 72vh;
		object-fit: contain;
		display: block;
	}

	.lightbox-caption {
		color: rgba(255,255,255,0.7);
		font-size: 1rem;
		margin: 0;
		text-align: center;
	}

	.lightbox-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.lightbox-controls button {
		font-family: inherit;
		font-size: 1rem;
		font-weight: 700;
		padding: 0.5rem 1.25rem;
		border: none;
		cursor: pointer;
		background: #cc0000;
		color: #ffffff;
	}

	.lightbox-controls button:hover { background: #ff0000; }
	.lightbox-close { background: #333333; }
	.lightbox-close:hover { background: #555555; }
</style>
