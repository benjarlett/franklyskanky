<script lang="ts">
	import type { Block } from '$lib/server/db/schema';
	import TextBlockEditor from './editors/TextBlockEditor.svelte';
	import SectionBlockEditor from './editors/SectionBlockEditor.svelte';
	import QuoteBlockEditor from './editors/QuoteBlockEditor.svelte';
	import CTABlockEditor from './editors/CTABlockEditor.svelte';
	import ImageBlockEditor from './editors/ImageBlockEditor.svelte';
	import YouTubeBlockEditor from './editors/YouTubeBlockEditor.svelte';
	import NewsfeedBlockEditor from './editors/NewsfeedBlockEditor.svelte';

	let {
		initialBlocks = [],
		onUpdate,
		resetKey = 0
	}: {
		initialBlocks: Block[];
		onUpdate: (blocks: Block[]) => void;
		resetKey?: number;
	} = $props();

	let blocks = $state<Block[]>([...initialBlocks]);
	let lastResetKey = $state(resetKey);
	let expandedId = $state<string | null>(initialBlocks[0]?.id ?? null);

	// Sync blocks when resetKey changes (parent signals data refresh)
	$effect(() => {
		if (resetKey !== lastResetKey) {
			lastResetKey = resetKey;
			blocks = [...initialBlocks];
			expandedId = initialBlocks[0]?.id ?? null;
		}
	});

	const createEmptyBlock = (type: Block['type']): Block => {
		const id = crypto.randomUUID();
		switch (type) {
			case 'text':
				return { id, type: 'text', content: '<p></p>' };
			case 'section':
				return { id, type: 'section', imageUrl: '', imageAlt: '', content: '<p></p>', flip: false };
			case 'quote':
				return { id, type: 'quote', text: '' };
			case 'cta':
				return { id, type: 'cta', links: [{ text: '', href: '' }] };
			case 'hr':
				return { id, type: 'hr' };
			case 'image':
				return { id, type: 'image', url: '', alt: '' };
			case 'youtube':
				return { id, type: 'youtube', videoId: '', caption: '' };
			case 'newsfeed':
				return { id, type: 'newsfeed', posts: [] };
		}
	};

	const getBlockPreview = (block: Block): string => {
		switch (block.type) {
			case 'text': {
				const text = block.content.replace(/<[^>]*>/g, '').trim();
				return text.length > 80 ? text.slice(0, 80) + '...' : text || 'Empty text block';
			}
			case 'section': {
				const text = block.content.replace(/<[^>]*>/g, '').trim();
				const prefix = block.title ? block.title + ' — ' : '';
				const preview = prefix + text;
				return preview.length > 80 ? preview.slice(0, 80) + '...' : preview || 'Empty section';
			}
			case 'quote':
				return block.text ? (block.text.length > 80 ? block.text.slice(0, 80) + '...' : block.text) : 'Empty quote';
			case 'cta': {
				const links = block.links.map((l) => l.text).filter(Boolean).join(', ');
				return links || 'No links';
			}
			case 'hr':
				return '───';
			case 'image':
				return block.alt || block.url || 'No image set';
			case 'youtube':
				return block.videoId ? `Video: ${block.videoId}` : 'No video set';
			default:
				return '';
		}
	};

	const updateBlock = (index: number, updates: Partial<Block>) => {
		blocks[index] = { ...blocks[index], ...updates } as Block;
		blocks = [...blocks];
		onUpdate(blocks);
	};

	const addBlock = (type: Block['type']) => {
		const newBlock = createEmptyBlock(type);
		blocks = [...blocks, newBlock];
		expandedId = newBlock.id;
		onUpdate(blocks);
	};

	const removeBlock = (index: number) => {
		if (blocks[index].id === expandedId) expandedId = null;
		blocks = blocks.filter((_, i) => i !== index);
		onUpdate(blocks);
	};

	const moveBlock = (from: number, to: number) => {
		if (to < 0 || to >= blocks.length) return;
		const block = blocks[from];
		const newBlocks = blocks.filter((_, i) => i !== from);
		newBlocks.splice(to, 0, block);
		blocks = newBlocks;
		onUpdate(blocks);
	};

	const toggleBlock = (id: string) => {
		expandedId = expandedId === id ? null : id;
	};

	const blockTypeLabels: Record<Block['type'], string> = {
		text: 'Text',
		section: 'Section',
		quote: 'Quote',
		cta: 'CTA Links',
		hr: 'Divider',
		image: 'Image',
		youtube: 'YouTube',
		newsfeed: 'News Feed'
	};
