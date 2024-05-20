<script setup lang="ts">
import {useCostumesStore} from "~/stores/items/CostumesStore";
import type {ICostumeItem} from "~/composables/ICostumeItem";

const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore
const costumesStore = useCostumesStore()

const idFromRoute = parseInt(useRoute().params.id as string)
const costume = ref<ICostumeItem | undefined>(costumesStore.getCostumeById(idFromRoute))

/*definePageMeta({
	title: (costume.value?.title || 'ERROR') + ' | Indie Film Assistant',
})*/

function formatDateToLocal(date?: Date): string {
	if (date === undefined) {
		return '';
	}
	return new Intl.DateTimeFormat(undefined, { // Use the browser's default locale
		month: '2-digit', // Specify that the month should always be 2 digits
		day: '2-digit',   // Specify that the day should always be 2 digits
		year: 'numeric'   // Include the year in the format
	}).format(date);
}


</script>

<template>
	<UContainer v-if="costume">
		<div class="container mx-auto p-4">
			<div v-if="costume.images.length">
				<UCarousel v-slot="{item}" :items="costume.images" arrows indicators class="h-96 rounded-lg overflow-hidden">
					<NuxtImg :src="item" height="384" class="h-96"/>
				</UCarousel>
			</div>

			<div class="bg-white shadow-lg rounded-lg p-6">
				<h1 class="text-2xl font-semibold mb-4">{{ costume.title }}</h1>
				<p v-if="costume.description" class="mb-4">{{ costume.description }}</p>

				<div v-if="costume.inventory_no" class="mb-2">
					<strong class="font-semibold">Inventory No: </strong>
					<span>{{ costume.inventory_no }}</span>
				</div>

				<div v-if="costume.date_acquired" class="mb-2">
					<strong class="font-semibold">Date Acquired: </strong>
					<span>{{ formatDateToLocal(costume.date_acquired) }}</span>
				</div>

				<div v-if="costume.types" class="mb-2">
					<strong class="font-semibold">Types: </strong>
					<ul class="list-disc pl-5">
						<li v-for="type in costume.types" :key="type">{{ type }}</li>
					</ul>
				</div>

				<div v-if="costume.size" class="mb-2">
					<strong class="font-semibold">Size: </strong>
					<span>{{ costume.size }}</span>
				</div>

				<div v-if="costume.colors" class="mb-2">
					<strong class="font-semibold">Colors: </strong>
					<ul class="list-disc pl-5">
						<li v-for="color in costume.colors" :key="color">{{ color }}</li>
					</ul>
				</div>

				<div v-if="costume.status" class="mb-2">
					<strong class="font-semibold">Status: </strong>
					<span>{{ costume.status }}</span>
				</div>

				<div v-if="costume.owner" class="mb-2">
					<strong class="font-semibold">Owner: </strong>
					<span>{{ costume.owner }}</span>
				</div>

				<div v-if="costume.storage_address" class="mb-2">
					<strong class="font-semibold">Storage Address: </strong>
					<address class="not-italic">
						{{ costume.storage_address.toString() }}
					</address>
				</div>

				<div v-if="costume.storage_location" class="mb-2">
					<strong class="font-semibold">Storage Location: </strong>
					<span>{{ costume.storage_location }}</span>
				</div>

				<div v-if="costume.tags" class="mb-2">
					<strong class="font-semibold">Tags: </strong>
					<ul class="list-disc pl-5">
						<li v-for="tag in costume.tags" :key="tag">{{ tag }}</li>
					</ul>
				</div>

				<div v-if="costume.deactivated" class="mb-2">
					<strong class="font-semibold">Status: </strong>
					<span>Deactivated</span>
				</div>

				<div v-if="costume.reserved" class="mb-2">
					<strong class="font-semibold">Reservation: </strong>
					<span>Reserved</span>
				</div>
			</div>
		</div>
	</UContainer>

	<UContainer v-else>
		There was an error loading the costume. Please try again later and inform an administrator.
	</UContainer>
</template>

<style scoped lang="scss">

</style>