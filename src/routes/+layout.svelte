<script lang="ts">
	import './layout.css';
	import favicon from '../lib/assets/creem.svg';

	import { createSvelteAuthClient, useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '../lib/auth/api/auth-client';

	import { Toaster } from '../lib/primitives/ui/sonner';
	import OrganizationSwitcher from '../lib/organizations/ui/OrganizationSwitcher.svelte';
	import UserButton from '../lib/users/ui/UserButton.svelte';
	import AuthDialogProvider from '../lib/auth/ui/AuthDialogProvider.svelte';

	import { AUTH_CONSTANTS } from '../convex/auth.constants';

	let { children, data } = $props();

	createSvelteAuthClient({ authClient, getServerState: () => data.authState });
	const auth = useAuth();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" />
<AuthDialogProvider initialData={data.initialData}>
	<div class="flex min-h-[100dvh] flex-col bg-surface-subtle text-foreground-default">
		<header class="flex items-center justify-between gap-5 p-4">
			<div class="flex items-center gap-4 text-foreground-placeholder">
				<span class="text-xl font-bold">Convex-Creem</span>
			</div>
			<div class="flex items-center gap-4">
				{#if AUTH_CONSTANTS.organizations}
					<OrganizationSwitcher initialData={data.initialData} />
				{/if}
				<UserButton initialData={data.initialData} />
			</div>
		</header>
		<main>
			{@render children()}
		</main>
	</div>
</AuthDialogProvider>
