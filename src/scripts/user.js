
// Loads the forum user name 
// Used for stuff

globalThis.ob_cached_user = null

export async function load() {

	if (window.ob_cached_user === null) {

		let user = {}

		// Do not fetch if dev
		if (location.hostname == "localhost") {
			user = {name: "Tc001"}
			//user = {error: "yes"}
		} else {
			// Fetch
			user = await fetch("https://ohkaspace.com/ohkabots/api/user/behindAuth.php?a=n", {credentials: "include"})
				.then(x=>x.json())
				.catch(() => ({error: true}))
			// Request login if empty
			if (user?.error) {
				return "login"
			}
		}

		// Local cache so no double requests
		window.ob_cached_user = user	

		// Session cache for faster display
		Cookies.set("username_cache", user.name??"")
	}

	return window.ob_cached_user
}

export function login() {
	let ob_window = window.open(
		"https://ohkaspace.com/ucp.php?mode=login&redirect=ohkabots/api/AuthOK.html&restricted=1", 
		"_blank", 
		"toolbar=0,scrollbars=0,resizable=0,width=500,height=600,left=100,top=100"
	)
	setInterval(() => {
		if (ob_window.closed) {
			window.location.href = "/Account/"
		}
	}, 500);
}