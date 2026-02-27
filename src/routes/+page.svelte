<script lang="ts">
	import {
		CheckoutSuccessSummary,
		BillingPortal,
		Product,
		Subscription,
		pendingCheckout,
		type ConnectedBillingApi,
		type Transition,
		type CheckoutIntent
	} from '@mmailaender/convex-creem/svelte';
	import { api } from '$convex/_generated/api.js';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useRoles } from '$lib/organizations/api/roles.svelte';
	import { signInDialog } from '$lib/auth/api/sign-in-dialog.svelte';
	import creemLogoUrl from '$lib/assets/creem.svg';
	import convexLogoUrl from '$lib/assets/convex.svg';
  import { GithubIcon } from '@lucide/svelte';

	const connectedApi: ConnectedBillingApi = {
		uiModel: api.billing.uiModel,
		checkouts: {
			create: api.billing.checkoutsCreate
		},
		subscriptions: {
			update: api.billing.subscriptionsUpdate,
			cancel: api.billing.subscriptionsCancel,
			resume: api.billing.subscriptionsResume
		},
		customers: {
			portalUrl: api.billing.customersPortalUrl
		}
	};

	// ─── Auth & role-based permissions ──────────────────────────────────
	const auth = useAuth();
	const roles = useRoles();

	const isAdmin = $derived(roles.hasOwnerRole || roles.hasAdminRole);

	const permissions = $derived({
		canCheckout: isAdmin,
		canChangeSubscription: isAdmin,
		canCancelSubscription: isAdmin,
		canResumeSubscription: isAdmin,
		canUpdateSeats: isAdmin,
		canAccessPortal: isAdmin
	});

	// ─── Pre-checkout gate: open sign-in if unauthenticated ────────────
	function handleBeforeCheckout(intent: CheckoutIntent): boolean {
		if (!auth.isAuthenticated) {
			pendingCheckout.save(intent);
			signInDialog.open();
			return false;
		}
		return true;
	}

	const upgradeTransitions: Transition[] = [
		{
			from: 'prod_4Di7Lkhf3TXy4UOKsUrGw0',
			to: 'prod_56sJIyL7piLCVv270n4KBz',
			kind: 'via_product',
			viaProductId: 'prod_5LApsYRX8dHbx8QuLJgJ3j'
		}
	];
</script>

