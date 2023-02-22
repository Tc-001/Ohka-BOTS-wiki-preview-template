<script>
    import Card from "component:Card.svelte";
import ItemCard from "component:helpers/IconStuff/ItemCard.svelte";

    let id = 0;
    let desc= "";
</script>

<div style="background-color: black; padding: 3rem; display: block; margin: auto; width: max-content;">
    {#key [id, desc]}
        <ItemCard bind:id={id} bind:desc={desc}></ItemCard>
    {/key}
    
    <br>
    
    <label for="">id=</label>
    <input type="number" bind:value={id}>
    
    <br>
    
    <label for="">desc=</label>
    <input type="text" bind:value={desc}>
</div>
