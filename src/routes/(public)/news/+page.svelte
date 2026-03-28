<script lang="ts">
	import { onMount } from 'svelte';

	let consented = $state(false);

	onMount(() => {
		consented = localStorage.getItem('cookie-consent') === 'accepted';
		window.addEventListener('storage', () => {
			consented = localStorage.getItem('cookie-consent') === 'accepted';
		});
	});
</script>

<svelte:head>
	<title>News — Frankly Skanky</title>
	<meta name="description" content="Latest news and updates from Frankly Skanky — sacred dub roots reggae from Stroud." />
</svelte:head>

<h1>News</h1>

<p>We keep our Facebook page more up to date than our website — find out about upcoming gigs, new recordings, and what we've been up to.</p>

{#if consented}
	<div class="fb-wrap">
		<iframe
			src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffranklyskanqui&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
			width="500"
			height="700"
			style="border:none;overflow:hidden;max-width:100%;"
			scrolling="no"
			frameborder="0"
			allowfullscreen="true"
			allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			title="Frankly Skanky on Facebook"
		></iframe>
	</div>
{:else}
	<div class="fb-blocked">
		<p>Accept cookies to load our Facebook feed here, or visit us directly:</p>
		<a class="fb-link" href="https://www.facebook.com/franklyskanqui" target="_blank" rel="noopener noreferrer">
			Visit Frankly Skanky on Facebook →
		</a>
	</div>
{/if}

<style>
	.fb-wrap {
		margin-top: 1.5rem;
		max-width: 500px;
	}

	.fb-blocked {
		margin-top: 1.5rem;
		padding: 1.5rem;
		background: #f5f5f5;
		border-left: 4px solid #cc0000;
	}

	.fb-link {
		display: inline-block;
		margin-top: 0.75rem;
		font-weight: 700;
		color: #cc0000;
		text-decoration: none;
		font-size: 1.125rem;
	}

	.fb-link:hover {
		text-decoration: underline;
	}
</style>
