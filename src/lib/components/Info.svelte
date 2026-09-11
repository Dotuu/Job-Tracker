<script>
  import { brand } from "$lib";
  import HomeButton from "./HomeButton.svelte";
</script>

<div class="info">
  <h1>{brand}</h1>
  <HomeButton text="About us"/>
</div>

<style>
  .info{
    width: 50%;
  }
</style>