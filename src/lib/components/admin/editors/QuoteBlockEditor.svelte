<script lang="ts">
	import type { QuoteBlock } from '$lib/server/db/schema';

	let {
		block,
		onUpdate
	}: {
		block: QuoteBlock;
		onUpdate: (updates: Partial<QuoteBlock>) => void;
	} = $props();

	let text = $state(block.text);
	let attribution = $state(block.attribution ?? '');

	const handleTextChange = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;
		text = target.value;
		onUpdate({ text });
	};

	const handleAttributionChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		attribution = target.value;
		onUpdate({ attribution: attribution || undefined });
	};
</script>

<div class="space-y-3">
	<div>
		<label class="mb-1 block text-xs text-muted-foreground">Quote Text</label>
		<textarea
			value={text}
			oninput={handleTextChange}
			placeholder="Enter the quote..."
			rows="3"
			class="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground italic focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
		></textarea>
	</div>

	<div>
		<label class="mb-1 block text-xs text-muted-foreground">Attribution (optional)</label>
		<input
			type="text"
			value={attribution}
			oninput={handleAttributionChange}
			placeholder="— Author name"
			class="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground"
		/>
	</div>
</div>
