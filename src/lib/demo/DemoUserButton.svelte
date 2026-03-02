<script lang="ts">
	import * as Dialog from '../primitives/ui/dialog';
	import * as Select from '../primitives/ui/select';
	import { createListCollection } from '@ark-ui/svelte/select';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api.js';
	import { authClient } from '../auth/api/auth-client';
	import { invalidateAll } from '$app/navigation';
	import { demoRole } from './demo-role.svelte';
	import DemoSignIn from './DemoSignIn.svelte';
	import { signInDialog } from '../auth/api/sign-in-dialog.svelte';

	const auth = useAuth();

	const activeUserResponse = useQuery(api.users.queries.getActiveUser, () =>
		auth.isAuthenticated ? {} : 'skip'
	);
  $inspect(activeUserResponse, "DemoUserButton | activeUserResponse");
	const activeUser = $derived(activeUserResponse?.data);

	const collection = createListCollection({
		items: [
			{ label: 'Admin', value: 'admin' },
			{ label: 'Member', value: 'member' }
		]
	});

	let selectedRole = $state<string[]>([demoRole.value]);

	// Sync select → demoRole
	$effect(() => {
		const role = selectedRole[0];
		if (role === 'admin' || role === 'member') {
			demoRole.value = role;
		}
	});

	// Ensure SignIn form resets every time the dialog opens
	let signInKey = $state(0);
	let prevSignInDialogOpen = false;

	$effect(() => {
		if (signInDialog.isOpen && !prevSignInDialogOpen) {
			signInKey += 1;
		}
		prevSignInDialogOpen = signInDialog.isOpen;
	});

	async function handleSignOut() {
		const result = await authClient.signOut();
		if (result.data?.success) {
			invalidateAll();
		}
	}
</script>

{#if auth.isAuthenticated && activeUser}
	<div class="flex items-center gap-3">
		<span class="hidden text-sm text-foreground-muted sm:inline">{activeUser.email}</span>
		<Select.Root {collection} bind:value={selectedRole} positioning={{ sameWidth: true }}>
			<Select.Trigger class="h-8 text-xs" />
			<Select.Content>
				{#each collection.items as item (item.value)}
					<Select.Item {item}>
						<Select.ItemText>{item.label}</Select.ItemText>
						<Select.ItemIndicator>✓</Select.ItemIndicator>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<button
			class="preset-faded-surface-50-950 btn h-8 text-xs hover:bg-surface-200-800"
			onclick={handleSignOut}
		>
			Sign out
		</button>
	</div>
{:else if auth.isLoading || auth.isAuthenticated}
	<div class="placeholder-circle size-9 animate-pulse"></div>
{:else}
	<button class="button-filled" onclick={() => signInDialog.open()}>Sign in</button>
{/if}

<!-- Sign-in dialog -->
<Dialog.Root
	open={signInDialog.isOpen}
	onOpenChange={(status) => {
		signInDialog.isOpen = status.open;
		if (!status.open) {
			signInKey += 1;
		}
	}}
>
	<Dialog.Content class="w-full max-w-md rounded-container sm:w-md">
		<Dialog.Header>
			<Dialog.Title>Start Demo</Dialog.Title>
			<Dialog.Description>
				Enter any email to create a demo account instantly. Pick a role to test permissions.
			</Dialog.Description>
		</Dialog.Header>
		{#key signInKey}
			<DemoSignIn onSignIn={() => signInDialog.close()} />
		{/key}
		<Dialog.CloseX />
	</Dialog.Content>
</Dialog.Root>
