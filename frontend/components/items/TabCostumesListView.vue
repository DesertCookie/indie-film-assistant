<script setup lang="ts">
import {useCostumesStore} from "~/stores/items/CostumesStore";
import CyclablePreviewImage from "~/components/CyclablePreviewImage.vue";

const authStore = useAuthStore()
const {hasPermissionOneOf} = authStore
const costumesStore = useCostumesStore()
const {selectedCostumes} = storeToRefs(costumesStore)
const confirmDeleteModalOpen = ref(false)
const toDeleteCostumeIds = ref([] as number[])

const completeColumns = ref([ // all columns
	{order: -1, key: 'actions'},
	{order: 0, key: 'imagePreview'},
	{order: 1, label: 'Title', key: 'title', sortable: true},
	{order: 2, label: 'Inv. No.', key: 'invNo', sortable: true},
	{order: 3, label: 'Description', key: 'description'},
	{order: 4, label: 'Date Acq.', key: 'dateAcquired', sortable: true},
	{order: 5, label: 'Types', key: 'types'},
	{order: 6, label: 'Size', key: 'size', sortable: true},
	{order: 7, label: 'Colors', key: 'colors'},
	{order: 8, label: 'Tags', key: 'tags'},
	{order: 9, label: 'Status', key: 'status'},
	{order: 10, label: 'Owner', key: 'owner', sortable: true},
	{order: 11, label: 'Storage Addr.', key: 'storageAddress', sortable: true},
	{order: 12, label: 'Storage Loc.', key: 'storageLocation', sortable: true}
])
const mandatoryColumnsKeys = ['imagePreview', 'title']; // columns that can't be hidden
const selectedColumns = ref([])
watchEffect(() => {
	selectedColumns.value = completeColumns.value.filter(col => {
		// Dynamic check based on settings for each column
		switch (col.key) {
			case 'invNo':
				return costumesStore.settings.showInvNo
			case 'description':
				return costumesStore.settings.showDescription
			case 'dateAcquired':
				return costumesStore.settings.showDateAcquired
			case 'types':
				return costumesStore.settings.showType
			case 'size':
				return costumesStore.settings.showSize
			case 'colors':
				return costumesStore.settings.showColor
			case 'tags':
				return costumesStore.settings.showTags
			case 'status':
				return costumesStore.settings.showStatus
			case 'owner':
				return costumesStore.settings.showOwner
			case 'storageAddress':
				return costumesStore.settings.showStorageAddress
			case 'storageLocation':
				return costumesStore.settings.showStorageLocation
			default:
				return true; // Always show actions, image preview, and other static fields
		}
	})
})

const filteredColumns = computed(() => { // currently shown columns: uses selectedColumns to filter completeColumns
	let cols = completeColumns.value

	if (!hasPermissionOneOf(['P_VIEW_ITEMS_COSTUMES_DETAILS', 'P_EDIT_ITEMS_COSTUMES', 'P_EDIT_ITEMS_DEACTIVATED', 'P_DELETE_ITEMS_COSTUME']))
		cols = cols.filter(column => column.key !== 'actions'); // hide actions if user doesn't have access to them

	const selectedKeys = selectedColumns.value.map(column => column.key);
	cols = cols.filter(column => selectedKeys.includes(column.key));

	return cols
});

const rows = computed(() => { // rows that will be displayed: removes items the user doesn't have access to (e.g. deactivated ones)
	const rows = []

	rows.push({filterRow: true}) // empty row for filters

	for (const costume of costumesStore.getFilteredCostumes) {
		if ((hasPermissionOneOf('P_VIEW_ITEMS_COSTUMES') && !costume.deactivated)
				|| (costume.deactivated && hasPermissionOneOf('P_VIEW_ITEMS_DEACTIVATED'))) {
			rows.push(costume)
		}
	}

	return rows
})

watch(selectedCostumes, () => {
	// Remove select checkbox entry
	selectedCostumes.value = selectedCostumes.value.filter(filterRow => filterRow !== null)

	console.log(selectedCostumes.value.length)
	console.log(JSON.stringify(selectedCostumes.value))
	useToast().remove('costumes_being_selected') // remove toast

	if (selectedCostumes && selectedCostumes.value.length > 0) // re-add toast with updated values (or don't if nothing is selected)
		useToast().add({
			id: 'costumes_being_selected',
			title: (selectedCostumes.value.length === 1 ? `1 costume selected` : `${selectedCostumes.value.length} costumes selected`),
			icon: 'i-heroicons-document-check',
			timeout: 0,
			closeButton: false,
			click: () => navigateTo('/items/costumes'),
			actions: [{
				label: 'Deselect all',
				click: () => selectedCostumes.value = []
			}]
		})
})

