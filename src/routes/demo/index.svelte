<script lang="ts">
  import { onMount } from "svelte"
  import { Diesel } from "$lib/scripts/diesel"
  import Deepdwn from "$lib/components/Deepdwn.svelte"

  let gameContainer: any
  let diesel: Diesel

  onMount(() => {
    const PressStart2P = new FontFace(
      "PressStart2P",
      "url(assets/fonts/PressStart2P-Regular.ttf)"
    );
    PressStart2P.load().then(function (font) {
      // with canvas, if this is ommited won't work
      document.fonts.add(font)
      diesel = new Diesel(gameContainer)
      // start game
      diesel.init()
    })
  })
</script>

<div bind:this={gameContainer} />
<Deepdwn />


