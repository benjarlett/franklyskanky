<script lang="ts">
	import { onMount } from 'svelte';

	let consented = $state(false);

	onMount(() => {
		consented = localStorage.getItem('cookie-consent') === 'accepted';
		window.addEventListener('storage', () => {
			consented = localStorage.getItem('cookie-consent') === 'accepted';
		});
	});

	const tracks = [
		{
			title: "Let's All Unite",
			url: 'https://soundcloud.com/benjarlett/lets-all-unite',
			embed: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/benjarlett/lets-all-unite&color=%23cc0000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false'
		},
		{
			title: "Wally's Studio Demo",
			url: 'https://soundcloud.com/benjarlett/sets/wallys-studio-demo',
			embed: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/benjarlett/sets/wallys-studio-demo&color=%23cc0000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false'
		}
	];
</script>

<svelte:head>
	<title>Sounds — Frankly Skanky</title>
	<meta name="description" content="Listen to Frankly Skanky — sacred dub roots reggae from Stroud." />
</svelte:head>

<h1>Sounds</h1>

{#if consented}
	<div class="sounds-list">
		{#each tracks as track}
			<div class="sound-item">
				<h2>{track.title}</h2>
				<iframe
					width="100%"
					height="166"
					scrolling="no"
					frameborder="no"
					allow="autoplay"
					src={track.embed}
					title={track.title}
				></iframe>
			</div>
		{/each}
	</div>
{:else}
	<div class="sounds-blocked">
		<p>SoundCloud embeds use cookies. Accept cookies to listen here, or visit us directly on SoundCloud:</p>
		<div class="sounds-links">
			{#each tracks as track}
				<a href={track.url} target="_blank" rel="noopener noreferrer">
					{track.title} →
				</a>
			{/each}
		</div>
	</div>
{/if}

<style>
	.sounds-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 1.5rem;
	}

	.sound-item h2 {
		font-family: 'Bungee', sans-serif;
		font-size: 1.5rem;
		margin: 0 0 0.75rem;
		color: #111111;
	}

	.sounds-blocked {
		margin-top: 1.5rem;
		padding: 1.5rem;
		background: #f5f5f5;
		border-left: 4px solid #cc0000;
	}

	.sounds-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.sounds-links a {
		color: #cc0000;
		font-weight: 700;
		font-size: 1.125rem;
		text-decoration: none;
	}

	.sounds-links a:hover {
		text-decoration: underline;
	}
</style>
