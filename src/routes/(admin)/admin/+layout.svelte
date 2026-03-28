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
	<div class="min-h-screen" style="background:#ffffff; color:#111111;">
		<!-- Admin Header -->
		<header class="sticky top-0 z-50 border-b" style="background:#ffffff; border-color:#dddddd;">
			<div class="container flex h-14 items-center justify-between">
				<div class="flex items-center gap-6">
					<a href="/admin" class="text-xl font-bold" style="color:#1d4ed8;">Admin</a>
					<nav class="flex gap-1">
						{#each navLinks as link}
							<a
								href={link.href}
								class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
								style={isActive(link.href) ? 'background:#1d4ed8; color:#ffffff;' : 'color:#555555;'}
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</div>

				<div class="flex items-center gap-4">
					<a href="/" class="text-sm" style="color:#1d4ed8;" target="_blank">
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