/*function updateSelectedCostumesNotification(selectedCount: number) {
	useToast().remove('costumes_being_selected')
	if (selectedCount > 0) useToast().add({
		id: 'costumes_being_selected',
		title: (selectedCount === 1 ? `1 costume selected` : `${selectedCount} costumes selected`),
		icon: 'i-heroicons-document-check',
		timeout: 0,
		closeButton: false,
		click: () => navigateTo('/items/costumes'),
		actions: [{
			label: 'Deselect all',
			click: () => costumesStore.selectedCostumeIds = []
		}]
	})
}

function buildActionsDropdownItems(row: any) {
	const items = []
	const itemSection1 = []
	const itemSection2 = []
	const itemSection3 = []

	// SECTION 1: details, edit, share, select
	if (hasPermissionOneOf('P_VIEW_ITEMS_COSTUMES_DETAILS'))
		itemSection1.push({
			label: 'Details',
			icon: 'i-heroicons-magnifying-glass-solid',
			click: () => navigateTo(`/items/costumes/${row.id}`)
		})
	if (hasPermissionOneOf('P_EDIT_ITEMS_COSTUMES'))
		itemSection1.push({
			label: 'Edit',
			icon: 'i-heroicons-pencil-solid',
			click: () => navigateTo(`/items/costumes/${row.id}/edit`)
		})
	itemSection1.push({
		label: 'Share',
		icon: 'i-heroicons-link-16-solid',
		click: () => {
			useCopyToClipboard().copy(`http://localhost:3000/items/costumes/${row.id}`)
			useToast().add({
				id: 'costume_copied_to_clipboard',
				title: 'Costume link copied to clipboard',
				icon: 'material-symbols:content-copy',
			})
		}
	})
	if (!costumesStore.selectedCostumeIds.includes(row.id))
		itemSection1.push({
			label: 'Select',
			icon: 'i-heroicons-document-check',
			click: () => {
				costumesStore.addSelectedCostumeId(row.id)
				updateSelectedCostumesNotification(costumesStore.selectedCostumeIds.length)
			}
		})
	else {
		itemSection1.push({
			label: 'Deselect',
			icon: 'i-heroicons-document',
			click: () => {
				costumesStore.removeSelectedCostumeId(row.id)
				updateSelectedCostumesNotification(costumesStore.selectedCostumeIds.length)
			}
		})
	}

	// SECTION 2: reserve, activate/deactivate
	if (hasPermissionOneOf('P_EDIT_ITEMS_RESERVED'))
		itemSection2.push({
			label: 'Reserve',
			icon: 'i-heroicons-clock-solid',
			click: () => {
				alert('Reserves this item for 21 days')
			}
		})
	if (hasPermissionOneOf('P_EDIT_ITEMS_DEACTIVATED') && row.deactivated)
		itemSection2.push({
			label: 'Activate',
			icon: 'i-heroicons-eye-20-solid',
			click: () => costumesStore.updateCostume({
				id: row.id,
				deactivated: false
			})
		})
	else if (hasPermissionOneOf('P_EDIT_ITEMS_DEACTIVATED') && !row.deactivated)
		itemSection2.push({
			label: 'Deactivate',
			icon: 'i-heroicons-eye-slash-20-solid',
			click: () => costumesStore.updateCostume({
				id: row.id,
				deactivated: true
			})
		})

	// SECTION 3: delete
	if (hasPermissionOneOf('P_DELETE_ITEMS_COSTUME'))
		itemSection3.push({
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
			click: () => {
				if (!toDeleteCostumeIds.value.includes(row.id))
					toDeleteCostumeIds.value.push(row.id)
				// confirmDeleteModalOpen.value = true
				useToast().add({
					id: 'confirm_deletion_single',
					title: `Delete ${costumesStore.getCostumeById(row.id)?.title}?`,
					icon: 'i-heroicons-trash-20-solid',
					timeout: 0,
					actions: [
						{
							label: 'Delete',
							click: () => {
								costumesStore.deleteCostumes([row.id]);
								toDeleteCostumeIds.value = toDeleteCostumeIds.value.filter(id => id !== row.id);
								updateSelectedCostumesNotification(costumesStore.selectedCostumeIds.length)
							}
						},
						{
							label: 'Cancel',
							click: () => toDeleteCostumeIds.value = toDeleteCostumeIds.value.filter(id => id !== row.id)
						}
					]
				})
			}
		})

	items.push(itemSection1, itemSection2, itemSection3)
	return items
}

function buildMultiActionsDropdownItems() {
	const items = []
	const itemSection1 = []
	const itemSection2 = []
	const itemSection3 = []

	// SECTION 1: share
	itemSection1.push({
		label: `Share (${costumesStore.selectedCostumeIds.length})`,
		icon: 'i-heroicons-link-16-solid',
		click: () => {
			if (!costumesStore.selectedCostumeIds || costumesStore.selectedCostumeIds.length === 0) return console.warn('No costumes to copy to clipboard')

			let text = '';
			costumesStore.selectedCostumeIds.forEach(id => {
				const costume = costumesStore.costumes.find(costume => costume.id === id);
				if (costume) text += `${costume.title}: \thttp://localhost:3000/items/costumes/${costume.id}\n`;
				else console.error(`Costume with ID ${id} not found`);
			})
			useCopyToClipboard().copy(text)
			useToast().add({
				id: 'costume_copied_to_clipboard',
				title: `Costumes copied to clipboard: ${costumesStore.selectedCostumeIds.length}`,
				icon: 'material-symbols:content-copy',
			})
		}
	})

	// SECTION 2: reserve, activate, deactivate
	if (hasPermissionOneOf('P_EDIT_ITEMS_RESERVED'))
		itemSection2.push({
			label: `Reserve (${costumesStore.getReservableCount !== costumesStore.selectedCostumeIds.length
					? `${costumesStore.getReservableCount}/${costumesStore.selectedCostumeIds.length}`
					: `${costumesStore.selectedCostumeIds.length}`})`,
			icon: 'i-heroicons-clock-solid',
			click: () => {
				alert('Reserved these items for 21 days')
			}
		})
	if (hasPermissionOneOf('P_EDIT_ITEMS_DEACTIVATED'))
		itemSection2.push({
			label: `Activate (${costumesStore.getActivatableCount !== costumesStore.selectedCostumeIds.length
					? `${costumesStore.getActivatableCount}/${costumesStore.selectedCostumeIds.length}`
					: `${costumesStore.selectedCostumeIds.length}`})`,
			icon: 'i-heroicons-eye-20-solid',
			click: () => alert("Let's activate the costume!")
		})
	itemSection2.push({
		label: `Deactivate (${costumesStore.getDeactivatableCount !== costumesStore.selectedCostumeIds.length
				? `${costumesStore.getDeactivatableCount}/${costumesStore.selectedCostumeIds.length}`
				: `${costumesStore.selectedCostumeIds.length}`})`,
		icon: 'i-heroicons-eye-slash-20-solid',
		click: () => alert("Let's deactivate the costume!")
	})

	// SECTION 3: delete
	if (hasPermissionOneOf('P_DELETE_ITEMS_COSTUME'))
		itemSection3.push({
			label: `Delete (${costumesStore.selectedCostumeIds.length})`,
			icon: 'i-heroicons-trash-20-solid',
			click: () => {
				costumesStore.selectedCostumeIds.forEach((id: number) => {
					if (!toDeleteCostumeIds.value.includes(id))
						toDeleteCostumeIds.value.push(id);
				})
				// confirmDeleteModalOpen.value = true
				useToast().add({
					id: 'confirm_deletion_multiple',
					title: `Delete ${toDeleteCostumeIds.value.length} items?`,
					icon: 'i-heroicons-trash-20-solid',
					timeout: 0,
					actions: [
						{
							label: 'Delete',
							click: () => {
								costumesStore.deleteCostumes(toDeleteCostumeIds.value)
								toDeleteCostumeIds.value = []
								updateSelectedCostumesNotification(costumesStore.selectedCostumeIds.length)
							}
						},
						{
							label: 'Cancel',
							click: () => toDeleteCostumeIds.value = []
						}
					]
				})
			}
		})

	items.push(itemSection1, itemSection2, itemSection3)
	return items
}*/

