<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '../lib/assets/favicon.svg';
	import creemLogoUrl from '$lib/assets/creem-grey.svg';
	import convexLogoUrl from '$lib/assets/convex-grey.svg';

	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '../lib/auth/api/auth-client';

	import { Toaster } from '../lib/primitives/ui/sonner';
	import OrganizationSwitcher from '../lib/organizations/ui/OrganizationSwitcher.svelte';
	import UserButton from '../lib/users/ui/UserButton.svelte';
	import AuthDialogProvider from '../lib/auth/ui/AuthDialogProvider.svelte';

	import { AUTH_CONSTANTS } from '../convex/auth.constants';

	let { children, data } = $props();

	createSvelteAuthClient({ authClient, getServerState: () => data.authState });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" />
<AuthDialogProvider initialData={data.initialData}>
	<div class="grid min-h-[100dvh] grid-rows-[auto_1fr] overflow-x-hidden">
		<header class="flex items-center justify-between gap-5 p-4">
			<div class="flex items-center gap-4 pt-8 text-foreground-placeholder">
				<span class="inline-flex h-8 items-center justify-center opacity-70">
					<img src={creemLogoUrl} alt="Creem" class="h-7 w-auto" />
				</span>
				<span class="inline-flex h-8 w-8 items-center justify-center opacity-70">
					<img src={convexLogoUrl} alt="Convex" class="h-7 w-7" />
				</span>
			</div>
			{#if AUTH_CONSTANTS.organizations}
				<OrganizationSwitcher initialData={data.initialData} />
			{/if}
			<UserButton initialData={data.initialData} />
		</header>
		<main>
			{@render children()}
		</main>
	</div>
</AuthDialogProvider>
