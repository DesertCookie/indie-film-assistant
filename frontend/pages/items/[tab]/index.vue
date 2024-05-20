<script setup lang="ts">
import ItemTabs from "~/components/items/ItemTabs.vue";
import CostumesTab from "~/components/items/TabCostumes.vue";

const route = useRoute()
const currentTab = route.params.tab

const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore


</script>

<template>
	<ItemTabs/>

	<UContainer>
		<div v-if="currentTab === 'costumes'">
			<CostumesTab/>
		</div>
		<div v-else-if="currentTab === 'props'">
			props
		</div>
		<div v-else-if="currentTab === 'tech'">
			tech
		</div>
	</UContainer>
</template>

<style scoped lang="scss">

</style>