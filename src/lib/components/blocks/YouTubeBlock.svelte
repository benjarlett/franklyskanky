<script lang="ts">
	import type { YouTubeBlock as YouTubeBlockType } from '$lib/server/db/schema';

	let { block }: { block: YouTubeBlockType } = $props();

	let loaded = $state(false);
	const thumb = `https://i.ytimg.com/vi/${block.videoId}/hqdefault.jpg`;
</script>

<div class="video-container">
	{#if loaded}
		<iframe
			width="560"
			height="315"
			src="https://www.youtube-nocookie.com/embed/{block.videoId}?autoplay=1"
			title={block.caption ?? 'YouTube video'}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	{:else}
		<button class="yt-facade" onclick={() => loaded = true} aria-label="Play video">
			<img src={thumb} alt={block.caption ?? 'YouTube video'} width="560" height="315" loading="lazy" />
			<span class="yt-play">▶</span>
		</button>
	{/if}
</div>
{#if block.caption}
	<p class="yt-caption">{block.caption}</p>
{/if}

<style>
	.yt-facade {
		all: unset;
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
		cursor: pointer;
	}

	.yt-facade img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.yt-play {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 68px;
		height: 48px;
		background: #cc0000;
		color: #ffffff;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
	}

	.yt-facade:hover .yt-play {
		background: #ff0000;
	}

	.yt-caption {
		font-size: 0.9rem;
		color: #666666;
		text-align: center;
		margin-top: 0.5rem;
	}
</style>
