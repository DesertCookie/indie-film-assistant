import { Address } from "@/composables/Address"

export interface ICostumeItem {
	id: number
	inventory_no?: string
	title: string
	description?: string
	date_acquired?: Date
	types?: string[]
	size?: string
	colors?: string[]
	tags?: string[]
	status?: string
	owner?: string
	storage_address?: Address
	storage_location?: string
	images: string[]
	deactivated?: boolean
	reserved?: boolean
	date_created: Date
}

// Make all properties of ICostumeItem optional except 'id'.
export type ICostumeItemDto = Partial<Omit<ICostumeItem, 'id'>> & {
	id: number
}
