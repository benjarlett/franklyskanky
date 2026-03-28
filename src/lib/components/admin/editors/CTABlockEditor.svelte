<script lang="ts">
	import type { CTABlock } from '$lib/server/db/schema';

	let {
		block,
		onUpdate
	}: {
		block: CTABlock;
		onUpdate: (updates: Partial<CTABlock>) => void;
	} = $props();

	let links = $state(block.links.map((link) => ({ ...link })));

	const updateLinks = () => {
		onUpdate({ links: links.filter((l) => l.text.trim() || l.href.trim()) });
	};

	const addLink = () => {
		links = [...links, { text: '', href: '' }];
	};

	const removeLink = (index: number) => {
		links = links.filter((_, i) => i !== index);
		updateLinks();
	};

	const handleTextChange = (index: number, value: string) => {
		links[index].text = value;
		updateLinks();
	};

	const handleHrefChange = (index: number, value: string) => {
		links[index].href = value;
		updateLinks();
	};
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<span class="text-xs text-muted-foreground">CTA Links</span>
		<button
			type="button"
			onclick={addLink}
			class="rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90"
		>
			+ Add Link
		</button>
	</div>

	{#if links.length === 0}
		<p class="text-sm text-muted-foreground italic">No links added. Click "Add Link" to start.</p>
	{:else}
		<div class="space-y-2">
			{#each links as link, index (index)}
				<div class="flex gap-2 rounded-md border border-border bg-muted/30 p-2">
					<input
						type="text"
						value={link.text}
						oninput={(e) => handleTextChange(index, (e.target as HTMLInputElement).value)}
						placeholder="Link text"
						aria-label="Link text"
						class="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
					/>
					<input
						type="text"
						value={link.href}
						oninput={(e) => handleHrefChange(index, (e.target as HTMLInputElement).value)}
						placeholder="/page or https://..."
						aria-label="Link URL"
						class="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
					/>
					<button
						type="button"
						onclick={() => removeLink(index)}
						class="rounded px-2 py-1 text-destructive hover:bg-destructive/10"
						title="Remove link"
					>
						×
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
