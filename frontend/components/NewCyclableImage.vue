<script setup lang="ts">
export type CyclablePreviewImage = {
	image: string,
	alt: string
}

const props = defineProps<{
	images: CyclablePreviewImage[],
	initialImageIndex?: number,
	grayscale: boolean
}>()

const imageIndex = ref(props.initialImageIndex || 0)
const nextImageIndex = ref((imageIndex.value + 1) % props.images.length)

function cycleImage() {
	imageIndex.value = (imageIndex.value + 1) % props.images.length;
	// Prefetch next image
	const nextIndex = (imageIndex.value + 1) % props.images.length
	const img = new Image()
	img.src = props.images[nextIndex].image
}
</script>

<template>
	<div class="w-full h-full">
		<transition name="fade-blend" mode="out-in">
			<NuxtPicture :key="imageIndex"
			             :src="images[imageIndex].image"
			             :alt="images[imageIndex].alt"
			             class="nuxt-image w-full h-full"
			             :class="grayscale ? 'grayscale' : ''"
			             :style="(images.length > 1 ? 'cursor: pointer' : '')"
			             @click="cycleImage"
			             format="avif,webp"
			             :placeholder="[64, 64, 60, 1]"/>
		</transition>
	</div>
</template>

<style scoped lang="scss">
.nuxt-image {
	display: flex;
	justify-content: center;

	:deep(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 0.25rem;
		transition: filter 0.25s linear;

		&:hover {
			width: auto;
			object-fit: contain;
			filter: none;
		}
	}
}

.fade-blend-enter-active, .fade-blend-leave-active {
	transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out, backdrop-filter 0.5s ease-in-out;
}

.fade-blend-enter, .fade-blend-leave-to { /* .fade-blend-leave-active in <2.1.8 */
	opacity: 0;
	transform: scale(1.05);
	backdrop-filter: blur(2px); /* Adjust the blur amount as needed */
}

.fade-blend-enter-to, .fade-blend-leave {
	opacity: 1;
	transform: scale(1);
	backdrop-filter: none; /* Reset the blur effect */
}
</style>