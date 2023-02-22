<script>
import Spinner from "component:Spinner.svelte"
import ItemCard from "component:helpers/IconStuff/ItemCard.svelte";

import Fuse from 'fuse.js'
import {itemparts} from "script:itemDefinitions"
import get from "script:get";


let search = ""
let max = 10
let bot = 0


let data = get.drops.all.get()
	.then(json => {
		let items = json.filter(x => !["3019908","3019909","3019910","3019911","3019912","3019913"].includes(x.id))
			.map(x => x.id=="3019907"?{...x, chancecalc:x.chancecalc*7}:x)
			.sort((a, b) => a.name.localeCompare(b.name))
			.sort((a,b) => a.bot - b.bot)
			.sort((a,b) => a.part - b.part)
			.map(x => ({...x, strpart: itemparts[x.part]}))
		//console.log(items)
		return items
	}).then(i => {
		const options = {
			threshold: 0.3,
			keys: ['strpart', 'name', 'description', 'script']
		}
		return new Fuse(i, options)
	})

async function load( isearch, imax, ibot ) {
	//console.log(isearch, imax, ibot);
	let idata = await data 
	return idata
		.search(isearch)
		.filter(x=>(x.item.bot==ibot||ibot==0))
		.slice(0,imax)
		.map(x=>x.item)
}

</script>

<div>

	<div class="select">
			<select id="mapdrd" bind:value="{bot}">
			{#each ['Any bot', 'Patch', 'Surge', 'Ram'] as bot, i}
				<option value="{i}">{bot}</option>
			{/each}
		</select>
		<input type="text" placeholder="Search" bind:value="{search}">
	</div>

	{#await load(search, max, bot)}
		<Spinner />
	{:then data} 
		{#if search == ''}
			<div class="hint">Enter a name to search!</div>
		{/if}
		<div class="data">
			{#each data as entry}
				<ItemCard data={entry}>
					<div slot="pre">
						{#if entry.maps}
							<b>Maps:</b> {entry.maps}
							<br/>
						{/if}
						<b>Bot type:</b> {['Any', 'Patch', 'Surge', 'Ram'][entry.bot]}
						{#if localStorage.getItem("ob_mp_itemid") == 1}
							<br />
							<b>id:</b> {entry.id}
						{/if}
					</div>
				</ItemCard>
			{/each}
		</div>
		{#if data.length == max}
			<button on:click={()=>max+=20}>Load more</button>
		{/if}
	{/await}

</div>

<style lang="sass">
	@import "../../../styles/stylings.sass"
	div.select
		width: 90%
		margin: auto
		background-color: $bg_col
		text-align: center
		padding: 0.5rem
		margin-bottom: 0.5rem
		border-radius: 0.5rem
		@include drop_shadow()
	div.hint
		text-align: center
		background-color: $main_col
		width: 50%
		margin: auto
		padding: 0.5rem
		border-radius: 0.5rem
	div.data
		display: grid
		grid-template-columns: repeat(auto-fit, minmax(min(50vw, 30rem), 1fr))
		grid-auto-rows: minmax(10rem, auto)
		gap: 0.5rem
		&>:global(div)
			width: auto!important
	button
		display: block
		margin: auto
		min-width: 50%
</style>