export class Address {
	id?: number
	street?: string
	street_no?: string
	zip_code?: string
	city?: string
	province?: string
	country?: string
	
	constructor({id, street, street_no, zip_code, city, province, country}: Partial<Address>) {
		this.id = id;
		this.street = street;
		this.street_no = street_no;
		this.zip_code = zip_code;
		this.city = city;
		this.province = province;
		this.country = country;
	}
	
	toString(): string {
		return `${this.street} ${this.street_no} ${this.zip_code} ${this.city} ${this.province} ${this.country}`.replace('  ', ' ').trim()
	}
	
	toStringZipCity(): string {
		let parts = [];
		
		if (this.zip_code) parts.push(this.zip_code);
		if (this.city) parts.push(this.city);
		
		return parts.join(", ");
	}
	
}
