<script lang="ts">
	import type { YouTubeBlock } from '$lib/server/db/schema';

	let {
		block,
		onUpdate
	}: {
		block: YouTubeBlock;
		onUpdate: (updates: Partial<YouTubeBlock>) => void;
	} = $props();

	// Build a display URL from the stored videoId
	let urlValue = $state(block.videoId ? `https://www.youtube.com/watch?v=${block.videoId}` : '');

	// Extract video ID from various YouTube URL formats
	function extractVideoId(input: string): string | null {
		const trimmed = input.trim();
		if (!trimmed) return null;
		if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

		try {
			const url = new URL(trimmed);
			if (url.searchParams.has('v')) return url.searchParams.get('v');
			if (url.hostname === 'youtu.be') return url.pathname.slice(1);
			const embedMatch = url.pathname.match(/\/embed\/([\w-]+)/);
			if (embedMatch) return embedMatch[1];
		} catch {
			// not a URL
		}
		return null;
	}

	function handleInput() {
		const id = extractVideoId(urlValue);
		onUpdate({ videoId: id ?? '' });
	}
</script>

<div class="flex gap-4">
	<!-- Fields on the left -->
	<div class="flex-1 space-y-3">
		<div>
			<label class="mb-1 block text-xs font-medium text-muted-foreground">YouTube URL</label>
			<input
				type="text"
				bind:value={urlValue}
				oninput={handleInput}
				placeholder="https://www.youtube.com/watch?v=..."
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
	</div>

	<!-- Preview on the right -->
	{#if block.videoId}
		<div class="w-64 shrink-0">
			<img
				src="https://img.youtube.com/vi/{block.videoId}/mqdefault.jpg"
				alt="Video thumbnail"
				class="w-full rounded border border-border"
			/>
		</div>
	{:else}
		<div class="flex w-64 shrink-0 items-center justify-center rounded border border-dashed border-border/30 text-xs text-muted-foreground/40">
			No video
		</div>
	{/if}
</div>
