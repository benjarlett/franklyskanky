<script lang="ts">
	import { onMount } from 'svelte';

	let visible = $state(false);

	onMount(() => {
		if (!localStorage.getItem('cookie-consent')) {
			visible = true;
		}
	});

	function accept() {
		localStorage.setItem('cookie-consent', 'accepted');
		visible = false;
	}

	function decline() {
		localStorage.setItem('cookie-consent', 'declined');
		visible = false;
	}
</script>

{#if visible}
	<div class="cookie-banner" role="dialog" aria-label="Cookie consent">
		<p class="cookie-text">
			This site embeds YouTube videos (privacy-enhanced mode) and a Facebook feed on the News page.
			<a href="/privacy">Privacy policy</a>
		</p>
		<div class="cookie-actions">
			<button class="cookie-btn cookie-accept" onclick={accept}>Accept</button>
			<button class="cookie-btn cookie-decline" onclick={decline}>No thanks</button>
		</div>
	</div>
{/if}

<style>
	.cookie-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: #111111;
		border-top: 4px solid;
		border-image: linear-gradient(90deg, #cc0000 33.33%, #ffd700 33.33% 66.66%, #1a7b1a 66.66%) 1;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.cookie-text {
		color: rgba(255, 255, 255, 0.85);
		font-size: 1rem;
		margin: 0;
		flex: 1;
		min-width: 200px;
	}

	.cookie-text a {
		color: #ffd700;
		text-decoration: underline;
	}

	.cookie-actions {
		display: flex;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.cookie-btn {
		font-family: inherit;
		font-size: 1rem;
		font-weight: 700;
		padding: 0.5rem 1.25rem;
		border: none;
		cursor: pointer;
		letter-spacing: 0.03em;
	}

	.cookie-accept {
		background: #cc0000;
		color: #ffffff;
	}

	.cookie-accept:hover {
		background: #ff0000;
	}

	.cookie-decline {
		background: transparent;
		color: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.cookie-decline:hover {
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.5);
	}
</style>
