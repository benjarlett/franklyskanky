<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Redirect to pages list
	onMount(() => {
		goto('/admin/pages');
	});
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="flex items-center justify-center py-12">
	<p class="text-muted-foreground">Redirecting to pages...</p>
</div>
