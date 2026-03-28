<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import type { SectionBlock } from '$lib/server/db/schema';
	import ImageUpload from '../ImageUpload.svelte';

	let {
		block,
		onUpdate
	}: {
		block: SectionBlock;
		onUpdate: (updates: Partial<SectionBlock>) => void;
	} = $props();

	let element: HTMLElement;
	let editor: Editor | null = $state(null);

	let imageUrl = $state(block.imageUrl);
	let imageAlt = $state(block.imageAlt);
	let title = $state(block.title ?? '');
	let flip = $state(block.flip);

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Link.configure({ openOnClick: false }),
				Placeholder.configure({ placeholder: 'Section content...' })
			],
			content: block.content,
			onUpdate: ({ editor }) => {
				onUpdate({ content: editor.getHTML() });
			},
			editorProps: {
				attributes: {
					class: 'prose max-w-none focus:outline-none min-h-[80px] p-3'
				}
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	const handleImageUrlChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		imageUrl = target.value;
		onUpdate({ imageUrl });
	};

	const handleImageAltChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		imageAlt = target.value;
		onUpdate({ imageAlt });
	};

	const handleTitleChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		title = target.value;
		onUpdate({ title: title || undefined });
	};

	const handleFlipChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		flip = target.checked;
		onUpdate({ flip });
	};
</script>

<div class="space-y-4">
	<!-- Flip toggle at top -->
	<label class="flex items-center gap-2 text-sm text-foreground">
		<input
			type="checkbox"
			checked={flip}
			onchange={handleFlipChange}
			class="rounded border-border"
		/>
		Flip layout (image on right)
	</label>

	<!-- Image settings with upload -->
	<div class="flex gap-4">
		<ImageUpload
			value={imageUrl}
			onchange={(url) => { imageUrl = url; onUpdate({ imageUrl: url }); }}
			class="w-32 shrink-0"
		/>
		<div class="flex-1 space-y-2">
			<div>
				<label class="mb-1 block text-xs text-muted-foreground">Image URL</label>
				<input
					type="text"
					value={imageUrl}
					oninput={handleImageUrlChange}
					placeholder="Upload or paste URL"
					class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
				/>
			</div>
			<div>
				<label class="mb-1 block text-xs text-muted-foreground">Alt Text</label>
				<input
					type="text"
					value={imageAlt}
					oninput={handleImageAltChange}
					placeholder="Describe the image..."
					class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
				/>
			</div>
		</div>
	</div>

	<!-- Title (optional) -->
	<div>
		<label class="mb-1 block text-xs text-muted-foreground">Section Title (optional)</label>
		<input
			type="text"
			value={title}
			oninput={handleTitleChange}
			placeholder="Section heading..."
			class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
		/>
	</div>

	<!-- Content editor -->
	<div>
		<label class="mb-1 block text-xs text-muted-foreground">Content</label>
		<div bind:this={element} class="rounded-md border border-border bg-background"></div>
	</div>
</div>

<style>
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		color: oklch(50% 0.05 260);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
