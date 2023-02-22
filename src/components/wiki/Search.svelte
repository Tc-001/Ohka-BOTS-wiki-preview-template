<script lang="ts">
	import fuse from "fuse.js"
	import compress from "lz-string";
	import format from "format-fuse.js";
  import Icon from "component:helpers/Icon.svelte";

	import {fly} from "svelte/transition"
 
	let query = ""
	let popup = false

	let searchField: HTMLInputElement

	interface searchObject {
		props: {
			title: string
			justText: string
		},
		params: {
			page: string
		}
	}

	interface IFormattedResult {
		text: string;
		matches: boolean;
	}

	interface formattedSearchObject {
		props: {
			title: IFormattedResult[]|string
			justText: IFormattedResult[]|string
		},
		params: {
			page: IFormattedResult[]|string
		}
	}

	const fuseOptions = {
		keys: ["props.justText", "props.title"],
		minMatchCharLength: 3,
		includeMatches: true,
		threshold: 0.3,
		distance: 500
	}

	async function loadSearchIndex() {
		try {

			let compressedData = sessionStorage.getItem("ob_searchIndex")
			if(!compressedData) {
				compressedData = await fetch("/Wiki/searchIndex.js").then(x => x.text())
				sessionStorage.setItem("ob_searchIndex", compressedData)
			}

			const stringData = compress.decompressFromUTF16(compressedData)
			const jsonData = JSON.parse(stringData)
			const searchIndex = fuse.parseIndex(jsonData[1])
			const Fuse:fuse<searchObject> = new fuse(jsonData[0], fuseOptions, searchIndex) as fuse<searchObject>
			
			//focus the field for easier search start
			setTimeout(() => searchField.focus(), 100)

			return Fuse
			
		} catch (error) {
			// In case something got corrupted to not re-parse the bad index
			sessionStorage.removeItem("ob_searchIndex")
			console.error(error)
			throw error
		}

	}

	function formatHighlight(result:formattedSearchObject) {
		// Find first occurrance
		// Add words & hl not more than 1 word or 10 chars before
		// Add words & hl not more than 50 chars after (display 2 lines, browser can turnicate)

		let hlResult = {title: [{text:"", matches:false}], body: [{text:"", matches:false}], page: result.params.page}

		// First the title
		// This makes the formatting consistant
		const title = result.props.title
		hlResult.title[0].text = title.toString()
		if(!(typeof title == "string")) hlResult.title = title
		// No need to do anything, as we would always want the full title


		const body = result.props.justText
		hlResult.body[0].text = body.toString()
		if(!(typeof body == "string")) hlResult.body = body

		if(hlResult.body.length > 1){
			let prevResult = hlResult.body
			let newResult:IFormattedResult[] = []
			if (prevResult[0].matches) {
				newResult.push(prevResult.shift())
			} else {
				// We have "texttext" [text] "texttext"
				// We need to trim the first one so it does the thing

				// Add ... at the start to show it not being the first
				newResult.push({text: "...", matches:false})
				
				function trimBefore(match: IFormattedResult):IFormattedResult {
					if (match.text.length < 10 || !match.text.trim().includes(" ")) {
						return match
					}
					match.text = match.text.split(" ").slice(1).join(" ")

					return trimBefore(match)
				}
				newResult.push(trimBefore(prevResult.shift()))
			}
			// Now we want to push x chars of content while keeping the highlight
			let charQuota = 100
			while (charQuota > 0) {
				let prev = prevResult.shift()
				if(!prev) {
					charQuota = Math.min(charQuota, 0)
					break
				}
				newResult.push(prev)
				charQuota -= prev.text.length
			}
			// To prevent walls of text if the last non-match was long, we now will remove extra chars from the final message
			if (charQuota < 0) {
				let text = "" + newResult.at(-1).text
				newResult[newResult.length-1].text = text.substring(0, text.length+charQuota)
				newResult[newResult.length-1].text += "..."
			}

			hlResult.body = newResult
		}

		return hlResult
		
	}

	function FuseSearch(Fuse:fuse<searchObject>, searchQuery:string):formattedSearchObject[] {
		const rawSearch = Fuse.search(searchQuery).slice(0,5)
		const formattedSearch = format(rawSearch) as formattedSearchObject[]		
		return formattedSearch
	}
</script>

<div>
	<button class="searchInitBtn" on:click={() => popup=true}>
		<Icon name="search"/>
		<div>
			Search
		</div>
	</button>

	{#if popup}
		<div class="bg" on:click={() => popup=false}/>
		<div class="searchBox" transition:fly={{y: -100, duration: 150}}>

			<input type="text" class="searchField" placeholder="Enter your search here" bind:value={query} bind:this={searchField}>

			<div class="results">
				{#await loadSearchIndex()}
					<div class="loading">
						Loading...
					</div>
				{:then Fuse} 

					<ul>
						{#each FuseSearch(Fuse, query).map(x => formatHighlight(x)) as searchResult}
							<li>
								<a href={"/Wiki/"+searchResult.page+"/"}>
									<div class="title">
										{#each searchResult.title as titleHl}
											{#if titleHl.matches}
												<mark>{titleHl.text}</mark>
											{:else}
												{titleHl.text}
											{/if}
										{/each}
									</div>
									{#if searchResult.body}
										<div class="preview">
											{#each searchResult.body as bodyHl}
												{#if bodyHl.matches}
													<mark>{bodyHl.text}</mark>
												{:else}
													{bodyHl.text}
												{/if}
											{/each}
										</div>
									{/if}
								</a>
							</li>
						{/each}
					</ul>

				{:catch err}
					<div class="loading">Error getting your searches!</div>
					<div class="loading">Please refresh the page and try again!</div>
				{/await}
			</div>

		</div>
	{/if}
</div>

<style lang="sass">
	@import "../../styles/stylings.sass"
	.searchInitBtn
		width: 100%
		padding: 0.2rem
		text-align: center
		font-size: large
		font-family: "Oxanium"
		font-weight: bold
		display: grid
		grid-template-columns: min-content 1fr
		grid-template-rows: 1fr
		align-items: center
		justify-items: center
		border-radius: 0.5rem
		background: $main_col
		&:hover
			background: $accent_col

	div.bg
		position: fixed
		top: 0
		left: 0
		z-index: 1000
		width: 100vw
		height: 100vh
		background: $mono_col
		opacity: 0.7

	div.searchBox
		position: fixed
		top: 50%
		left: 50%
		z-index: 1001
		transform: translateX(-50%) translateY(-50%)
		height: min(30rem, 90vh)
		width: min(100vw, 30rem)
		background-color: $main_col
		border-radius: 0.5rem
		overflow-y: scroll
		@include drop_shadow()
		.searchField
			position: sticky
			top:0
			width: calc(100% - 1rem)
			font-size: large
			font-family: "Oxanium"
			font-weight: bold
			background: $hl_col
			margin: 0!important
			padding: 0.5rem
			@include bottom_shadow()

	div.loading
		margin: 0.3rem
		padding: 0.3rem
		border-radius: 0.3rem
		background: $hl_col
		text-align: center
		font-size: large
		font-family: "Oxanium"
		font-weight: bold

	div.results
		ul
			list-style: none
			padding-left: 0.3rem
			padding-right: 0.3rem
		li
			margin: 0.3rem
			padding: 0.3rem
			border-radius: 0.3rem
			background: $hl_col
			a
				text-decoration: none
			div.title
				font-family: "Oxanium"
				font-weight: bold
			mark
				background: $bg_col
				border-radius: 1rem



</style>