import { client } from "script:fetchClient"
import get from "./get"

let itemCache: Map<number,Promise<any>> = new Map()

export default function getItem(itemId: number): Promise<ReturnType<typeof get.item.stats.get>> {
	
	// Big brain way to not have duplicate item requests
	// Cache the item as a promise and then return the promise
	// Not even waiting for it to resolve

	if(!itemCache.has(itemId)) {
		itemCache.set( 
			itemId, 
			client.get("/item/:itemid/stats.json", c=>c.param("itemid", itemId.toString()))
			.json()
		)
	}

	return itemCache.get(itemId)
}