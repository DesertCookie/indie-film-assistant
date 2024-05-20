import {Address} from "~/composables/Address"
import type {ICostumeItem, ICostumeItemDto} from "~/composables/ICostumeItem"

class CostumeStoreSettings {
	viewMode: 'list' | 'grid'
	showInvNo: boolean
	showDescription: boolean
	showDateAcquired: boolean
	showType: boolean
	showSize: boolean
	showColor: boolean
	showTags: boolean
	showStatus: boolean
	showOwner: boolean
	showStorageAddress: boolean
	showStorageLocation: boolean
	
	constructor() { // sets the defaults for the columns selected and thus visible
		this.viewMode = 'list'
		this.showInvNo = false
		this.showDescription = true
		this.showDateAcquired = false
		this.showType = true
		this.showSize = false
		this.showColor = false
		this.showTags = true
		this.showStatus = false
		this.showOwner = false
		this.showStorageAddress = false
		this.showStorageLocation = false
	}
}

class CostumeStoreFilters {
	title: string
	inventory_no: string
	description: string
	date_acquired: Date | undefined
	types: string[]
	size: string
	colors: string[]
	tags: string[]
	status: string
	owner: string
	storage_address: Address | undefined
	storage_location: string
	
	constructor() { // sets the default filters: empty
		this.title = ''
		this.inventory_no = ''
		this.description = ''
		this.date_acquired = undefined
		this.types = []
		this.size = ''
		this.colors = []
		this.tags = []
		this.status = ''
		this.owner = ''
		this.storage_address = undefined
		this.storage_location = ''
	}
}

