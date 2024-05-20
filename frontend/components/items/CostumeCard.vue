<script setup lang="ts">
import type {ICostumeItem} from "~/composables/ICostumeItem";
import CyclablePreviewImage from "~/components/CyclablePreviewImage.vue";
import NewCyclableImage from "~/components/NewCyclableImage.vue";

const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore

const props = defineProps<{
	item: ICostumeItem
}>()

const images = computed(() => {
	// @ts-ignore
	let imageItems: CyclablePreviewImage[] = []
	for (let i = 0; i < props.item.images.length; i++) {
		imageItems.push({
			image: props.item.images[i],
			alt: `${props.item.title} ${i}`
		})
	}
	return imageItems
})


</script>

<template>
	<UCard class="overflow-hidden w-full h-full">
		<!-- HEADER -->
		<template #header>
			<div class="flex justify-center">
				<NuxtLink v-if="hasPermissionOneOf('P_VIEW_ITEMS_COSTUMES_DETAILS')"
				          :to="`/items/costumes/${item.id}`"
				          class="truncate text-sm overflow-hidden whitespace-nowrap">
					{{ item.title }}
				</NuxtLink>
				<span v-else class="truncate text-sm overflow-hidden whitespace-nowrap">{{ item.title }}</span>
			</div>
		</template>

		<!-- BODY -->
		<div class="w-full h-full">
			<UTooltip v-if="item.deactivated" text="This item is deactivated" class="w-full h-full">
				<NewCyclableImage :images="images" :grayscale="item.deactivated || false"/>
			</UTooltip>
			<NewCyclableImage v-else :images="images" :grayscale="item.deactivated ||false"/>
		</div>
	</UCard>
</template>

<style scoped lang="scss">

</style>