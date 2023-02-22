<script>
	import { onMount } from "svelte";
	import ItemDesc from "./ItemDesc.svelte";

	import Popup from "component:helpers/IconStuff/Popup.svelte";
    import getItem from "script:item";

	export let data = undefined;
	export let id = "";
	export let tooltip = true;
	let xmog_flash = false;
	let xmog = null;

	export let reverseTooltop = false;

	let nonce = Math.floor(Math.random() * 100000000);

	if (!data && id) {
		data = getItem(id);
	}

	async function load() {
		let idata = await data;
		if (idata.name.endsWith("(XMOG)")) {
			xmog = true;
		}
		return idata;
	}

	onMount(async () => {
		id = (await data).id;

		setTimeout(() => {
			let interval = setInterval(() => {
				xmog_flash = Date.now() % 3000 < 1500;
				if (xmog === false) clearInterval(interval);
			}, 1500);
		}, 1500 - (Date.now() % 1500));
	});
</script>

<div class="iconWrap">
	<Popup runPopup={tooltip}>
		<div slot="popup">
			{#if tooltip}
				{#await load() then d}
					<div class="tooltip {reverseTooltop ? 'rev' : ''}">
						<span class="name">{d.name}</span>
						<ItemDesc item={d} inlineDeets={true} />
					</div>
				{/await}
			{/if}
		</div>

		<img
			src={`https://ohkaspace.com/ohkabots/api/icons/icon.php/${id || data.id}.png`}
			alt="Icon"
			loading="lazy"
			width="500"
			height="500"
			style="width:100%;"
			class="noround {xmog && xmog_flash ? 'xmog' : ''}"
		/>
	</Popup>
</div>

<style lang="sass">
	@import "../../../styles/stylings.sass"	
	.tooltip_wrap
		font-size: medium
		white-space: normal
		width: 100%
		height: auto
		display: inline-block
		position: relative
		:global(a)
			margin: 0
			padding: 0
		&:hover, &:focus
			.tooltip
				opacity: 1
				pointer-events: all
				transform: translateX(0%)
		&:first-child
			.tooltip
				right: 100%

	.iconWrap
		img
			width: 100%
			height: auto 
			display: inline-block
			margin: 0
			padding: 0
			color: transparent
			&.xmog
				filter: saturate(0) brightness(2) sepia(1) hue-rotate(180deg)

	span
		display: block
		&.name
			font-weight: bold
			font-family: "Oxanium"
			padding-bottom: 0.5rem
		&.stats
			opacity: 70%
			font-family: "Fira Mono"

</style>
