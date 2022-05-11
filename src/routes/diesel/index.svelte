<script lang="ts">
  import { onMount } from "svelte";
  import { Diesel } from "$lib/scripts/diesel";
  import type Canvas from "rot-js/lib/display/canvas";
  /*
  Updating array, while actor or prop is moving they are pushed to array, when they arrive remove themselves.
  If the array length > 0, tick the screen and prevent input
  tick only if updating is true and game is locked
  Engine lock remains the same
  Inputhandler only if game is updating is false
  */

  let canvas: Canvas;
  let diesel: Diesel;
  let mouse = {
    radius: 25,
    x: 0,
    y: 0,
  };
  let updateArray: Array<string> = [];

  onMount(() => {
    const PressStart2P = new FontFace(
      "PressStart2P",
      "url(assets/fonts/PressStart2P-Regular.ttf)"
    );
    PressStart2P.load().then(function (font) {
      // with canvas, if this is ommited won't work
      document.fonts.add(font);
      diesel = new Diesel(canvas);
      // start game
      diesel.init();
      window.addEventListener("pointermove", function (e) {
        mouse.x = e.x;
      });
    });
  });
</script>

<canvas bind:this={canvas} />
