<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Placeholder from '@tiptap/extension-placeholder';
	import type { TextBlock } from '$lib/server/db/schema';

	let {
		block,
		onUpdate
	}: {
		block: TextBlock;
		onUpdate: (content: string) => void;
	} = $props();

	let element: HTMLElement;
	let editor: Editor | null = $state(null);
	let showSource = $state(false);
	let sourceContent = $state(block.content);
	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let hasImageSelected = $state(false);

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'text-accent underline'
					}
				}),
				Image.configure({
					inline: false,
					allowBase64: false,
					HTMLAttributes: {
						class: 'max-w-full rounded-lg'
					}
				}),
				Placeholder.configure({
					placeholder: 'Start writing...'
				})
			],
			content: block.content,
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				sourceContent = html;
				onUpdate(html);
			},
			onSelectionUpdate: ({ editor }) => {
				hasImageSelected = editor.isActive('image');
			},
			editorProps: {
				attributes: {
					class: 'prose max-w-none focus:outline-none min-h-[100px] p-3'
				}
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	const setLink = () => {
		if (!editor) return;
		const url = window.prompt('Enter URL:');
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	};

	const addImage = () => {
		fileInput.click();
	};

	const handleImageUpload = async (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file || !editor) return;
		uploading = true;
		try {
			const res = await fetch('/admin/api/upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size })
			});
			if (!res.ok) throw new Error('Failed to get upload URL');
			const { uploadUrl, publicUrl } = await res.json();
			const upload = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
			if (!upload.ok) throw new Error('Upload failed');
			editor.chain().focus().setImage({ src: publicUrl, alt: '' }).run();
		} catch (err) {
			const url = window.prompt('Upload failed. Enter image URL manually:');
			if (url) editor.chain().focus().setImage({ src: url, alt: '' }).run();
		} finally {
			uploading = false;
			fileInput.value = '';
		}
	};

	const toggleSource = () => {
		if (showSource && editor) {
			// Switching from source to visual - apply changes
			editor.commands.setContent(sourceContent);
			onUpdate(sourceContent);
		} else if (editor) {
			// Switching to source - sync content
			sourceContent = editor.getHTML();
		}
		showSource = !showSource;
	};

	const handleSourceInput = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;
		sourceContent = target.value;
		onUpdate(sourceContent);
	};
</script>

<div class="rounded-md border border-border/20">
	<!-- Toolbar -->
	<div class="flex flex-wrap gap-1 border-b border-border/20 bg-background/50 p-2">
		<!-- Headings -->
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
			class="rounded px-2 py-1 text-sm font-bold hover:bg-accent/20 {editor?.isActive('heading', { level: 1 }) ? 'bg-accent/30' : ''}"
			title="Heading 1"
		>
			H1
		</button>
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
			class="rounded px-2 py-1 text-sm font-bold hover:bg-accent/20 {editor?.isActive('heading', { level: 2 }) ? 'bg-accent/30' : ''}"
			title="Heading 2"
		>
			H2
		</button>
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
			class="rounded px-2 py-1 text-sm font-bold hover:bg-accent/20 {editor?.isActive('heading', { level: 3 }) ? 'bg-accent/30' : ''}"
			title="Heading 3"
		>
			H3
		</button>

		<span class="mx-1 border-l border-border/20"></span>

		<!-- Text formatting -->
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleBold().run()}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20 {editor?.isActive('bold') ? 'bg-accent/30' : ''}"
			title="Bold"
		>
			<strong>B</strong>
		</button>
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleItalic().run()}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20 {editor?.isActive('italic') ? 'bg-accent/30' : ''}"
			title="Italic"
		>
			<em>I</em>
		</button>
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleStrike().run()}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20 {editor?.isActive('strike') ? 'bg-accent/30' : ''}"
			title="Strikethrough"
		>
			<s>S</s>
		</button>

		<span class="mx-1 border-l border-border/20"></span>

		<!-- Lists -->
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleBulletList().run()}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20 {editor?.isActive('bulletList') ? 'bg-accent/30' : ''}"
			title="Bullet List"
		>
			• List
		</button>
		<button
			type="button"
			onclick={() => editor?.chain().focus().toggleOrderedList().run()}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20 {editor?.isActive('orderedList') ? 'bg-accent/30' : ''}"
			title="Numbered List"
		>
			1. List
		</button>

		<span class="mx-1 border-l border-border/20"></span>

		<!-- Links -->
		<button
			type="button"
			onclick={setLink}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20 {editor?.isActive('link') ? 'bg-accent/30' : ''}"
			title="Add Link"
		>
			Link
		</button>
		<button
			type="button"
			onclick={() => editor?.chain().focus().unsetLink().run()}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20"
			disabled={!editor?.isActive('link')}
			title="Remove Link"
		>
			Unlink
		</button>

		<span class="mx-1 border-l border-border/20"></span>

		<!-- Image -->
		<button
			type="button"
			onclick={addImage}
			disabled={uploading}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20"
			title="Upload Image"
		>
			{uploading ? 'Uploading...' : 'Image'}
		</button>
		{#if hasImageSelected}
			<button
				type="button"
				onclick={() => editor?.chain().focus().deleteSelection().run()}
				class="rounded px-2 py-1 text-sm text-destructive hover:bg-destructive/10"
				title="Remove selected image"
			>
				Remove
			</button>
		{/if}

		<span class="mx-1 border-l border-border/20"></span>

		<!-- Source toggle -->
		<button
			type="button"
			onclick={toggleSource}
			class="rounded px-2 py-1 text-sm hover:bg-accent/20 {showSource ? 'bg-accent/30' : ''}"
			title="Toggle HTML source"
		>
			&lt;/&gt;
		</button>
	</div>

	<input bind:this={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onchange={handleImageUpload} class="hidden" />

	<!-- Editor (always in DOM, hidden when source view active) -->
	<div bind:this={element} class="bg-background {showSource ? 'hidden' : ''}"></div>

	<!-- Source view -->
	{#if showSource}
		<textarea
			class="min-h-50 w-full resize-y bg-background p-3 font-mono text-sm text-foreground focus:outline-none"
			value={sourceContent}
			oninput={handleSourceInput}
			spellcheck="false"
		></textarea>
	{/if}
</div>

<style>
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		color: oklch(50% 0.05 260);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	/* Image selection styling */
	:global(.ProseMirror img) {
		cursor: pointer;
		transition: outline 0.15s;
		border-radius: 0.5rem;
	}

	:global(.ProseMirror img.ProseMirror-selectednode) {
		outline: 3px solid oklch(60% 0.15 250);
		outline-offset: 2px;
	}
</style>