function generateImagesForPreviewImage(row: any) {
	// @ts-ignore
	let imageItems: CyclablePreviewImage[] = []
	for (let i = 0; i < row.images.length; i++) {
		imageItems.push({
			image: row.images[i],
			alt: `${row.title} ${i}`
		})
	}
	return imageItems
}

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
	<div class="costume-list-container">
		<UTooltip text="Show or hide data columns" :popper="{ placement: 'right' }">
			<USelectMenu v-model="selectedColumns"
			             :options="completeColumns.filter(column => column.key !== 'actions' && column.key !== 'imagePreview' && column.key!=='title')"
			             multiple searchable placeholder="Columns"/>
		</UTooltip>

		<UTable :columns="filteredColumns.sort((a, b) => a.order - b.order)" :rows="rows" :loading="costumesStore.loading" v-model="selectedCostumes"
		        v-auto-animate>
			<template #imagePreview-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow"></div>
				<div v-else class="td-image-container square" v-auto-animate>
					<UTooltip v-if="row.deactivated" text="This item is deactivated" class="w-full h-full">
						<NewCyclableImage :images="generateImagesForPreviewImage(row)" :grayscale="row.deactivated || false"/>
					</UTooltip>
					<NewCyclableImage v-else :images="generateImagesForPreviewImage(row)" :grayscale="row.deactivated || false"/>
				</div>
			</template>
			<template #title-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow">
					<UInput type="text" v-model="costumesStore.filters.title" placeholder="Filter title"/>
				</div>
				<div v-else class="td-text-container medium" v-auto-animate>
					<NuxtLink v-if="hasPermissionOneOf('P_VIEW_ITEMS_COSTUMES_DETAILS')" :to="`/items/costumes/${row.id}`">{{ row.title }}</NuxtLink>
					<span v-else>{{ row.title }}</span>
				</div>
			</template>
			<template #invNo-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow">
					<UInput type="text" v-model="costumesStore.filters.inventory_no" placeholder="Filter inv. no."/>
				</div>
				<div v-else class="td-text-container square" v-auto-animate><code>{{ row.inventory_no || '-' }}</code></div>
			</template>
			<template #description-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow">
					<UInput type="text" v-model="costumesStore.filters.description" placeholder="Filter description"/>
				</div>
				<div v-else class="td-text-container large" v-auto-animate>{{ row.description || '-' }}</div>
			</template>
			<template #dateAcquired-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow">
					<!--					<DatePicker v-model="costumesStore.filters.date_acquired"/>-->
				</div>
				<div v-else class="td-text-container small" v-auto-animate>{{ formatDateToLocal(row.date_acquired) || '-' }}</div>
			</template>
			<template #types-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow" class="td-text-container-max small" v-auto-animate>
					<span v-for="type in costumesStore.filters.types" class="selectable-tag"
					      @click="costumesStore.removeFilterType(type)"><code>{{ type }}</code></span>
				</div>
				<div v-else class="td-text-container small" v-auto-animate>
					<span v-for="type in row.types"
					      class="selectable-tag" @click="costumesStore.addFilterType(type)"><code>{{ type }}</code></span>
					<span v-if="!row.types || row.types?.length === 0">-</span>
				</div>
			</template>
			<template #size-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow">
					<UInput type="text" v-model="costumesStore.filters.size" placeholder="Filter size"/>
				</div>
				<div v-else class="td-text-container small" v-auto-animate>{{ row.size || '-' }}</div>
			</template>
			<template #colors-data="{ row }" class="td-costume-list-colors">
				<div v-if="row.filterRow" class="td-text-container-max small" v-auto-animate>
					<span v-for="color in costumesStore.filters.colors"
					      class="selectable-tag" @click="costumesStore.removeFilterColor(color)"><code>{{ color }}</code></span>
				</div>
				<div v-else class="td-item-container small" v-auto-animate>
					<span v-for="color in row.colors"
					      class="selectable-tag" @click="costumesStore.addFilterColor(color)"><code>{{ color }}</code></span>
					<span v-if="!row.colors || row.colors?.length === 0">-</span>
				</div>
			</template>
			<template #tags-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow" class="td-text-container-max small" v-auto-animate>
					<span v-for="tag in costumesStore.filters.tags"
					      class="selectable-tag" @click="costumesStore.removeFilterTag(tag)"><code>{{ tag }}</code></span>
				</div>
				<div v-else class="td-item-container small" v-auto-animate>
					<span v-for="tag in row.tags"
					      class="selectable-tag" @click="costumesStore.addFilterTag(tag)"><code>{{ tag }}</code></span>
					<span v-if="!row.tags || row.tags?.length === 0">-</span>
				</div>
			</template>
			<template #status-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow">
					<UInput type="text" v-model="costumesStore.filters.status" placeholder="Filter status"/>
				</div>
				<div v-else class="td-text-container small" v-auto-animate>{{ row.status || '-' }}</div>
			</template>
			<template #storageAddress-data="{ row  }" v-auto-animate>
				<div v-if="row.filterRow">
					test
				</div>
				<div v-else class="td-text-container small" v-auto-animate>{{ row.storage_address?.toStringZipCity() || '-' }}</div>
			</template>
			<template #storageLocation-data="{ row }" v-auto-animate>
				<div v-if="row.filterRow">
					<UInput type="text" v-model="costumesStore.filters.storage_location" placeholder="Filter strg. loc."/>
				</div>
				<div v-else class="td-text-container small" v-auto-animate>{{ row.storage_location || '-' }}</div>
			</template>
		</UTable>
	</div>

	<!--		<table v-auto-animate>
				<tr class="table-head"
					v-auto-animate>
					<th class="td-costume-list-image"
						v-if="costumesStore.settings.showImages"></th>
					<th class="td-costume-list-title"
						v-if="costumesStore.settings.showTitle">Title
					</th>
					<th class="td-costume-list-inv-no"
						v-if="costumesStore.settings.showInvNo">Inv. No.
					</th>
					<th class="td-costume-list-description"
						v-if="costumesStore.settings.showDescription">Description
					</th>
					<th class="td-costume-list-date-acquired"
						v-if="costumesStore.settings.showDateAcquired">Acquired
					</th>
					<th class="td-costume-list-type"
						v-if="costumesStore.settings.showType">Type
					</th>
					<th class="td-costume-list-size"
						v-if="costumesStore.settings.showSize">Size
					</th>
					<th class="td-costume-list-colors"
						v-if="costumesStore.settings.showColor">Color
					</th>
					<th class="td-costume-list-tags"
						v-if="costumesStore.settings.showTags">Tags
					</th>
					<th class="td-costume-list-status"
						v-if="costumesStore.settings.showStatus">Status
					</th>
					<th class="td-costume-list-owner"
						v-if="costumesStore.settings.showOwner">Owner
					</th>
					<th class="td-costume-list-storage-address"
						v-if="costumesStore.settings.showStorageAddress">Storage Address
					</th>
					<th class="td-costume-list-storage-location"
						v-if="costumesStore.settings.showStorageLocation">Storage Location
					</th>
					<th class="td-costume-list-actions"
						v-if="hasPermissionOneOf(['P_VIEW_ITEMS_COSTUMES_DETAILS', 'P_EDIT_ITEMS_COSTUMES'])"></th>
				</tr>

				<tr class="spacing-row">
					<td class="td-costume-list-image"
						v-if="costumesStore.settings.showImages">
						<UTooltip text="Reset filters">
							<UButton @click="costumesStore.resetFilters">
								<Icon name="carbon:zoom-reset" size="18"/>
							</UButton>
						</UTooltip>
					</td>
					<td class="td-costume-list-title"
						v-if="costumesStore.settings.showTitle">
						<UInput type="text" placeholder="Filter by title" v-model="costumesStore.filters.title"/>
					</td>
					<td class="td-costume-list-inv-no"
						v-if="costumesStore.settings.showInvNo">
						<UInput type="text" placeholder="Filter by inventory number" v-model="costumesStore.filters.inventory_no"/>
					</td>
					<td class="td-costume-list-description"
						v-if="costumesStore.settings.showDescription">
						<UInput type="text" placeholder="Filter by description" v-model="costumesStore.filters.description"/>
					</td>
					<td class="td-costume-list-date-acquired"
						v-if="costumesStore.settings.showDateAcquired">
						<UInput type="text" placeholder="Filter by acquisition date" v-model="costumesStore.filters.date_acquired"/>
					</td>
					<td class="td-costume-list-type"
						v-if="costumesStore.settings.showType">
						<div class="text-container two-lines">
							<UTooltip text="Click to remove from filters"
										v-for="type in costumesStore.filters.types" :key="type">
								<code class="tag" @click="costumesStore.removeFilterColor(type)">{{ type }}</code>
							</UTooltip>
						</div>
					</td>
					<td class="td-costume-list-size"
						v-if="costumesStore.settings.showSize">
						<UInput type="text" placeholder="Filter by size" v-model="costumesStore.filters.size"/>
					</td>
					<td class="td-costume-list-colors"
						v-if="costumesStore.settings.showColor">
						<div class="text-container two-lines">
							<UTooltip text="Click to remove from filters"
										v-for="color in costumesStore.filters.colors" :key="color">
								<code class="tag" @click="costumesStore.removeFilterColor(color)">{{ color }}</code>
							</UTooltip>
						</div>
					</td>
					<td class="td-costume-list-tags"
						v-if="costumesStore.settings.showTags">
						<div class="text-container two-lines">
							<UTooltip text="Click to remove from filters"
										v-for="tag in costumesStore.filters.tags" :key="tag">
								<code class="tag" @click="costumesStore.removeFilterTag(tag)">{{ tag }}</code>
							</UTooltip>
						</div>
					</td>
					<td class="td-costume-list-status"
						v-if="costumesStore.settings.showStatus">
						<UInput type="text" placeholder="Filter by status" v-model="costumesStore.filters.status"/>
					</td>
					<td class="td-costume-list-owner"
						v-if="costumesStore.settings.showOwner">
						<UInput type="text" placeholder="Filter by owner" v-model="costumesStore.filters.owner"/>
					</td>
					<td class="td-costume-list-storage-address"
						v-if="costumesStore.settings.showStorageAddress">
						<UInput type="text" placeholder="Filter by storage address" v-model="costumesStore.filters.storage_address"/>
					</td>
					<td class="td-costume-list-storage-location"
						v-if="costumesStore.settings.showStorageLocation">
						<UInput type="text" placeholder="Filter by storage location" v-model="costumesStore.filters.storage_location"/>
					</td>
					<td class="td-costume-list-actions"
						v-if="hasPermissionOneOf(['P_VIEW_ITEMS_COSTUMES_DETAILS', 'P_EDIT_ITEMS_COSTUMES'])"></td>
				</tr>

				<tr v-for="costume in costumesStore.getFilteredCostumes"
					:key="costume.id"
					v-auto-animate>
					<CostumeListItem :costumeId="costume.id" :costume="costume" :view-settings="costumesStore.settings"/>
				</tr>
			</table>-->
