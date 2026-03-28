<script lang="ts">
	import type { YouTubeBlock as YouTubeBlockType } from '$lib/server/db/schema';

	let { block }: { block: YouTubeBlockType } = $props();
</script>

<div class="video-container">
	<iframe
		width="560"
		height="315"
		src="https://www.youtube.com/embed/{block.videoId}"
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	></iframe>
</div>
{#if block.caption}
	<p class="text-sm text-muted-foreground" style="text-align: center; margin-top: 0.5rem;">{block.caption}</p>
{/if}
