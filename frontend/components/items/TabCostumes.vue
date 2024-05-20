<script setup lang="ts">
import {useCostumesStore} from "~/stores/items/CostumesStore"
import TabCostumesListView from "~/components/items/TabCostumesListView.vue";
import TabCostumesGridView from "~/components/items/TabCostumesGridView.vue";

const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore
const costumesStore = useCostumesStore()
const {selectedCostumes} = storeToRefs(costumesStore)
const confirmDeleteModalOpen = ref(false)
const toDeleteCostumeIds = ref([] as number[])

/*definePageMeta({
	middleware: ['nuxt-permissions'],
	permissions: ['P_VIEW_ITEMS_COSTUMES'],
})*/

function showCreateCostumeDialog() {
	alert("Let's create a costume!")
}


</script>

<template>
	<div class="relative flex gap-1 items-center flex-wrap mb-2.5">
		<div>
			<UTooltip text="Display costumes as a list">
				<UButton class="rounded-noright" icon="i-heroicons-list-bullet-16-solid"
				         :variant="costumesStore.settings.viewMode === 'list' ? 'solid' : 'outline'"
				         @click="costumesStore.setListView()"/>
			</UTooltip>
			<UTooltip text="Display costumes as a grid">
				<UButton class="rounded-noleft" icon="i-heroicons-squares-2x2-20-solid"
				         :variant="costumesStore.settings.viewMode === 'grid' ? 'solid' : 'outline'"
				         @click="costumesStore.setGridView()"/>
			</UTooltip>
		</div>
		<UTooltip text="Create a new costume" v-if="hasPermissionOneOf('P_CREATE_ITEMS_COSTUME')">
			<UButton id="create-costume" icon="i-heroicons-plus-circle-20-solid"
			         variant="outline" @click="showCreateCostumeDialog()"/>
		</UTooltip>
	</div>

	<TabCostumesListView v-if="costumesStore.settings.viewMode === 'list'"/>
	<TabCostumesGridView v-else-if="costumesStore.settings.viewMode === 'grid'"/>

	<!--	<div class="confirm-delete-modal">
			<UModal v-model="confirmDeleteModalOpen">
				<h1>Are you sure you want to delete these item(s)?</h1>
				<div class="costume-list-container">
					
					<ul>
						<li v-for="id in toDeleteCostumeIds" :key="id">
							<div class="td-image-container square">
								<CycleblePreviewImage :images="costumesStore.getCostumeById(id).images" image-alt="" grayscale="false"/>
							</div>
							{{ costumesStore.getCostumeById(id).title }}
						</li>
					</ul>
					
					<UButton @click="costumesStore.deleteCostumes(toDeleteCostumeIds)">Delete</UButton>
					<UButton @click="confirmDeleteModalOpen = false">Cancel</UButton>
				</div>
			</UModal>
		</div>-->
</template>

<style scoped lang="scss">


</style>