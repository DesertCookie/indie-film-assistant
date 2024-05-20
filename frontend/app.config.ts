export default defineAppConfig({
	ui: {
		primary: '#933634',
		icons: ['heroicons', 'material-symbols-light', 'simple-icons'],
		/*icons: {
			dynamic: true,
			breadcrumb: {
				default: {
					divider: 'heroicons:chevron-right-20-solid'
				}
			}
		},*/
		notifications: {
			//position: 'top-right'
		},
		container: {
			padding: 'px-2 sm:px-4 lg:px-6',
		},
		table: {
			wrapper: 'pb-1.5', // space for the scrollbar
			divide: 'divide-y mx-1 divide-gray-300 dark:divide-gray-700',
			th: {
				padding: 'px-2 py-3',
			},
			td: {
				padding: 'px-2 py-2.5',
			},
		},
		card: {
			base: 'flex flex-col',
			header: {
				base: '',
				background: '',
				padding: 'px-2 py-2 sm:px-2 sm:py-2 lg:px-2 lg:py-2',
			},
			body: {
				base: 'flex-grow overflow-hidden',
				background: '',
				padding: 'px-2 py-2 sm:px-2 sm:py-2 lg:px-2 lg:py-2',
			},
			footer: {
				base: '',
				background: '',
				padding: 'px-2 py-2 sm:px-2 sm:py-2 lg:px-2 lg:py-2',
			},
		}
	},
	nuxtIcon: {
		size: '24px', // default <Icon> size applied
		class: 'icon', // default <Icon> class applied
		aliases: {
			'nuxt': 'logos:nuxt-icon',
		}
	}
})
