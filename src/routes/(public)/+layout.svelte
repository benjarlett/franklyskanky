<script lang="ts">
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';

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

<!-- Fixed background image -->
<div class="fixed-bg"></div>

<!-- Unified header bar: logo + tagline + nav -->
<header class="site-bar backdrop-blur-[12px] backdrop-saturate-[1.4]" aria-label="Main menu">
	<div class="site-bar-inner">
		<div class="site-bar-brand">
			<a href={resolve('/')} class="site-logo">Dee Jarlett</a>
			<span class="site-tagline">Music, Community & Song</span>
		</div>
		<button
			class="nav-toggle"
			onclick={() => (isMenuOpen = !isMenuOpen)}
			aria-expanded={isMenuOpen}
			aria-label="Toggle navigation"
		>
			{isMenuOpen ? '✕' : '☰'}
		</button>
		<nav class="site-nav {isMenuOpen ? 'open' : ''}">
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
	</div>
</header>

<!-- Main content -->
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

<!-- Full-width footer -->
<footer class="site-footer">
	<div class="site-footer-inner">
		<span>Copyright &copy; 2009–{new Date().getFullYear()} Dee Jarlett</span>
	</div>
</footer>
