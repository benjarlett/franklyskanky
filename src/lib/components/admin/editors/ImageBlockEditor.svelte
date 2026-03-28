<script lang="ts">
	import type { ImageBlock } from '$lib/server/db/schema';
	import ImageUpload from '../ImageUpload.svelte';

	let {
		block,
		onUpdate
	}: {
		block: ImageBlock;
		onUpdate: (updates: Partial<ImageBlock>) => void;
	} = $props();
</script>

<div class="flex gap-4">
	<!-- Upload / preview on the left -->
	<ImageUpload
		value={block.url}
		onchange={(url) => onUpdate({ url })}
		class="w-48 shrink-0"
	/>

	<!-- Fields on the right -->
	<div class="flex-1 space-y-3">
		<div>
			<label class="mb-1 block text-xs font-medium text-muted-foreground">Image URL</label>
			<input
				type="text"
				value={block.url}
				oninput={(e) => onUpdate({ url: (e.target as HTMLInputElement).value })}
				placeholder="Upload an image or paste a URL"
				class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
			/>
		</div>
		<div>
			<label class="mb-1 block text-xs font-medium text-muted-foreground">Alt Text</label>
			<input
				type="text"
				value={block.alt}
				oninput={(e) => onUpdate({ alt: (e.target as HTMLInputElement).value })}
				placeholder="Describe the image for accessibility"
				class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
			/>
		</div>
		<div>
			<label class="mb-1 block text-xs font-medium text-muted-foreground">Caption (optional)</label>
			<input
				type="text"
				value={block.caption ?? ''}
				oninput={(e) => {
					const val = (e.target as HTMLInputElement).value;
					onUpdate({ caption: val || undefined });
				}}
				placeholder="Optional caption below the image"
				class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
			/>
		</div>
	</div>
</div>
