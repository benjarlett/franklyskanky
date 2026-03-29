<script lang="ts">
	import type { FacebookVideoBlock } from '$lib/server/db/schema';

	let {
		block,
		onUpdate
	}: {
		block: FacebookVideoBlock;
		onUpdate: (updates: Partial<FacebookVideoBlock>) => void;
	} = $props();
</script>

<div class="space-y-3">
	<div>
		<label class="mb-1 block text-xs font-medium text-muted-foreground">Facebook Video URL</label>
		<input
			type="text"
			value={block.url}
			oninput={(e) => onUpdate({ url: (e.target as HTMLInputElement).value.trim() })}
			placeholder="https://www.facebook.com/franklyskanqui/videos/..."
			class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
		/>
	</div>
	<div>
		<label class="mb-1 block text-xs font-medium text-muted-foreground">Caption (optional)</label>
		<input
			type="text"
			value={block.caption ?? ''}
			oninput={(e) => onUpdate({ caption: (e.target as HTMLInputElement).value })}
			placeholder="Caption"
			class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
		/>
	</div>
	<label class="flex cursor-pointer items-center gap-2 text-sm">
		<input
			type="checkbox"
			checked={block.portrait === true}
			onchange={(e) => onUpdate({ portrait: (e.target as HTMLInputElement).checked })}
		/>
		Portrait video (vertical/9:16)
	</label>
</div>
