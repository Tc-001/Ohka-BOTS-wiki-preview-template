import { asyncable, Asyncable } from "svelte-asyncable";
import * as r from "./rawRequest"

//@ts-ignore
const dev = import.meta.env.DEV

type apiResponse = Record<string, string>

interface privateUser {
	name: string
	balance: {
		coins: number,
		gigas: number
	}
	linked: boolean,
	error?: boolean,
}

let userCache: privateUser;

export const privateUser: Asyncable<privateUser | {error: true}> = asyncable(async () => {

	if(userCache) return userCache

	const data: apiResponse = await r.readAuth("user/me.php?a=m")
		.then(x => x[0])
		.catch(x=>({error: true}))

	if (data?.error || data?.global == "false") {
		if (globalThis.location?.host == "localhost:3000") {
			return {
				name: "TEST",
				balance: {
					coins: 999,
					gigas: 999,
				},
				linked: true,
				error: false
			}
		}
		return {error: true}
	}

	// set up the values
	userCache = ({
		name: data?.name,
		balance: {
			coins: parseInt(data?.coins),
			gigas: parseInt(data?.gigas),
		},
		linked: data?.discord == "1",
		error: data?.error as unknown as boolean
	})

	return userCache
})