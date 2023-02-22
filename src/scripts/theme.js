window.theme = {
	dark: (localStorage.getItem('dark') ?? window.matchMedia("(prefers-color-scheme: dark)").matches) == 1,
	set(target_dark = this.dark) {

		// Set state
		this.dark = target_dark ?? this.dark

		// Sync state
		document.body.setAttribute("data", (this.dark ? 'dark' : 'light'))
		localStorage.setItem('dark', this.dark?"1":"0")

		// return so chainable
		return this
		
	},
	toggle() {
		this.set(!this.dark)
	}
}.set()