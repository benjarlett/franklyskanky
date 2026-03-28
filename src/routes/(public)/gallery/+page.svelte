<script lang="ts">
	let lightbox = $state<string | null>(null);

	const images = [
		'/images/473621504_2986767608156238_2022304001310573614_n.jpg',
		'/images/484249459_1228936505902142_4526354981268671193_n.jpg',
		'/images/49413424_1169080719924945_1676532546894036992_n.jpg',
		'/images/49508065_1164207747078909_8363052699775664128_n.jpg',
		'/images/49649147_1169080679924949_2807150896218112000_n.jpg',
		'/images/49661457_1169080746591609_640672510538416128_n.jpg',
		'/images/49897506_1169080696591614_6404834323341508608_n.jpg',
		'/images/502670255_3120825464750451_6267678451213978914_n.jpg',
		'/images/505863528_3135451153287882_3123194817141562095_n.jpg',
		'/images/69479179_1326632740836408_6566398602036379648_n.jpg',
		'/images/71170083_1352573964908952_2753780043460116480_n.jpg',
	];

	function openLightbox(src: string) { lightbox = src; }
	function closeLightbox() { lightbox = null; }

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowRight') {
			const i = images.indexOf(lightbox!);
			if (i < images.length - 1) lightbox = images[i + 1];
		}
		if (e.key === 'ArrowLeft') {
			const i = images.indexOf(lightbox!);
			if (i > 0) lightbox = images[i - 1];
		}
	}
</script>

<svelte:head>
	<title>Gallery — Frankly Skanky</title>
	<meta name="description" content="Photos of Frankly Skanky — sacred dub roots reggae from Stroud." />
</svelte:head>

<svelte:window onkeydown={handleKey} />

<h1>Gallery</h1>

<div class="gallery-grid">
	{#each images as src}
		<button class="gallery-item" onclick={() => openLightbox(src)} aria-label="View image">
			<img {src} alt="Frankly Skanky" loading="lazy" />
		</button>
	{/each}
</div>

{#if lightbox}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="lightbox" onclick={closeLightbox} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="lightbox-inner" onclick={(e) => e.stopPropagation()}>
			<img src={lightbox} alt="Frankly Skanky" />
			<div class="lightbox-controls">
				{#if images.indexOf(lightbox) > 0}
					<button onclick={() => lightbox = images[images.indexOf(lightbox!) - 1]}>← Prev</button>
				{/if}
				<button class="lightbox-close" onclick={closeLightbox}>✕ Close</button>
				{#if images.indexOf(lightbox) < images.length - 1}
					<button onclick={() => lightbox = images[images.indexOf(lightbox!) + 1]}>Next →</button>
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

	/* Lightbox */
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
		max-height: 75vh;
		object-fit: contain;
		display: block;
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
		letter-spacing: 0.03em;
	}

	.lightbox-controls button:hover { background: #ff0000; }

	.lightbox-close { background: #333333; }
	.lightbox-close:hover { background: #555555; }
</style>
