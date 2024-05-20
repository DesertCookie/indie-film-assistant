<script setup lang="ts">

</script>

<template>
	<NuxtLink to="/items">Items</NuxtLink>
	<p class="mt-5 text-sm">Welcome to Indie Film Assistant <code>v{{ useRuntimeConfig().public.appVersion }}</code> built <code>{{
			useRuntimeConfig().public.appBuild
		}}</code></p>
</template>

<style scoped lang="scss">

</style>