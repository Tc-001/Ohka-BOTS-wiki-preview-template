import q from "./query"

export async function read(query, offset = 0, generic = "") {
	return await fetch("https://ohkaspace.com/ohkabots/api/read.php" + q.build({
		q: query,
		o: offset,
		g: generic
	}))
		.then(x => x.json())
}

export async function readAuth(endpoint, redirect = false) {
	return await fetch("https://ohkaspace.com/ohkabots/api/" + endpoint, { credentials: "include" })
		.then(x => x.json())
}