<main class="w-full py-10 lg:pt-16">
	<header class="border-b border-border-subtle pb-16 lg:pb-[104px]">
		<div
			class="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-4 lg:grid-cols-12 lg:gap-2 lg:px-16"
		>
			<div class="space-y-6 lg:col-span-7">
				<h1 class="max-w-[720px] display-m text-foreground-default">
					Creem Billing Widgets for Convex
				</h1>
				<p class="max-w-[720px] subtitle-m text-foreground-default">
					These widgets query Convex directly through the Creem wrapper API, with backend-derived
					billing state in the UI model. Supporting React and Svelte.
				</p>
				<div class="flex items-center gap-4 pt-8 text-foreground-placeholder">
					<span class="inline-flex h-8 items-center justify-center opacity-70">
						<img src={creemLogoUrl} alt="Creem" class="h-7 w-auto" />
					</span>
					<span class="inline-flex h-8 w-8 items-center justify-center opacity-70">
						<img src={convexLogoUrl} alt="Convex" class="h-7 w-7" />
					</span>
          <a href="https://github.com/mmailaender/convex-creem" target="_blank" rel="noopener noreferrer">
            <GithubIcon class="size-6" />
          </a>
				</div>
			</div>

			<nav class="space-y-10 lg:col-span-3 lg:col-start-10 lg:pt-2">
				<div class="space-y-4">
					<p class="label-m text-foreground-placeholder">SUBSCRIPTIONS WIDGETS</p>
					<div class="space-y-1">
						<div class="flex items-center gap-3">
							<span class="inline-block w-6 shrink-0 label-m text-foreground-placeholder">01</span>
							<a href="#subscription-with-trial" class="link-inline">With Trial (4 Cycles)</a>
						</div>
						<div class="flex items-center gap-3">
							<span class="inline-block w-6 shrink-0 label-m text-foreground-placeholder">02</span>
							<a href="#subscription-without-trial" class="link-inline"
								>Without Trial (Monthly Only)</a
							>
						</div>
						<div class="flex items-center gap-3">
							<span class="inline-block w-6 shrink-0 label-m text-foreground-placeholder">03</span>
							<a href="#subscription-seat-selectable" class="link-inline"
								>Seat-Based (User-Selectable)</a
							>
						</div>
						<div class="flex items-center gap-3">
							<span class="inline-block w-6 shrink-0 label-m text-foreground-placeholder">04</span>
							<a href="#subscription-seat-auto" class="link-inline">Seat-Based (Auto-Derived)</a>
						</div>
					</div>
				</div>
				<div class="space-y-4">
					<p class="label-m text-foreground-placeholder">ONE TIME PURCHASE WIDGETS</p>
					<div class="space-y-1">
						<div class="flex items-center gap-3">
							<span class="inline-block w-6 shrink-0 label-m text-foreground-placeholder">05</span>
							<a href="#onetime-single" class="link-inline">Single One-Time Product</a>
						</div>
						<div class="flex items-center gap-3">
							<span class="inline-block w-6 shrink-0 label-m text-foreground-placeholder">06</span>
							<a href="#onetime-group" class="link-inline">Mutually Exclusive Product Group</a>
						</div>
						<div class="flex items-center gap-3">
							<span class="inline-block w-6 shrink-0 label-m text-foreground-placeholder">07</span>
							<a href="#onetime-repeat" class="link-inline">Repeating Product (Consumable)</a>
						</div>
					</div>
				</div>
			</nav>
		</div>
	</header>

	<div class="mx-auto w-full max-w-[1280px] space-y-14 px-4 pt-14 lg:px-16">
		<CheckoutSuccessSummary
			class="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900"
		/>

		<!-- ─── Section 1: Subscriptions with trial (all 4 billing cycles) ─── -->
		<section
			id="subscription-with-trial"
			class="relative left-1/2 w-screen -translate-x-1/2 border-b border-border-subtle pb-[104px]"
		>
			<div class="mx-auto w-full max-w-[1280px] px-4 pt-[104px] lg:px-16">
				<div class="mx-auto max-w-[620px] text-center">
					<h2 class="heading-l text-foreground-default">
						<span class="text-foreground-placeholder">Subscription</span><br />
						With Trial (4 Cycles)
					</h2>
					<p class="mt-3 subtitle-m text-foreground-muted">
						All four billing cycles are available. The toggle derives from the registered plans
						automatically.
					</p>
				</div>

				<div class="mt-10">
					<Subscription.Root
						api={connectedApi}
						{permissions}
						onBeforeCheckout={handleBeforeCheckout}
						class=""
					>
						<Subscription.Item
							type="free"
							title="Free"
							description={`✔️ Up to 3 users

✔️ Basic task management

✔️ Drag & drop builder

✔️ Task deadlines & reminders

✔️ Mobile access

✔️ Priority support

✔️ 1-1 calls
`}
						/>
						<Subscription.Item
							planId="basic"
							type="single"
							title="Basic"
							productIds={{
								'every-month': 'prod_4if4apw1SzOXSUAfGL0Jp9',
								'every-three-months': 'prod_5SxwV6WbbluzUQ2FmZ4trD',
								'every-six-months': 'prod_7Lhs8en6kiBONIywQUlaQC',
								'every-year': 'prod_KE9mMfH58482NIbKgK4nF'
							}}
						/>
						<Subscription.Item
							planId="premium"
							type="single"
							title="Premium"
							recommended
							productIds={{
								'every-month': 'prod_7Cukw2hVIT5DvozmomK67A',
								'every-three-months': 'prod_7V5gRIqWgui5wQflemUBOF',
								'every-six-months': 'prod_4JN9cHsEto3dr0CQpgCxn4',
								'every-year': 'prod_6ytx0cFhBvgXLp1jA6CQqH'
							}}
						/>
						<Subscription.Item
							type="enterprise"
							title="Enterprise"
							description={`✔️ Up to 3 users

✔️ Basic task management

✔️ Drag & drop builder

✔️ Task deadlines & reminders

✔️ Mobile access

✔️ Priority support

✔️ 1-1 calls
`}
							contactUrl="https://creem.io"
						/>
					</Subscription.Root>
				</div>

				<div class="flex justify-center pt-16">
					<BillingPortal api={connectedApi} {permissions} class="button-faded" />
				</div>
			</div>
		</section>

		<!-- ─── Section 2: Subscriptions without trial (monthly only) ─── -->
		<section
			id="subscription-without-trial"
			class="relative left-1/2 w-screen -translate-x-1/2 border-b border-border-subtle pb-[6.5rem]"
		>
			<div class="mx-auto w-full max-w-[1280px] px-4 pt-[6.5rem] lg:px-16">
				<div class="mx-auto max-w-[620px] text-center">
					<h2 class="heading-l text-foreground-default">
						<span class="text-foreground-placeholder">Subscription</span><br />
						Seat-Based (User-Selectable)
					</h2>
					<p class="mt-3 subtitle-m text-foreground-muted">
						Seat-based plans with a quantity picker. The user selects how many seats before
						checkout.
					</p>
				</div>

				<div class="mt-[6.5rem]">
					<Subscription.Root
						api={connectedApi}
						{permissions}
						onBeforeCheckout={handleBeforeCheckout}
					>
						<Subscription.Item
							type="free"
							title="Free"
							description={`✔️ Up to 3 users

✔️ Basic task management

✔️ Drag & drop builder

✔️ Task deadlines & reminders

✔️ Mobile access

✔️ Priority support

✔️ 1-1 calls
`}
						/>
						<Subscription.Item
							planId="basic-monthly"
							type="single"
							title="Basic"
							productIds={{ 'every-month': 'prod_53CU7duHB58lGTUqKlRroI' }}
						/>
						<Subscription.Item
							planId="professional-monthly"
							type="single"
							title="Professional"
							productIds={{ 'every-month': 'prod_3ymOe55fDzKgmPoZnPEOBq' }}
						/>
					</Subscription.Root>
				</div>

				<div class="flex justify-center pt-16">
					<BillingPortal api={connectedApi} {permissions} class="button-faded" />
				</div>
			</div>
		</section>

		<!-- ─── Section 3: Seat-based subscriptions ─── -->
		<section
			id="subscription-seat-selectable"
			class="relative left-1/2 w-screen -translate-x-1/2 border-b border-border-subtle pb-[6.5rem]"
		>
			<div class="mx-auto w-full max-w-[1280px] px-4 pt-[6.5rem] lg:px-16">
				<div class="mx-auto max-w-[620px] text-center">
					<h2 class="heading-l text-foreground-default">
						<span class="text-foreground-placeholder">Subscription</span><br />
						Seat-Based (User-Selectable)
					</h2>
					<p class="mt-3 subtitle-m text-foreground-muted">
						Only monthly products registered. The billing toggle should not appear.
					</p>
				</div>

				<div class="mt-[6.5rem]">
					<Subscription.Root
						api={connectedApi}
						{permissions}
						onBeforeCheckout={handleBeforeCheckout}
						showSeatPicker
					>
						<Subscription.Item
							planId="basic-seat-monthly"
							type="seat-based"
							title="Basic"
							productIds={{ 'every-month': 'prod_1c6ZGcxekHKrVYuWriHs68' }}
						/>
						<Subscription.Item
							planId="premium-seat-monthly"
							type="seat-based"
							title="Premium"
							productIds={{ 'every-month': 'prod_3861b06bJDnvpEBcs2uxYv' }}
						/>
					</Subscription.Root>
				</div>

				<div class="flex justify-center pt-16">
					<BillingPortal api={connectedApi} {permissions} class="button-faded" />
				</div>
			</div>
		</section>

		<!-- ─── Section 3b: Seat-based with auto-derived units ─── -->
		<section
			id="subscription-seat-auto"
			class="relative left-1/2 w-screen -translate-x-1/2 border-b border-border-subtle pb-[6.5rem]"
		>
			<div class="mx-auto w-full max-w-[1280px] px-4 pt-[6.5rem] lg:px-16">
				<div class="mx-auto max-w-[620px] text-center">
					<h2 class="heading-l text-foreground-default">
						<span class="text-foreground-placeholder">Subscription</span><br />
						Seat-Based (Auto-Derived)
					</h2>
					<p class="mt-3 subtitle-m text-foreground-muted">
						Same seat-based products but with a fixed unit count (e.g. derived from organization
						member count). No picker shown — hardcoded to 5 seats.
					</p>
				</div>

				<div class="mt-[6.5rem]">
					<Subscription.Root
						api={connectedApi}
						{permissions}
						onBeforeCheckout={handleBeforeCheckout}
						units={5}
						twoColumnLayout
					>
						<Subscription.Item
							planId="basic-seat-auto"
							type="seat-based"
							title="Basic"
							productIds={{ 'every-month': 'prod_1c6ZGcxekHKrVYuWriHs68' }}
						/>
						<Subscription.Item
							planId="premium-seat-auto"
							type="seat-based"
							title="Premium"
							productIds={{ 'every-month': 'prod_3861b06bJDnvpEBcs2uxYv' }}
						/>
					</Subscription.Root>
				</div>
			</div>
		</section>

		<!-- ─── Section 4: Standalone one-time product ─── -->
		<section
			id="onetime-single"
			class="relative left-1/2 w-screen -translate-x-1/2 border-b border-border-subtle pb-[6.5rem]"
		>
			<div class="mx-auto w-full max-w-[1280px] px-4 pt-[6.5rem] lg:px-16">
				<div class="mx-auto max-w-[620px] text-center">
					<h2 class="heading-l text-foreground-default">
						<span class="text-foreground-placeholder">One Time Purchase</span><br />
						Single One-Time Product
					</h2>
					<p class="mt-3 subtitle-m text-foreground-muted">
						A standalone product purchased once. Shows "Owned" after purchase.
					</p>
				</div>

				<div class="mt-[6.5rem]">
					<Product.Root
						api={connectedApi}
						{permissions}
						onBeforeCheckout={handleBeforeCheckout}
						layout="single"
						styleVariant="pricing"
					>
						<Product.Item
							type="one-time"
							title="One-time purchase"
							productId="prod_6npEfkzgtr9hSqdWd7fqKG"
						/>
					</Product.Root>
				</div>
			</div>
		</section>

		<!-- ─── Section 5: Mutually exclusive product group with upgrade ─── -->
		<section
			id="onetime-group"
			class="relative left-1/2 w-screen -translate-x-1/2 border-b border-border-subtle pb-[6.5rem]"
		>
			<div class="mx-auto w-full max-w-[1280px] px-4 pt-[6.5rem] lg:px-16">
				<div class="mx-auto max-w-[620px] text-center">
					<h2 class="heading-l text-foreground-default">
						<span class="text-foreground-placeholder">One Time Purchase</span><br />
						Mutually Exclusive Product Group
					</h2>
					<p class="mt-3 subtitle-m text-foreground-muted">
						Transition graph decides available upgrade paths. Upgrading from Basic to Premium uses a
						dedicated delta product. Buy first the Basic Product and then upgrade to Premium.
					</p>
				</div>

				<div class="mt-[6.5rem]">
					<Product.Root
						api={connectedApi}
						{permissions}
						onBeforeCheckout={handleBeforeCheckout}
						transition={upgradeTransitions}
						styleVariant="pricing"
						showImages
					>
						<Product.Item type="one-time" title="Basic" productId="prod_4Di7Lkhf3TXy4UOKsUrGw0" />
						<Product.Item type="one-time" title="Premium" productId="prod_56sJIyL7piLCVv270n4KBz" />
					</Product.Root>
				</div>
			</div>
		</section>

		<!-- ─── Section 6: Repeating (consumable) product ─── -->
		<section
			id="onetime-repeat"
			class="relative left-1/2 w-screen -translate-x-1/2 border-b border-border-subtle pb-[6.5rem]"
		>
			<div class="mx-auto w-full max-w-[1280px] px-4 pt-[6.5rem] lg:px-16">
				<div class="mx-auto max-w-[620px] text-center">
					<h2 class="heading-l text-foreground-default">
						<span class="text-foreground-placeholder">One Time Purchase</span><br />
						Repeating Product (Consumable)
					</h2>
					<p class="mt-3 subtitle-m text-foreground-muted">
						Can be purchased multiple times. No "Owned" badge — always shows the purchase button.
					</p>
				</div>

				<div class="mt-[6.5rem]">
					<Product.Root
						api={connectedApi}
						{permissions}
						onBeforeCheckout={handleBeforeCheckout}
						layout="single"
						styleVariant="pricing"
						showImages
						pricingCtaVariant="filled"
					>
						<Product.Item type="recurring" productId="prod_73CnZ794MaJ1DUn8MU0O5f" />
					</Product.Root>
				</div>
			</div>
		</section>
	</div>
</main>
