<script>
  import { brand } from "$lib";
  import Info from "./info.svelte";
  import Graphic from "./graphic.svelte";
</script>

<div class="body">
  <Info />
  <Graphic />
</div>

<style>
  .body{
    display:flex;
    flex-direction: row;
  }
</style>