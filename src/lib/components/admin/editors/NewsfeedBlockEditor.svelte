<script lang="ts">
	import type { NewsfeedBlock, NewsfeedPost } from '$lib/server/db/schema';

	let { block, onUpdate }: { block: NewsfeedBlock; onUpdate: (updates: Partial<NewsfeedBlock>) => void } = $props();

	let posts = $state<NewsfeedPost[]>(block.posts ?? []);

	function addPost() {
		posts = [{ id: crypto.randomUUID(), title: '', body: '', date: new Date().toISOString().split('T')[0] }, ...posts];
		onUpdate({ posts });
	}

	function removePost(id: string) {
		posts = posts.filter(p => p.id !== id);
		onUpdate({ posts });
	}

	function updatePost(id: string, field: keyof NewsfeedPost, value: string) {
		posts = posts.map(p => p.id === id ? { ...p, [field]: value } : p);
		onUpdate({ posts });
	}
</script>

<div class="nf-editor">
	<div class="nf-header">
		<p class="nf-hint">Up to 3 posts shown on the homepage. Most recent first.</p>
		<button type="button" onclick={addPost} class="nf-add">+ Add Post</button>
	</div>

	{#each posts.slice(0, 3) as post (post.id)}
		<div class="nf-post">
			<div class="nf-row">
				<div class="nf-field">
					<label>Date</label>
					<input type="date" value={post.date} oninput={(e) => updatePost(post.id, 'date', (e.target as HTMLInputElement).value)}
						style="background:#ffffff; color:#111111; border:1px solid #cccccc; padding:0.4rem 0.6rem; width:100%;" />
				</div>
				<div class="nf-field" style="flex:2;">
					<label>Title <span style="color:#999; font-weight:400;">(optional)</span></label>
					<input type="text" value={post.title} oninput={(e) => updatePost(post.id, 'title', (e.target as HTMLInputElement).value)}
						placeholder="e.g. New gig announced!"
						style="background:#ffffff; color:#111111; border:1px solid #cccccc; padding:0.4rem 0.6rem; width:100%;" />
				</div>
				<button type="button" onclick={() => removePost(post.id)} class="nf-remove" aria-label="Remove">✕</button>
			</div>
			<div class="nf-field" style="margin-top:0.5rem;">
				<label>Post</label>
				<textarea rows="3" value={post.body} oninput={(e) => updatePost(post.id, 'body', (e.target as HTMLTextAreaElement).value)}
					placeholder="What's happening..."
					style="background:#ffffff; color:#111111; border:1px solid #cccccc; padding:0.4rem 0.6rem; width:100%; resize:vertical;"></textarea>
			</div>
		</div>
	{/each}

	{#if posts.length === 0}
		<p style="color:#999; font-size:0.9rem;">No posts yet — click Add Post to get started.</p>
	{/if}
</div>

<style>
	.nf-editor { display: flex; flex-direction: column; gap: 0.75rem; }
	.nf-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
	.nf-hint { font-size: 0.85rem; color: #666; margin: 0; }
	.nf-add { background: #1d4ed8; color: #fff; border: none; padding: 0.4rem 1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; }
	.nf-post { background: #f9f9f9; border: 1px solid #dddddd; padding: 0.875rem; display: flex; flex-direction: column; gap: 0.25rem; }
	.nf-row { display: flex; gap: 0.75rem; align-items: flex-end; }
	.nf-field { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
	.nf-field label { font-size: 0.8rem; font-weight: 600; color: #444; }
	.nf-remove { background: none; border: none; color: #dc2626; font-size: 1rem; cursor: pointer; padding: 0.25rem; flex-shrink: 0; }
</style>
