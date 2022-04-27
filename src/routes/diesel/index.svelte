<script lang="ts">
  import Deepdwn from "$lib/components/Deepdwn.svelte";
  import type { MinHeap } from "rot-js/lib/MinHeap";
  import { onMount } from "svelte";

  let canvas;
  let ctx;
  let diesel;
  let dieselAnimation;

  class Diesel {
    #ctx;
    #height;
    #width;
    angle: number;
    cellSize: number;
    interval: number;
    lastTime: number;
    timer: number;
    x: number;
    y: number;

    constructor(ctx, height, width) {
      this.#ctx = ctx;
      this.#ctx.strokeStyle = "white";
      this.#ctx.lineWidth = 1;
      this.#height = height;
      this.#width = width;
      this.angle = 0;
      this.lastTime = 0;
      this.interval = 1000 / 60;
      this.timer = 0;
      this.cellSize = 30;
    }
    #drawGridPiece(x, y) {
      const length = 300;
      this.#ctx.beginPath();
      this.#ctx.moveTo(x, y);
      this.#ctx.rect(x,y,27,27)
      this.#ctx.stroke();
    }
    animate(timeStamp) {
      const deltaTime = timeStamp - this.lastTime;
      this.lastTime = timeStamp;
      if (this.timer > this.interval) {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for (let y = 2; y + this.cellSize < this.#height; y += this.cellSize) {
          for (let x = 2; x + this.cellSize < this.#width; x += this.cellSize) {
            this.#drawGridPiece(x, y);
          }
        }
        this.timer = 0;
      } else {
        this.timer += deltaTime;
      }
      dieselAnimation = requestAnimationFrame(this.animate.bind(this));
    }
  }

  let mouse = {
    x: 0,
    y: 0,
  };

  onMount(() => {
    window.onload = function () {
      ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      diesel = new Diesel(ctx, canvas.height, canvas.width);
      diesel.animate(0);
    };

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener("resize", function () {
      cancelAnimationFrame(dieselAnimation);
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      diesel = new Diesel(ctx, canvas.height, canvas.width);
      diesel.animate(0);
    });
  });
</script>

<canvas bind:this={canvas} />
