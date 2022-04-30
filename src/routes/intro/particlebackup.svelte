<script lang="ts">
  import Deepdwn from "$lib/components/Deepdwn.svelte";
  import type { MinHeap } from "rot-js/lib/MinHeap";
  import { onMount } from "svelte";

  let canvas;
  let ctx;
  let diesel;
  let dieselAnimation;
  let mouse = {
    x: null,
    y: null,
    radius: 50,
  };
  class Particle {
    #ctx;
    #baseX: number;
    #baseY: number;
    #density: number;
    #size: number;
    #x: number;
    #y: number;
    constructor(ctx, x, y) {
      this.#baseX = x;
      this.#baseY = y;
      this.#ctx = ctx;
      this.#density = Math.random() * 30 + 1;
      this.#size = 1;
      this.#x = x;
      this.#y = y;
    }
    draw() {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.#x, this.#y, this.#size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      let dx = mouse.x - this.#x;
      let dy = mouse.y - this.#y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.#density;
      let directionY = forceDirectionY * force * this.#density;
      if (distance < mouse.radius) {
        this.#x -= directionX;
        this.#y -= directionY;
      } else {
        if (this.#x !== this.#baseX) {
          let dx = this.#x - this.#baseX;
          this.#x -= dx / 10;
        }
        if (this.#y !== this.#baseY) {
          let dy = this.#y - this.#baseY;
          this.#y -= dy / 10;
        }
      }
    }
  }
  class Diesel {
    #ctx;
    #height;
    #width;
    #interval: number;
    #lastTime: number;
    #particleArray: Array<Particle>;
    #timer: number;
    #x: number;
    #y: number;

    constructor(ctx, height, width) {
      this.#ctx = ctx;
      this.#ctx.font = "30px 'PressStart2P', cursive";
      this.#ctx.fillStyle = "white";
      this.#height = height;
      this.#width = width;
      this.#lastTime = 0;
      this.#interval = 1000 / 60;
      this.#particleArray = [];
      this.#timer = 0;
      this.#addParticles();
    }
    #drawText(text, x, y) {
      this.#ctx.fillText(text, x, y);
    }
    #addParticles() {
      for (let i = 0; i < 10000; i++) {
        this.#particleArray.push(
          new Particle(
            this.#ctx,
            Math.random() * this.#width,
            Math.random() * this.#height
          )
        );
      }
    }
    animate(timeStamp) {
      const deltaTime = timeStamp - this.#lastTime;
      this.#lastTime = timeStamp;
      if (this.#timer > this.#interval) {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        // draw here
        for (let i = 0; i < this.#particleArray.length; i++) {
          this.#particleArray[i].draw();
          this.#particleArray[i].update();
        }
        this.#drawText("croplike", this.#width / 2, this.#height / 2);
        this.#timer = 0;
      } else {
        this.#timer += deltaTime;
      }
      dieselAnimation = requestAnimationFrame(this.animate.bind(this));
    }
  }

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
