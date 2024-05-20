<script setup lang="ts">
import ItemTabs from "~/components/items/ItemTabs.vue";
import {useCostumesStore} from "~/stores/items/CostumesStore";
import CostumeCard from "~/components/items/CostumeCard.vue";

const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore
const costumesStore = useCostumesStore()

type CostumeShowType = 'newly-added' | 'newly-acquired';
const costumesShowType = ref<CostumeShowType>('newly-added');
const costumesShown = computed(() => costumesShowType.value === 'newly-added' ? costumesStore.getNewestCostumesDateCreated(10) : costumesStore.getNewestCostumesDateAcquired(10))
</script>

<template>
	<ItemTabs/>

	<UContainer v-if="hasPermissionOneOf('P_VIEW_ITEMS_COSTUMES')" class="w-full">
		<div class="flex items-center justify-between gap-2.5">
			<h2 class="text-xl">Costumes</h2>
			<div class="flex">
				<UTooltip text="Show newly added costumes">
					<UButton class="rounded-noright" icon="i-heroicons-calendar-days-20-solid"
					         :variant="costumesShowType === 'newly-added' ? 'solid' : 'outline'" @click="costumesShowType = 'newly-added'"/>
				</UTooltip>
				<UTooltip text="Show newly acquired costumes">
					<UButton class="rounded-noleft" icon="i-heroicons-currency-euro-20-solid"
					         :variant="costumesShowType === 'newly-acquired' ? 'solid' : 'outline'" @click="costumesShowType = 'newly-acquired'"/>
				</UTooltip>
			</div>
		</div>

		<UDivider size="sm" class="pt-2.5 pb-2.5"/>

		<div class="flex gap-1.5 overflow-x-auto pb-1.5" v-auto-animate>
			<CostumeCard v-for="costume in costumesShown"
			             :key="costume.id" class="w-48 h-64 flex-shrink-0"
			             :item="costume"/>
		</div>
	</UContainer>

	<UContainer v-if="hasPermissionOneOf('P_VIEW_ITEMS_PROPS')">
		hello
	</UContainer>

	<UContainer v-if="hasPermissionOneOf('P_VIEW_ITEMS_TECH')">
		hello
	</UContainer>

	<UContainer v-if="!hasPermissionOneOf(['P_VIEW_ITEMS_DASH', 'P_VIEW_ITEMS_COSTUMES', 'P_VIEW_ITEMS_PROPS', 'P_VIEW_ITEMS_TECH'])">
		It seems like you are not allowed to view any items. Please contact your administrator if you think this might be a mistake.
	</UContainer>
</template>

<style scoped lang="scss">

</style>