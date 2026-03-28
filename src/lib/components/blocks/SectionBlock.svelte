<script lang="ts">
	import type { SectionBlock as SectionBlockType } from '$lib/server/db/schema';

	let { block }: { block: SectionBlockType } = $props();

	// Default to 'side' layout if not specified
	let isHero = $derived(block.layout === 'hero');
</script>

<div class="section" class:flip={block.flip} class:hero={isHero}>
	<img src={block.imageUrl} alt={block.imageAlt} />
	<div class="section-content">
		{#if block.title}
			<h3>{block.title}</h3>
		{/if}
		{@html block.content}
	</div>
</div>