</template>

<style scoped lang="scss">
$list-item-height: 3 * 1.45em;

.costume-list-container {
	.td-image-container {
		height: $list-item-height;
		overflow: hidden;
	}

	.td-item-container {
		max-height: $list-item-height;
		transition: max-height 0.5s ease-in-out;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.1rem 0.25rem;
		overflow: hidden;
		text-wrap: balance;
		word-wrap: anywhere;

		&:hover {
			max-height: 2 * $list-item-height;
		// TODO not optimal
		}
	}

	.td-text-container {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		white-space: normal;
		text-wrap: balance;
		word-wrap: anywhere;
	}

	.td-text-container-max {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: none;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		white-space: normal;
		text-wrap: balance;
		word-wrap: anywhere;
	}

	.td-sticky-container {
		display: flex;
		position: sticky;
		right: 0;
	}

	.square {
		width: $list-item-height;
	}

	.small {
		min-width: 15ch;
		max-width: 20ch;
	}

	.medium {
		min-width: 20ch;
		max-width: 30ch;
	}

	.large {
		min-width: 30ch;
		max-width: 45ch;
	}

	.selectable-tag {
		padding: 0.25em 0.5em;
		color: rgba(255, 255, 255, 0.8);
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: opacity 0.2s;
		font-size: 0.75rem;
		text-transform: capitalize;
		text-align: center;
		line-height: 1em;
		white-space: normal;

		&:hover {
			opacity: 0.8;
		}
	}

	.disabled-element {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/*@media (max-width: 600px) {
		.thead, .th, .td, .checkbox, .loadingState, .emptyState {
			@apply px-2 py-2
			@apply text-xs;
		}

		.loadingState, .emptyState {
			.wrapper {
				@apply px-4 py-10;
			}

			.label {
				@apply text-xs;
			}

			.icon {
				@apply h-5;
				@apply 3;
			}
		}

		.sortButton {
			.icon {
				@apply -m-1;
			}
		}
	}*/
}


</style>