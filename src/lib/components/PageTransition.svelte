<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';

	let { pathname, direction = 0, children }: {
		pathname: string;
		direction?: number; // -1 = left, 1 = right, 0 = none
		children: any;
	} = $props();

	const duration = 250;
</script>

<style>
	/* Fade-in only - no transform to preserve backdrop-filter in children */
	.page-transition {
		animation: page-fade-in 250ms ease-out;
	}

	@keyframes page-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

{#key pathname}
	<div class="w-full page-transition" style="--direction: {direction}">
		{@render children()}
	</div>
{/key}
