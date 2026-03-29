<script lang="ts">
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import CookieBanner from '$lib/components/CookieBanner.svelte';

	let { children, data } = $props();
	let isMenuOpen = $state(false);

	let currentPath = $derived($page.url.pathname);
	let isHome = $derived(currentPath === '/');

	const isActive = (href: string) => {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	};

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<!-- Fixed background -->
<div class="fixed-bg"></div>

<header class="site-bar {isHome ? 'is-home' : ''}" aria-label="Main menu" class:hide-tagline={isHome}>
	<div class="site-bar-inner">
		<div class="site-bar-brand">
			<a href={resolve('/')} class="site-logo">
				<img src="/frankly-logo-small.jpg" alt="Frankly Skanky" width="160" height="156" />
			</a>
			<div class="site-bar-text">
				<span class="site-name">Frankly Skanky</span>
				<span class="site-tagline">Sacred Dub Roots Reggae · Stroud</span>
			</div>
		</div>
		<button
			class="nav-toggle"
			onclick={() => (isMenuOpen = !isMenuOpen)}
			aria-expanded={isMenuOpen}
			aria-label="Toggle navigation"
		>
			{isMenuOpen ? '✕' : '☰'}
		</button>
		<!-- Mobile dropdown nav -->
		{#if isMenuOpen}
			<nav class="mobile-nav" aria-label="Site navigation">
				{#each data.navItems as item (item.id)}
					<a
						href={resolve(item.href)}
						class={isActive(item.href) ? 'active' : ''}
						onclick={() => (isMenuOpen = false)}
					>
						{item.label}
					</a>
				{/each}
			</nav>
		{/if}
	</div>
</header>

<main class="site-main" class:site-main-home={isHome}>
	{#if isHome}
		<div class="site-main-home-inner" style="view-transition-name: page-content;">
			{@render children()}
		</div>
	{:else}
		<div class="site-main-inner">
			<div class="content-card prose-content" style="view-transition-name: page-content;">
				{@render children()}
			</div>
		</div>
	{/if}
</main>

<footer class="site-footer">
	<div class="site-footer-social">
		<a href="https://www.facebook.com/franklyskanqui" target="_blank" rel="noopener noreferrer" class="social-icon social-facebook" aria-label="Facebook">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
		</a>
		<a href="https://www.youtube.com/@franklyskanky" target="_blank" rel="noopener noreferrer" class="social-icon social-youtube" aria-label="YouTube">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
		</a>
	</div>
	<div class="site-footer-inner">
		<span>© {new Date().getFullYear()} Frankly Skanky</span>
		<a href="/contact">Contact</a>
		<a href="/privacy">Privacy</a>
		<a href="/admin">Admin</a>
	</div>
</footer>

<CookieBanner />
