import { Creem, checkoutCreateArgs, subscriptionCancelArgs, subscriptionPauseArgs, subscriptionResumeArgs, subscriptionUpdateArgs, type ApiResolver } from '@mmailaender/convex-creem';
import { ConvexError } from 'convex/values';
import type { GenericMutationCtx } from 'convex/server';
import { api, components } from './_generated/api';
import type { DataModel } from './_generated/dataModel';
import { action, internalAction, mutation } from './_generated/server';
import { authComponent, createAuth } from './auth';

export const creem = new Creem(components.creem);

// ─── Auth resolver for convenience (read-only) exports ───────────────
const resolve: ApiResolver = async (ctx) => {
	const user = await ctx.runQuery(api.users.queries.getActiveUser);
	if (!user) throw new ConvexError('Not authenticated');
	return {
		userId: user._id,
		email: user.email,
		entityId: user.activeOrganizationId ?? user._id
	};
};

// ─── Convenience exports — read-only queries ─────────────────────────
const {
	uiModel,
	snapshot,
	subscriptions: _subs,
	products,
	customers: _customers,
	orders
} = creem.api({ resolve });

export { uiModel, snapshot };
export const subscriptionsList = _subs.list;
export const subscriptionsListAll = _subs.listAll;
export const productsList = products.list;
export const productsGet = products.get;
export const customersRetrieve = _customers.retrieve;
export const ordersList = orders.list;

// ─── Full control helpers ────────────────────────────────────────────

interface AuthInfo {
	userId: string;
	email: string;
	entityId: string;
	role: string | null;
}

/** Resolve auth + role in action context (uses ctx.runQuery). */
async function resolveAuthAction(ctx: {
	runQuery: typeof action.prototype.runQuery;
}): Promise<AuthInfo> {
	const user = await ctx.runQuery(api.users.queries.getActiveUser);
	if (!user) throw new ConvexError('Not authenticated');
	const role = await ctx.runQuery(api.organizations.queries.getOrganizationRole, {});
	return {
		userId: user._id,
		email: user.email,
		entityId: user.activeOrganizationId ?? user._id,
		role: role ?? null
	};
}

/** Resolve auth + role in mutation context (direct DB / component access). */
async function resolveAuthMutation(ctx: GenericMutationCtx<DataModel>): Promise<AuthInfo> {
	const user = await authComponent.safeGetAuthUser(ctx);
	if (!user) throw new ConvexError('Not authenticated');

	let role: string | null = null;
	try {
		const auth = createAuth(ctx);
		const headers = await authComponent.getHeaders(ctx);
		const member = await auth.api.getActiveMember({ headers });
		role = (member?.role as string) ?? null;
	} catch {
		role = null;
	}

	return {
		userId: user._id,
		email: user.email,
		entityId: user.activeOrganizationId ?? user._id,
		role
	};
}

function requireAdminOrOwner(role: string | null): void {
	if (role !== 'admin' && role !== 'owner') {
		throw new ConvexError('Forbidden: requires admin or owner role');
	}
}

// ─── Full control: actions (checkout, portal URL) ────────────────────

export const checkoutsCreate = action({
	args: checkoutCreateArgs,
	handler: async (ctx, args): Promise<{ url: string }> => {
		const auth = await resolveAuthAction(ctx);
		requireAdminOrOwner(auth.role);
		return await creem.checkouts.create(ctx, {
			entityId: auth.entityId,
			userId: auth.userId,
			email: auth.email,
			...args
		});
	}
});

export const customersPortalUrl = action({
	args: {},
	handler: async (ctx): Promise<{ url: string }> => {
		const auth = await resolveAuthAction(ctx);
		requireAdminOrOwner(auth.role);
		return await creem.customers.portalUrl(ctx, {
			entityId: auth.entityId
		});
	}
});

// ─── Full control: mutations (subscription management) ───────────────

export const subscriptionsUpdate = mutation({
	args: subscriptionUpdateArgs,
	handler: async (ctx, args): Promise<void> => {
		const auth = await resolveAuthMutation(ctx);
		requireAdminOrOwner(auth.role);
		await creem.subscriptions.update(ctx, {
			entityId: auth.entityId,
			...args
		});
	}
});

export const subscriptionsCancel = mutation({
	args: subscriptionCancelArgs,
	handler: async (ctx, args): Promise<void> => {
		const auth = await resolveAuthMutation(ctx);
		requireAdminOrOwner(auth.role);
		await creem.subscriptions.cancel(ctx, {
			entityId: auth.entityId,
			...args
		});
	}
});

export const subscriptionsResume = mutation({
	args: subscriptionResumeArgs,
	handler: async (ctx, args): Promise<void> => {
		const auth = await resolveAuthMutation(ctx);
		requireAdminOrOwner(auth.role);
		await creem.subscriptions.resume(ctx, {
			entityId: auth.entityId,
			...args
		});
	}
});

export const subscriptionsPause = mutation({
	args: subscriptionPauseArgs,
	handler: async (ctx, args): Promise<void> => {
		const auth = await resolveAuthMutation(ctx);
		requireAdminOrOwner(auth.role);
		await creem.subscriptions.pause(ctx, {
			entityId: auth.entityId,
			...args
		});
	}
});

// ─── Sync products from Creem (CLI / dashboard only) ─────────────────
export const syncBillingProducts = internalAction({
	args: {},
	handler: async (ctx) => {
		await creem.syncProducts(ctx);
	}
});
