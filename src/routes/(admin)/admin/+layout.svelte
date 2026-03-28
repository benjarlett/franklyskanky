<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	let isLoginPage = $derived($page.url.pathname === '/admin/login');
	let currentPath = $derived($page.url.pathname);

	const navLinks = [
		{ href: '/admin/pages', label: 'Pages' },
		{ href: '/admin/menu', label: 'Menu' }
	];

	const isActive = (href: string) => currentPath.startsWith(href);
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="min-h-screen bg-background">
		<!-- Admin Header -->
		<header class="sticky top-0 z-50 border-b border-border/20 bg-background/95 backdrop-blur-sm">
			<div class="container flex h-14 items-center justify-between">
				<div class="flex items-center gap-6">
					<a href="/admin" class="text-xl font-bold text-primary">Admin</a>
					<nav class="flex gap-1">
						{#each navLinks as link}
							<a
								href={link.href}
								class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors {isActive(link.href)
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</div>

				<div class="flex items-center gap-4">
					<a href="/" class="text-sm text-muted-foreground hover:text-foreground" target="_blank">
						View Site &rarr;
					</a>
					<form method="POST" action="/admin/logout">
						<button
							type="submit"
							class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							Logout
						</button>
					</form>
				</div>
			</div>
		</header>

		<!-- Admin Content -->
		<main class="container py-8">
			{@render children()}
		</main>
	</div>
{/if}
