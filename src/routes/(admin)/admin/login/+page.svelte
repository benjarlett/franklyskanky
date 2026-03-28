<script lang="ts">
	let { form } = $props();
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<div style="display:flex; align-items:center; justify-content:center; min-height:60vh; padding:2rem;">
	<div style="width:100%; max-width:380px;">
		<h1 style="font-family:'Bungee',sans-serif; font-size:2rem; color:#111111; margin:0 0 0.25rem; text-align:center;">Admin Login</h1>
		<div style="height:4px; background:linear-gradient(90deg,#cc0000 33.33%,#ffd700 33.33% 66.66%,#1a7b1a 66.66%); margin-bottom:2rem;"></div>

		<!-- Username/password form -->
		<form method="POST" action="?/password" style="margin-bottom:1.5rem;">
			{#if form?.error}
				<div style="background:#fee2e2; color:#991b1b; padding:0.75rem 1rem; margin-bottom:1rem; font-size:0.9rem;">
					{form.error}
				</div>
			{/if}
			<div style="margin-bottom:1rem;">
				<label for="username" style="display:block; font-size:0.875rem; font-weight:600; color:#111111; margin-bottom:0.375rem;">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					autocomplete="username"
					required
					style="width:100%; border:1px solid #cccccc; padding:0.625rem 0.875rem; font-size:1rem; background:#ffffff; color:#111111; box-sizing:border-box;"
				/>
			</div>
			<div style="margin-bottom:1.25rem;">
				<label for="password" style="display:block; font-size:0.875rem; font-weight:600; color:#111111; margin-bottom:0.375rem;">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					style="width:100%; border:1px solid #cccccc; padding:0.625rem 0.875rem; font-size:1rem; background:#ffffff; color:#111111; box-sizing:border-box;"
				/>
			</div>
			<button
				type="submit"
				style="width:100%; background:#cc0000; color:#ffffff; font-family:'Bungee',sans-serif; font-size:1.25rem; padding:0.75rem; border:none; cursor:pointer; letter-spacing:0.03em;"
			>
				Log In
			</button>
		</form>

		<div style="text-align:center; border-top:1px solid #dddddd; padding-top:1.25rem;">
			<p style="font-size:0.8rem; color:#888888; margin:0 0 0.75rem;">Or sign in with Google</p>
			<a
				href="/api/auth/google"
				style="display:inline-flex; align-items:center; gap:0.5rem; border:1px solid #cccccc; padding:0.625rem 1.25rem; font-size:0.9rem; color:#111111; text-decoration:none; background:#ffffff;"
			>
				<svg viewBox="0 0 24 24" width="18" height="18">
					<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
					<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
					<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
					<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
				</svg>
				Sign in with Google
			</a>
		</div>

		<div style="text-align:center; margin-top:1.5rem;">
			<a href="/" style="font-size:0.875rem; color:#666666; text-decoration:none;">← Back to site</a>
		</div>
	</div>
</div>
