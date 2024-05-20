export const useAuthStore = defineStore('auth', {
	state: () => ({
		roles: [] as string[],
		permissions: [
			'P_VIEW_ITEMS_DASH', 'P_VIEW_ITEMS_DEACTIVATED', 'P_EDIT_ITEMS_DEACTIVATED', 'P_EDIT_ITEMS_RESERVED',
			'P_VIEW_ITEMS_COSTUMES', 'P_VIEW_ITEMS_COSTUMES_DETAILS', 'P_EDIT_ITEMS_COSTUMES', 'P_CREATE_ITEMS_COSTUME', 'P_DELETE_ITEMS_COSTUME',
			'P_VIEW_ITEMS_PROPS',
			'P_VIEW_ITEMS_TECH'
		] as string[],
	}),
	getters: {
		hasRole: (state) => {
			return (role: string) => state.roles.includes(role);
		},
		/**
		 * Returns a higher-order function that checks if the state has at least one of the given permissions.
		 *
		 * @param {string|string[]} permissionsToCheck - The permission or an array of permissions to check.
		 * @return {boolean} Whether the state has at least one of the given permissions.
		 */
		hasPermissionOneOf: (state) => {
			return (permissionsToCheck: string | string[]) => {
				const permissionsArray = Array.isArray(permissionsToCheck) ? permissionsToCheck : [permissionsToCheck];
				return permissionsArray.some(permission => state.permissions.includes(permission));
			}
		},
	},
	actions: {},
	persist: true
})