</script>

<div class="space-y-2">
	<!-- Block list -->
	{#each blocks as block, index (block.id)}
		{@const isExpanded = expandedId === block.id}
		<div class="group relative rounded-lg border border-border/20 {isExpanded ? 'ring-1 ring-primary/20' : ''}" style="background:#ffffff; color:#111111;">
			<!-- Block header — always visible, clickable to toggle -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={() => toggleBlock(block.id)}
				class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5"
			>
				<span class="rounded px-1.5 py-0.5 text-xs font-medium {isExpanded ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'}">
					{isExpanded ? 'Close' : 'Open'}
				</span>
				<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
					{blockTypeLabels[block.type]}
				</span>
				{#if !isExpanded}
					<span class="truncate text-xs text-muted-foreground/50">
						{getBlockPreview(block)}
					</span>
				{/if}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span class="ml-auto flex items-center gap-2" onclick={(e) => e.stopPropagation()}>
					{#if isExpanded}
						<button
							type="button"
							onclick={() => removeBlock(index)}
							class="rounded-md bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/80"
						>
							Remove Block
						</button>
					{/if}
					<button
						type="button"
						onclick={() => moveBlock(index, index - 1)}
						disabled={index === 0}
						class="rounded p-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
						title="Move up"
					>
						↑
					</button>
					<button
						type="button"
						onclick={() => moveBlock(index, index + 1)}
						disabled={index === blocks.length - 1}
						class="rounded p-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
						title="Move down"
					>
						↓
					</button>
				</span>
			</div>

			<!-- Block editor — only shown when expanded -->
			{#if isExpanded}
				<div class="border-t border-border/10 p-4">
					{#if block.type === 'text'}
						<TextBlockEditor {block} onUpdate={(content) => updateBlock(index, { content })} />
					{:else if block.type === 'section'}
						<SectionBlockEditor
							{block}
							onUpdate={(updates) => updateBlock(index, updates)}
						/>
					{:else if block.type === 'quote'}
						<QuoteBlockEditor
							{block}
							onUpdate={(updates) => updateBlock(index, updates)}
						/>
					{:else if block.type === 'cta'}
						<CTABlockEditor {block} onUpdate={(updates) => updateBlock(index, updates)} />
					{:else if block.type === 'hr'}
						<div class="py-2 text-center text-sm text-muted-foreground">
							Horizontal divider — no options
						</div>
					{:else if block.type === 'image'}
						<ImageBlockEditor
							{block}
							onUpdate={(updates) => updateBlock(index, updates)}
						/>
					{:else if block.type === 'youtube'}
						<YouTubeBlockEditor
							{block}
							onUpdate={(updates) => updateBlock(index, updates)}
						/>
					{:else if block.type === 'newsfeed'}
						<NewsfeedBlockEditor
							{block}
							onUpdate={(updates) => updateBlock(index, updates)}
						/>
					{/if}
				</div>
			{/if}
		</div>
	{/each}

	<!-- Add block toolbar -->
	<div class="flex flex-wrap justify-center gap-2 rounded-lg border-2 border-dashed border-border/30 py-4">
		<button
			type="button"
			onclick={() => addBlock('text')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ Text
		</button>
		<button
			type="button"
			onclick={() => addBlock('section')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ Section
		</button>
		<button
			type="button"
			onclick={() => addBlock('quote')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ Quote
		</button>
		<button
			type="button"
			onclick={() => addBlock('cta')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ CTA
		</button>
		<button
			type="button"
			onclick={() => addBlock('hr')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ Divider
		</button>
		<button
			type="button"
			onclick={() => addBlock('image')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ Image
		</button>
		<button
			type="button"
			onclick={() => addBlock('youtube')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ YouTube
		</button>
		<button
			type="button"
			onclick={() => addBlock('newsfeed')}
			class="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-foreground hover:bg-accent/20"
		>
			+ News Feed
		</button>
	</div>

</div>
