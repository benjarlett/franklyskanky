<script lang="ts">
	let {
		value = '',
		onchange,
		class: className = ''
	}: {
		value?: string;
		onchange: (url: string) => void;
		class?: string;
	} = $props();

	let uploading = $state(false);
	let error = $state('');
	let fileInput: HTMLInputElement;

	async function handleFile(file: File) {
		error = '';
		uploading = true;

		try {
			// Get presigned URL from our API
			const res = await fetch('/admin/api/upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					filename: file.name,
					contentType: file.type,
					size: file.size
				})
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Upload failed');
			}

			const { uploadUrl, publicUrl } = await res.json();

			// Upload directly to S3
			const uploadRes = await fetch(uploadUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type },
				body: file
			});

			if (!uploadRes.ok) {
				throw new Error('Failed to upload to storage');
			}

			onchange(publicUrl);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Upload failed';
		} finally {
			uploading = false;
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) handleFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files?.[0];
		if (file && file.type.startsWith('image/')) handleFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}
</script>

<div class={className}>
	{#if value}
		<div class="group relative">
			<img src={value} alt="Uploaded" class="w-full rounded-md border border-border object-cover" />
			<div class="absolute inset-0 flex items-center justify-center gap-2 rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
				<button
					type="button"
					onclick={() => fileInput.click()}
					class="rounded bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-white"
				>
					Replace
				</button>
				<button
					type="button"
					onclick={() => onchange('')}
					class="rounded bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
				>
					Remove
				</button>
			</div>
		</div>
	{:else}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			ondrop={handleDrop}
			ondragover={handleDragOver}
			onclick={() => fileInput.click()}
			class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border/40 px-4 py-6 text-center transition-colors hover:border-border/70 hover:bg-muted/10"
		>
			{#if uploading}
				<div class="text-sm text-muted-foreground">Uploading...</div>
			{:else}
				<svg class="h-8 w-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				<span class="text-xs text-muted-foreground/60">Click or drag an image</span>
			{/if}
		</div>
	{/if}

	{#if error}
		<p class="mt-1 text-xs text-destructive">{error}</p>
	{/if}

	<input
		bind:this={fileInput}
		type="file"
		accept="image/jpeg,image/png,image/webp,image/gif"
		onchange={handleFileSelect}
		class="hidden"
	/>
</div>
