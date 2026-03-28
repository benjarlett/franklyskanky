<script lang="ts">
	import type { ImageBlock as ImageBlockType } from '$lib/server/db/schema';

	let { block }: { block: ImageBlockType } = $props();
</script>

<figure>
	<img src={block.url} alt={block.alt} class="w-full h-auto" />
	{#if block.caption}
		<figcaption>{block.caption}</figcaption>
	{/if}
</figure>
