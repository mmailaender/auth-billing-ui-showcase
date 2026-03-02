import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { createAuth } from './convex/auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (building) {
		return resolve(event);
	}

	event.locals.token = await getToken(createAuth, event.cookies);

	return resolve(event);
};
