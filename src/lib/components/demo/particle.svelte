<script lang="ts">
  import { onMount } from "svelte";

  let canvas;
  let ctx;
  let diesel;
  let dieselAnimation;
  let mouse = {
    x: null,
    y: null,
    radius: 25,
  };
  let particleArray;
  let textdata;
  class Particle {
    ctx;
    baseX: number;
    baseY: number;
    density: number;
    size: number;
    x: number;
    y: number;
    constructor(ctx, x, y) {
      this.baseX = x;
      this.baseY = y;
      this.ctx = ctx;
      this.density = Math.random() * 30;
      this.size = 1;
      this.x = x;
      this.y = y;
    }
    draw() {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;
      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }
  class Diesel {
    ctx;
    height;
    width;
    interval: number;
    lastTime: number;
    timer: number;
    x: number;
    y: number;
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.height = height;
      this.width = width;
      this.lastTime = 0;
      this.interval = 1000 / 60;
      this.timer = 0;
      this.addParticles();
    }
    addParticles() {
      particleArray = []
      for (let y = 0, y2 = textdata.height; y < y2; y++) {
        for (let x = 0, x2 = textdata.width; x < x2; x++) {
          if (textdata.data[y * 4 * textdata.width + x * 4 + 3] > 128) {
            let positionX = (x + 2) / 48;
            let positionY = (y - 2) / 48;
            particleArray.push(
              new Particle(this.ctx, positionX * 64, positionY * 64)
            );
          }
        }
      }
    }
    animate(timeStamp) {
      const deltaTime = timeStamp - this.lastTime;
      this.lastTime = timeStamp;
      if (this.timer > this.interval) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // draw here
        for (let i = 0; i < particleArray.length; i++) {
          particleArray[i].draw();
          particleArray[i].update();
        }
        this.timer = 0;
      } else {
        this.timer += deltaTime;
      }
      dieselAnimation = requestAnimationFrame(this.animate.bind(this));
    }
  }

  onMount(() => {
    ctx = canvas.getContext("2d");
    ctx.font = "24px 'PressStart2P'";
    ctx.fillStyle = "white";
    ctx.fillText("croplike", 0, 30);
    textdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    diesel = new Diesel(ctx, canvas.height, canvas.width);
    diesel.animate(0);

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
      diesel = new Diesel(ctx, canvas.height, canvas.width);
      diesel.animate(0);
    });
  });
</script>

<canvas bind:this={canvas} />
