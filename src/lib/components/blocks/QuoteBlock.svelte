<script lang="ts">
	import type { QuoteBlock as QuoteBlockType } from '$lib/server/db/schema';

	let { block }: { block: QuoteBlockType } = $props();
</script>

<blockquote>
	<p>{block.text}</p>
	{#if block.attribution}
		<cite>— {block.attribution}</cite>
	{/if}
</blockquote>
