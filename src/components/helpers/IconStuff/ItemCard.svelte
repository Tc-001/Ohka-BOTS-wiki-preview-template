<script>
	import get from "script:get";

	import Icon from "./ImgIcon.svelte";
	import ItemDesc from "./ItemDesc.svelte";
	import { bots, verboseItemParts } from "script:itemDefinitions.js";
	import getItem from "script:item";

	export let data;
	export let id;
	export let desc = "";

	if (!data && id) {
		data = getItem(id).catch(() => ({
			name: "ERR",
			id: id,
			script: "",
			description: "ERR",
			part: "0",
			bot: "0",
			legendary: "0",
		}));
	}
</script>

<div class="wrap">
	{#await data}
		<div class="title" />
		<div class="desc" />
	{:then dat}
		{#if dat}
			<div class="title">
				<div class="icon">
					<Icon data={dat} tooltip={false} />
				</div>
				<div>
					<span class="title">{dat.name}</span>
					<span class="short">BOT type: {bots[dat.bot]}</span>
					<span class="short"
						>Item type: {verboseItemParts.find((x) =>
							x[1].includes(parseInt(dat.part))
						)[0]}</span
					>
					<span class="short">Req. Level: {dat.reqlevel}</span>
				</div>
			</div>
			{#if $$slots.pre}
				<slot name="pre" />
				<hr />
			{/if}
			<div class="desc">
				{#if desc != ""}
					{desc}
					<hr />
				{/if}
				<ItemDesc item={dat} />
			</div>
		{/if}
	{/await}
</div>

<style lang="sass">
	@import "../../../styles/stylings.sass"	
	.wrap
		display: inline-block
		min-width: min(20rem, 80vw)
		max-width: 80vw
		width: min-content
		min-height: 10rem
		height: max-content
		background-color: $main_col
		text-align: left
		overflow: hidden
		border-radius: 0.5rem
		padding: 0.5rem
		padding-bottom: 0rem
		margin: 0.5rem
		@include drop_shadow()
		div
			display: inline-block
		div.title
			width: 100%
			height: min-content
			font-size: 1.5rem
			white-space: nowrap
			span
				display: block
			span.title
				font-family: "Oxanium"
			span.short
				font-family: "Fira Mono"
				font-size: 1rem

			div.icon
				width: 3.5rem
				height: 3.5rem
				vertical-align: top

		div.desc
			background-color: $bg_col
			margin: -0.5rem
			margin-top: 0.5rem
			padding: 0.5rem
			padding-bottom: 1rem
			min-height: 7rem
			width: calc(100% + 0.5rem)

		:global(img)
			float: left
			background-color: $hl_col
			padding: 0.1rem
			margin-right: 0.5rem
			border-radius: 0.3rem
	hr
		border-color: $hl_col
		margin-left: -0.5rem
</style>
