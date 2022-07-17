<script lang="ts">
  import { onMount } from "svelte"
  import Deepdwn from "$lib/components/Deepdwn.svelte"
  import { Game } from "$lib/scripts/diesel"

  let gameContainer: any
  onMount(() => {
    const PressStart2P = new FontFace(
      "PressStart2P",
      "url(assets/fonts/PressStart2P-Regular.ttf)"
    );
    PressStart2P.load().then(function (font) {
      // with canvas, if this is ommited won't work
      document.fonts.add(font)
      $Game.init(gameContainer);

    })
  })
</script>

<div bind:this={gameContainer} />

