<script>
  export let name;
  export let alt;

  if(!globalThis.svgCache) globalThis.svgCache = new Map()

  async function loadSvg() {

    // Cache the svg to not clog up console
    if(!globalThis.svgCache.has(name)) {
      let svg = fetch(`https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9/icons/${encodeURIComponent(name)}.svg`)
        .then(x => x.text())
        .then(x => x.split("\n").slice(1,-1).join("\n"))
      globalThis.svgCache.set(name, svg)
    }

    return await globalThis.svgCache.get(name)
  }
</script>

<svg viewBox="0 0 16 16" astro-icon="bi:{name}">
  {#await loadSvg() then svg}
    <g>{@html svg}</g>
  {/await}
</svg>
