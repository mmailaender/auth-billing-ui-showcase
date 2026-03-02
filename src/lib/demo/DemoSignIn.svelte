<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Select from '../primitives/ui/select';
	import { createListCollection } from '@ark-ui/svelte/select';
	import { authClient } from '../auth/api/auth-client';
	import { demoRole } from './demo-role.svelte';

	interface DemoSignInProps {
		onSignIn?: () => void;
	}

	const DEMO_PASSWORD = 'demo-showcase-2024!';

	const { onSignIn }: DemoSignInProps = $props();

	let email = $state('');
	let submitting = $state(false);

	const collection = createListCollection({
		items: [
			{ label: 'Admin', value: 'admin' },
			{ label: 'Member', value: 'member' }
		]
	});

	let selectedRole = $state<string[]>([demoRole.value]);

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();
		if (!email.trim()) return;

		submitting = true;

		// Save role to localStorage
		const role = selectedRole[0] === 'member' ? 'member' : 'admin';
		demoRole.value = role;

		try {
			// Try sign-in first
			const signInResult = await authClient.signIn.email({
				email: email.trim(),
				password: DEMO_PASSWORD
			});

			if (signInResult.error) {
				// Account doesn't exist — sign up
				const signUpResult = await authClient.signUp.email({
					email: email.trim(),
					password: DEMO_PASSWORD,
					name: email.trim()
				});

				if (signUpResult.error) {
					toast.error(signUpResult.error.message ?? 'Could not create demo account.');
					submitting = false;
					return;
				}
			}

			onSignIn?.();
		} catch (err) {
			console.error('Demo sign-in error:', err);
			toast.error('Something went wrong. Please try again.');
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit} autocomplete="off" class="flex flex-col gap-6">
	<div class="flex flex-col gap-5">
		<div class="flex flex-col">
			<label class="label" for="demo-email">Email</label>
			<input
				id="demo-email"
				type="email"
				bind:value={email}
				class="preset-filled-surface-200 input"
				placeholder="you@example.com"
				required
				disabled={submitting}
			/>
		</div>

		<div class="flex flex-col">
			<label class="label" for="demo-role">Role</label>
			<Select.Root {collection} bind:value={selectedRole} positioning={{ sameWidth: true }}>
				<Select.Trigger placeholder="Select a role" class="w-full" />
				<Select.Content>
					{#each collection.items as item (item.value)}
						<Select.Item {item}>
							<Select.ItemText>{item.label}</Select.ItemText>
							<Select.ItemIndicator>✓</Select.ItemIndicator>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<p class="mt-1 text-xs text-surface-600-400">
				Admin can checkout & manage subscriptions. Member has read-only access.
			</p>
		</div>
	</div>

	<button type="submit" class="btn w-full preset-filled" disabled={submitting}>
		{#if submitting}
			<div class="flex items-center gap-2">
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
				></div>
				Starting demo…
			</div>
		{:else}
			Start Demo
		{/if}
	</button>
</form>
