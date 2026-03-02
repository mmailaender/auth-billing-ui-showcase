import { getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import type { LayoutServerLoad } from './$types';
import { createAuth } from '../convex/auth';
import { building } from '$app/environment';

export const load = (async ({ cookies }) => {
	if (building) {
		return { authState: { isAuthenticated: false } };
	}

	const authState = await getAuthState(createAuth, cookies);
	return { authState };
}) satisfies LayoutServerLoad;
