<script lang="ts">
	import './layout.css';
	import favicon from '../lib/assets/favicon.svg';

	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '../lib/auth/api/auth-client';

	import { Toaster } from '../lib/primitives/ui/sonner';
	import DemoUserButton from '../lib/demo/DemoUserButton.svelte';

	let { children, data } = $props();

	createSvelteAuthClient({ authClient, getServerState: () => data.authState });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" />
<div class="flex min-h-[100dvh] flex-col bg-surface-subtle text-foreground-default">
	<header
		class="bg-surface-subtle/90 fixed top-0 right-0 left-0 z-50 flex items-center justify-between gap-5 border-b border-border-default p-4 backdrop-blur"
	>
		<div class="flex items-center text-foreground-placeholder">
			<span class="text-xl font-bold">Convex-Creem</span>
		</div>
		<DemoUserButton />
	</header>
	<main class="pt-20">
		{@render children()}
	</main>
</div>
