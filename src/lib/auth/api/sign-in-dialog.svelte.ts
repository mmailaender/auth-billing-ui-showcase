/**
 * Shared sign-in dialog state.
 * Import { signInDialog } anywhere to open/close the sign-in dialog programmatically.
 */
let isOpen = $state(false);

export const signInDialog = {
	get isOpen() {
		return isOpen;
	},
	set isOpen(value: boolean) {
		isOpen = value;
	},
	open() {
		isOpen = true;
	},
	close() {
		isOpen = false;
	}
};
