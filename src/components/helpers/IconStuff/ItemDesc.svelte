<script>
	export let item
	export let inlineDeets = false
	export let inlineDesc = true
	import { parseScript } from "./itemParser.ts"
	import { bots, verboseItemParts } from "script:itemDefinitions.js"
</script>

<div class="desc">
	{#if inlineDesc}
		{item.description.replace(/^\(.+\)/, "")}
	{/if}
	{#if inlineDeets}
		<hr>
		<div class="script">
			BOT type: {bots[item.bot]} <br>
			Item type: {verboseItemParts.find(x => x[1].includes(parseInt(item.part)))[0]} <br>
			Req. Level: {item.reqlevel} <br>
		</div>
	{/if}
	{#if true}
		{@const parsed = parseScript(item.script)}
		{#if parsed.length}
			<hr>
			<div class="script">
				{#each parsed as line}
					{line[0]}
					{#if (typeof line[1]) == "string"}
						+{line[1]}
					{:else}
						+{line[1][0]} ~ +{line[1][1]}
					{/if}
					<br>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style lang="sass">
	@import "../../../styles/stylings.sass"	

	div.script
		opacity: 0.9
		font-family: "Fira Mono"
		padding-left: 0.3rem
	blockquote
		margin: 0.5rem
		border-color: $main_col
		background-color: $hl_col
	hr
		border-color: $hl_col
		margin-left: -0.5rem
	span.short
		display: block
</style>