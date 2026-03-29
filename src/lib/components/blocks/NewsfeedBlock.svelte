<script lang="ts">
	import type { NewsfeedBlock as NewsfeedBlockType } from '$lib/server/db/schema';

	let { block }: { block: NewsfeedBlockType } = $props();

	const posts = (block.posts ?? []).slice(0, 3);
</script>

{#if posts.length > 0}
	<div class="newsfeed">
		<h2 class="newsfeed-heading">Latest News</h2>
		{#each posts as post}
			<div class="newsfeed-post">
				<div class="newsfeed-meta">
					<span class="newsfeed-date">{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
				</div>
				{#if post.title}
					<h3 class="newsfeed-title">{post.title}</h3>
				{/if}
				<p class="newsfeed-body">{post.body}</p>
			</div>
		{/each}
		<a href="/news" class="newsfeed-more">More on our News page →</a>
	</div>
{/if}

<style>
	.newsfeed {
		margin-top: 1.5rem;
		border-top: 4px solid;
		border-image: linear-gradient(90deg, #cc0000 33.33%, #ffd700 33.33% 66.66%, #1a7b1a 66.66%) 1;
		padding-top: 1.25rem;
	}

	.newsfeed-heading {
		font-family: 'Bungee', sans-serif;
		font-size: 1.5rem;
		color: #ffd700;
		margin: 0 0 1rem;
		letter-spacing: 0.02em;
	}

	.newsfeed-post {
		margin-bottom: 1.25rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.newsfeed-post:last-of-type {
		border-bottom: none;
	}

	.newsfeed-meta {
		margin-bottom: 0.25rem;
	}

	.newsfeed-date {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.45);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.newsfeed-title {
		font-family: 'Bungee', sans-serif;
		font-size: 1.1rem;
		color: #ffffff;
		margin: 0 0 0.375rem;
	}

	.newsfeed-body {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.8);
		margin: 0;
		line-height: 1.5;
	}

	.newsfeed-more {
		display: inline-block;
		margin-top: 0.75rem;
		font-size: 0.9rem;
		font-weight: 700;
		color: #ffd700;
		text-decoration: none;
	}

	.newsfeed-more:hover {
		text-decoration: underline;
	}
</style>
