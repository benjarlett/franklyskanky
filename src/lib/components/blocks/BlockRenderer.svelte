<script lang="ts">
	import type { Block } from '$lib/server/db/schema';
	import TextBlock from './TextBlock.svelte';
	import SectionBlock from './SectionBlock.svelte';
	import QuoteBlock from './QuoteBlock.svelte';
	import CTABlock from './CTABlock.svelte';
	import HRBlock from './HRBlock.svelte';
	import ImageBlock from './ImageBlock.svelte';
	import YouTubeBlock from './YouTubeBlock.svelte';

	let { blocks }: { blocks: Block[] } = $props();
</script>

{#each blocks as block (block.id)}
	{#if block.type === 'text'}
		<TextBlock {block} />
	{:else if block.type === 'section'}
		<SectionBlock {block} />
	{:else if block.type === 'quote'}
		<QuoteBlock {block} />
	{:else if block.type === 'cta'}
		<CTABlock {block} />
	{:else if block.type === 'hr'}
		<HRBlock />
	{:else if block.type === 'image'}
		<ImageBlock {block} />
	{:else if block.type === 'youtube'}
		<YouTubeBlock {block} />
	{/if}
{/each}