export const useCostumesStore = defineStore('costumes', {
	state: () => ({
		lastFetchDate: new Date(),
		loading: false,
		settings: new CostumeStoreSettings(),
		filters: new CostumeStoreFilters(),
		costumes: [
			{
				id: 0,
				title: 'Costume 0 with a longer title than actually fits into this field',
				description: 'Description 0 with quite a bit of details on the item.\nThere\'s a lot of stuff to know about this item.\n - The item is in very good condition.\n - There\'s also some other info.\n - Some other stuff that seems important. It is quite a lot of info, tbh.',
				status: 'in-use',
				owner: 'Ruben',
				inventory_no: 'Km12345',
				colors: ['red', 'green', 'yellow', 'blue', 'purple', 'beige', 'black'],
				tags: ['costume'],
				storage_address: new Address({
					street: 'Musterstraße',
					street_no: '1',
					zip_code: '12345',
					city: 'Musterstadt',
					country: 'Musterland'
				}),
				images: ['/images/ruben.webp', '/images/landon.webp', '/images/gruppe.webp', '/images/gruppenfoto.webp'],
				date_created: new Date('2022-01-01'),
				deactivated: false
			},
			{
				id: 1,
				title: 'Costume 1',
				description: 'Description 1',
				colors: ['green', 'blue', 'what about a long tag that does not fit'],
				status: 'available',
				owner: 'Ruben',
				inventory_no: 'Us2345',
				storage_address: new Address({
					city: 'Dresden'
				}),
				date_acquired: new Date('2022-01-01'),
				images: ['/images/landon.webp'],
				date_created: new Date('2023-05-15')
			},
			{
				id: 2,
				title: 'Costume 2',
				colors: ['yellow', 'green'],
				tags: ['hose', 'mütze'],
				images: ['/images/gruppe.webp'],
				reserved: true,
				date_created: new Date('2024-02-02')
			},
			{
				id: 3,
				title: 'Costume 3 is deactived',
				colors: ['purple', 'andaverylongtagthatdoesnotfit'],
				tags: ['hose', 'gürtel'],
				types: ['test1', 'test2'],
				images: ['/images/gruppenfoto.webp'],
				deactivated: true,
				date_created: new Date('2023-11-23')
			}
		] as ICostumeItem[],
		selectedCostumes: [] as ICostumeItem[]
	}),
	getters: {
		getCostumeById: (state) => (id: number): ICostumeItem | undefined => {
			return state.costumes.find((costume: ICostumeItem) => costume.id === id);
		},
		getFilteredCostumes: (state) => {
			return state.costumes.filter((costume) => {
				// Helper function to parse the search string into terms and phrases
				function parseSearchTerms(input: string): string[] {
					const terms: string[] = [];
					const regex = /"([^"]+)"|(\S+)/g;
					let match;
					while ((match = regex.exec(input.toLowerCase()))) {
						terms.push(match[1] ? match[1] : match[2]);
					}
					return terms;
				}
				
				// Check if all terms in the query are found in the target string
				function matchSearchTerms(terms: string[], target: string | undefined): boolean {
					if (!target) return false;
					const targetLower = target.toLowerCase();
					return terms.some(term => targetLower.includes(term));
				}
				
				
				const titleTerms = parseSearchTerms(state.filters.title);
				const invNoTerms = parseSearchTerms(state.filters.inventory_no);
				const descriptionTerms = parseSearchTerms(state.filters.description);
				
				const titleMatch = state.filters.title ? matchSearchTerms(titleTerms, costume.title) : true;
				const inventoryNoMatch = state.filters.inventory_no ? matchSearchTerms(invNoTerms, costume.inventory_no) : true;
				const descriptionMatch = state.filters.description ? matchSearchTerms(descriptionTerms, costume.description) : true;
				
				const acquisitionDateMatch = state.filters.date_acquired ? costume.date_acquired?.getTime() === new Date(state.filters.date_acquired).getTime() : true;
				const typeMatch = state.filters.types.length > 0 ? state.filters.types.some(type => costume.types?.includes(type)) : true;
				const sizeMatch = state.filters.size ? costume.size === state.filters.size : true;
				const colorsMatch = state.filters.colors.length > 0 ? state.filters.colors.every(color => costume.colors?.includes(color)) : true;
				const tagsMatch = state.filters.tags.length > 0 ? state.filters.tags.every(tag => costume.tags?.includes(tag)) : true;
				const statusMatch = state.filters.status ? costume.status === state.filters.status : true;
				const ownerMatch = state.filters.owner ? costume.owner?.toLowerCase().includes(state.filters.owner.toLowerCase()) : true;
				const storageAddressMatch = state.filters.storage_address ? matchSearchTerms(parseSearchTerms(state.filters.storage_address.toStringZipCity()), costume.storage_address?.toStringZipCity()) : true;
				const storageLocationMatch = state.filters.storage_location ? matchSearchTerms(parseSearchTerms(state.filters.storage_location), costume.storage_location) : true;
				
				return titleMatch && inventoryNoMatch && descriptionMatch && acquisitionDateMatch && typeMatch && sizeMatch && colorsMatch && tagsMatch && statusMatch && ownerMatch && storageAddressMatch && storageLocationMatch;
			});
		},
		getNewestCostumesDateCreated: (state) => (count: number) => {
			// Filter out costumes that don't have `date_created` defined.
			const costumesWithDate = state.costumes.filter(costume => costume.date_created)
			// Sort the costumes by `date_acquired` in descending order.
			const sortedCostumes = costumesWithDate.sort((a, b) => {
				// @ts-ignore
				return b.date_created.getTime() - a.date_created.getTime();
			})
			// Return only the number of costumes specified by `count`.
			return sortedCostumes.slice(0, count)
		},
		getNewestCostumesDateAcquired: (state) => (count: number) => {
			// Filter out costumes that don't have `date_acquired` defined.
			const costumesWithDate = state.costumes.filter(costume => costume.date_acquired)
			// Sort the costumes by `date_acquired` in descending order.
			const sortedCostumes = costumesWithDate.sort((a, b) => {
				// @ts-ignore
				return b.date_acquired.getTime() - a.date_acquired.getTime();
			})
			// Return only the number of costumes specified by `count`.
			return sortedCostumes.slice(0, count)
		},
		
		
	},
	actions: {
// CREATE
		createCostume(costume: ICostumeItem) {
		
		},
// UPDATE
		updateCostume(updatedCostume: ICostumeItemDto) {
			const index = this.costumes.findIndex(costume => costume.id === updatedCostume.id);
			
			if (index !== -1) {
				this.costumes[index] = Object.assign(this.costumes[index], updatedCostume);
				
				// TODO API
			} else {
				console.error(`Costume with ID ${updatedCostume.id} not found`);
			}
		},
// DELETE
		deleteCostumes(ids: number[]) {
			this.costumes = this.costumes.filter(costume => !ids.includes(costume.id));
			//this.selectedCostumeIds = this.selectedCostumeIds.filter(id => !ids.includes(id));
			
			// TODO API
		},
// SET VIEW: LIST / GRID
		setListView() {
			this.settings.viewMode = 'list'
		},
		setGridView() {
			this.settings.viewMode = 'grid'
		},
// UPDATE SETTINGS
		updateSettings(settings: CostumeStoreSettings) {
			this.settings = settings
		},
// FILTERS
		resetFilters() {
			this.filters = new CostumeStoreFilters()
		},
		addFilterColor(color: string) {
			if (!this.filters.colors.includes(color)) {
				this.filters.colors.push(color);
			}
		},
		removeFilterColor(color: string) {
			this.filters.colors = this.filters.colors.filter(c => c !== color);
		},
		addFilterType(type: string) {
			if (!this.filters.types.includes(type)) {
				this.filters.types.push(type);
			}
		},
		removeFilterType(type: string) {
			this.filters.types = this.filters.types.filter(t => t !== type);
		},
		addFilterTag(tag: string) {
			if (!this.filters.tags.includes(tag)) {
				this.filters.tags.push(tag);
			}
		},
		removeFilterTag(tag: string) {
			this.filters.tags = this.filters.tags.filter(t => t !== tag);
		},
		
		
	},
	// persist: true disabled during development
})