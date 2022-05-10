<script lang="ts">
  import { onMount } from "svelte";
  import { Diesel } from "$lib/scripts/diesel";
  /*
  Updating array, while actor or prop is moving they are pushed to array, when they arrive remove themselves.
  If the array length > 0, animate the screen and prevent input
  Animate only if updating is true and game is locked
  Engine lock remains the same
  Inputhandler only if game is updating is false
  */

  let canvas: any;
  let ctx: any;
  let diesel: Diesel;
  let dieselAnimation;
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
      ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      updateArray.push('player')
      diesel = new Diesel(ctx, dieselAnimation, updateArray, canvas.width, canvas.height);
      // start game
      diesel.init();
      /**
       * Fullscreen
       */
      window.addEventListener("dblclick", () => {
        const fullscreenElement =
          document.fullscreenElement || document.webkitFullscreenElement;
        if (!fullscreenElement) {
          if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
          } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      });
      window.addEventListener("pointermove", function (e) {
        mouse.x = e.x;
        mouse.y = e.y;
      });
      window.addEventListener("resize", function () {
        cancelAnimationFrame(dieselAnimation);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        diesel = new Diesel(ctx, dieselAnimation, updateArray, canvas.width, canvas.height);
        diesel.animate(0);
      });
    });
  });
</script>

<canvas bind:this={canvas} />
