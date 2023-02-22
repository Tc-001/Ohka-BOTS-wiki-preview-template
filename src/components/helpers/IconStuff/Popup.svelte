<script lang="ts">
	import { onMount, afterUpdate } from "svelte";
	import tippy, {type Instance} from "tippy.js";

	export let runPopup = true

	let container: HTMLDivElement, content: HTMLDivElement, shadowContent: HTMLDivElement

	let tippyInstance: Instance;

	onMount(() => {
		// Use a seperate content element for tippy
		// Svelte can sometimes "take back" the original after tippy has moved it
		shadowContent = document.createElement("div")

		if(!runPopup) return
		tippyInstance = tippy(container, {
			content: shadowContent,
			appendTo: document.body,
			animation: "shift-toward-subtle",
			theme: "ohka",
			arrow: false,
			placement: "left-start",
			duration: 100,
			interactive: true,
			zIndex: 99999,
			offset: ({ placement, reference, popper }) => {
				if (placement == "top") return [0,0]
				return [(placement.endsWith("start")?1:-1)*reference.height/2, 0]
			},
			popperOptions: {
				modifiers: [
					{
						name: 'flip',
						options: {
							fallbackPlacements: ['left-end', 'right-start', 'right-end', 'top'],
						},
					},
				]
			},
			onShow(){
				shadowContent.innerHTML = content.innerHTML
			}
		})
	})
</script>

<div class="container" bind:this={container}>
	<slot />
</div>

<div class="content" bind:this={content}>
	<slot name="popup" />
</div>

<style lang="sass">
	@import "tippy.js/animations/shift-toward-subtle.css"

	.container
		width: 100%
		height: 100%

	.content
		font-size: medium
		text-align: left
		white-space: initial
		display: none
</style>