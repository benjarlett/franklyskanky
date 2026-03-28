<script lang="ts">
	import type { CTABlock as CTABlockType } from '$lib/server/db/schema';

	let { block }: { block: CTABlockType } = $props();
</script>

<div class="links">
	{#each block.links as link}
		<a href={link.href}>{link.text}</a>
	{/each}
</div>
