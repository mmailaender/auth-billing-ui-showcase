import { Creem, type ApiResolver } from '@mmailaender/convex-creem';
import { ConvexError } from 'convex/values';
import { api, components } from './_generated/api';
import { internalAction } from './_generated/server';

export const creem = new Creem(components.creem);

// ─── Auth resolver ───────────────────────────────────────────────────
const resolve: ApiResolver = async (ctx) => {
	const user = await ctx.runQuery(api.users.queries.getActiveUser);
	if (!user) throw new ConvexError('Not authenticated');
	return {
		userId: user._id,
		email: user.email,
		entityId: user._id
	};
};

// ─── Convenience exports (all billing functions) ─────────────────────
const { uiModel, snapshot, checkouts, subscriptions, products, customers, orders } = creem.api({
	resolve
});

export { uiModel, snapshot };
export const checkoutsCreate = checkouts.create;
export const subscriptionsUpdate = subscriptions.update;
export const subscriptionsCancel = subscriptions.cancel;
export const subscriptionsResume = subscriptions.resume;
export const subscriptionsPause = subscriptions.pause;
export const subscriptionsList = subscriptions.list;
export const subscriptionsListAll = subscriptions.listAll;
export const productsList = products.list;
export const productsGet = products.get;
export const customersRetrieve = customers.retrieve;
export const customersPortalUrl = customers.portalUrl;
export const ordersList = orders.list;

// ─── Sync products from Creem (CLI / dashboard only) ─────────────────
export const syncBillingProducts = internalAction({
	args: {},
	handler: async (ctx) => {
		await creem.syncProducts(ctx);
	}
});
