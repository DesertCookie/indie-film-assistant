<script setup lang="ts">
const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore
const router = useRouter()
const route = useRoute()

/*const breadcrumbLinks = computed(() => {
	const links = []
	
	links.push({label: 'Home', icon: 'i-heroicons-home-solid', to: '/'})
	links.push({label: 'Items', icon: 'i-heroicons-archive-box-20-solid', to: '/items'})
	if (route.path === '/items/costumes') links.push({label: 'Costumes', icon: 'i-heroicons-scissors-solid', to: '/items/costumes'})
	if (route.path === '/items/props') links.push({label: 'Props', icon: 'i-heroicons-building-storefront-solid', to: '/items/props'})
	if (route.path === '/items/tech') links.push({label: 'Tech', icon: 'i-heroicons-camera-solid', to: '/items/tech'})
	
	return links
})*/

// Computes the visible tabs based on the user's permissions: P_VIEW_ITEMS_DASH, P_VIEW_ITEMS_COSTUMES, P_VIEW_ITEMS_PROPS, P_VIEW_ITEMS_TECH.
const tabItems = computed(() => {
	const items = []
	
	if (hasPermissionOneOf('P_VIEW_ITEMS_DASH')) items.push({slot: 'dash', label: 'Dash', icon: 'i-heroicons-presentation-chart-bar-20-solid'})
	if (hasPermissionOneOf('P_VIEW_ITEMS_COSTUMES')) items.push({slot: 'costumes', label: 'Costumes', icon: 'i-heroicons-scissors-solid'})
	if (hasPermissionOneOf('P_VIEW_ITEMS_PROPS')) items.push({slot: 'props', label: 'Props', icon: 'i-heroicons-building-storefront-solid'})
	if (hasPermissionOneOf('P_VIEW_ITEMS_TECH')) items.push({slot: 'tech', label: 'Tech', icon: 'i-heroicons-camera-solid'})
	
	return items
})

// Computes the selected tab based on the current route.
const selectedTab = computed({
	get() {
		const currentPath = route.path.split('/').pop();
		const index = tabItems.value.findIndex(item => item.slot === currentPath);
		if (index === -1) return 0;
		
		return index;
	},
	set(value) {
		const tabPath = tabItems.value[value].slot;
		if (tabPath === 'dash') router.push('/items')
		else router.push(`/items/${tabPath}`) // Navigate to the dynamic route.
	}
})

</script>

<template>
	<!--	<div>
			<UBreadcrumb :links="breadcrumbLinks"/>
		</div>-->
	
	<UTabs :items="tabItems" v-model="selectedTab">
		<template #default="{ item, index, selected }">
			<div class="flex items-center gap-2">
				<UIcon :name="item.icon"/>
				<span>{{ item.label }}</span>
			</div>
		</template>
	</UTabs>
</template>

<style scoped lang="scss">

</style>