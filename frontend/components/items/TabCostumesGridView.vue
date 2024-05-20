<script setup lang="ts">
import CostumeCard from "~/components/items/CostumeCard.vue";
import {useCostumesStore} from "~/stores/items/CostumesStore";

const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore
const costumesStore = useCostumesStore()
const {selectedCostumes} = storeToRefs(costumesStore)


</script>

<template>
	<div class="costume-grid-container" v-auto-animate>
		<CostumeCard v-for="costume in costumesStore.getFilteredCostumes"
		             :key="costume.id" class="min-w-48 min-h-64 aspect-[48/64]"
		             :item="costume"/>
	</div>
</template>

<style scoped lang="scss">
.costume-grid-container {
	display: grid;
	gap: 0.5rem;
	grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
}
</style>