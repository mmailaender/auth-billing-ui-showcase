/**
 * Shared demo role state backed by localStorage.
 * Import { demoRole } anywhere to read/write the current demo role.
 */

const STORAGE_KEY = 'demo-role';

type DemoRoleValue = 'admin' | 'member';

function readFromStorage(): DemoRoleValue {
	if (typeof window === 'undefined') return 'admin';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'admin' || stored === 'member') return stored;
	return 'admin';
}

let current = $state<DemoRoleValue>(readFromStorage());

export const demoRole = {
	get value(): DemoRoleValue {
		return current;
	},
	set value(role: DemoRoleValue) {
		current = role;
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, role);
		}
	},
	get isAdmin(): boolean {
		return current === 'admin';
	}
};
