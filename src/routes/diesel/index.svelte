<script lang="ts">
  import { onMount } from "svelte";

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
  let dieselAnimation: any;
  let mouse = {
    radius: 25,
    x: 0,
    y: 0,
  };
  let updateArray: Array<any> = [];

  class Diesel {
    #ctx: CanvasRenderingContext2D;
    #cellSize: number;
    #interval: number;
    #lastTime: number;
    #locked: boolean;
    #timer: number;
    #updating: Array<any>;

    constructor(ctx: CanvasRenderingContext2D) {
      this.#cellSize = 25;
      this.#ctx = ctx;
      this.#ctx.font = "24px 'PressStart2P'";
      this.#ctx.fillStyle = "white";
      this.#ctx.fillText("croplike", 0, 30);
      this.#interval = 1000 / 60;
      this.#lastTime = 0;
      // start with a locked game
      this.#locked = true;
      this.#timer = 0;
      this.#updating = updateArray;
    }
    // engine mechanics
    #EngineLock(tracking: string) {
      if (this.#locked)
        console.log([
          tracking,
          "failed",
          "Game already locked. You should not be trying the action.",
        ]);
      else this.#locked = true;
    }
    #EngineUnlock(tracking: string) {
      if (!this.#locked)
        console.log([
          tracking,
          "failed",
          "Game already unlocked. You should not be trying the action.",
        ]);
      else {
        this.#locked = false;
        this.#EngineUpdate(tracking);
      }
    }
    #EngineUpdate(tracking: string) {
      if (this.#locked)
        console.log([
          tracking,
          "failed",
          "Game is locked. You should not be trying to update the engine.",
        ]);
      else {
        // handle reactions and moves
        this.#EngineLock(tracking);
        console.log([tracking, "succeeded", "Game has been updated."]);
      }
    }
    animate(timeStamp: number) {
      if (this.#locked && this.#updating.length > 0) {
        const deltaTime = timeStamp - this.#lastTime;
        this.#lastTime = timeStamp;
        if (this.#timer > this.#interval) {
          this.#ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          this.drawGrid();
          //player
          this.#ctx.fillRect(2, 2, 22, 22);
          this.#timer = 0;
        } else {
          this.#timer += deltaTime;
        }
      }
      dieselAnimation = requestAnimationFrame(this.animate.bind(this));
    }
    drawGrid() {
      for (
        let y = 2;
        y + this.#cellSize < window.innerHeight;
        y += this.#cellSize
      ) {
        for (
          let x = 2;
          x + this.#cellSize < window.innerWidth;
          x += this.#cellSize
        ) {
          this.drawGridPiece(x, y);
        }
      }
    }
    drawGridPiece(x: number, y: number) {
      this.#ctx.strokeStyle = "white";
      this.#ctx.lineWidth = 1;
      this.#ctx.beginPath();
      this.#ctx.moveTo(x, y);
      this.#ctx.rect(x, y, 22, 22);
      this.#ctx.stroke();
    }
    test(action: string) {
      if (this.#updating[0] !== "player") this.#updating.push("player");

      this.#EngineUpdate(action);
      this.#EngineUnlock(action);
    }
  }

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
      diesel = new Diesel(ctx);
      // start game
      diesel.animate(0);
      diesel.test("animation test");
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
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        diesel = new Diesel(ctx);
        diesel.animate(0);
      });
    });
  });
</script>

<div class="fontLoad" />
<canvas bind:this={canvas} />

<style>
  .fontLoad {
    font-family: PressStart2P;
  }
</style>
