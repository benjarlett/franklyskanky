<script lang="ts">
	import type { TextBlock as TextBlockType } from '$lib/server/db/schema';

	let { block }: { block: TextBlockType } = $props();
</script>

{@html block.content}
