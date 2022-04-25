<script lang="ts">
	import Deepdwn from "$lib/components/Deepdwn.svelte";
	import type { MinHeap } from "rot-js/lib/MinHeap";
	import { onMount } from "svelte";

	let canvas;
	let ctx;
	let flowField;
	let flowFieldAnimation;

	class FlowFieldEffect {
		#ctx;
		#height;
		#width;
		angle: number;
		interval: number;
		lastTime: number;
		timer: number;
		x: number;
		y: number;

		constructor(ctx, height, width) {
			this.#ctx = ctx;
			this.#ctx.strokeStyle = "white";
			this.#ctx.lineWidth = 5;
			this.#height = height;
			this.#width = width;
			this.angle = 0;
			this.lastTime = 0;
			this.interval = 1000/60;
			this.timer = 0;
		}
		#draw(x, y) {
			const length = 300;
			this.#ctx.beginPath();
			this.#ctx.moveTo(x, y);
			this.#ctx.lineTo(mouse.x, mouse.y);
			this.#ctx.stroke();
		}
		animate(timeStamp) {
			const deltaTime = timeStamp - this.lastTime;
			this.lastTime = timeStamp;
			if (this.timer > this.interval) {
				this.angle += 0.1;
				this.#ctx.clearRect(0, 0, this.#width, this.#height);
				this.#draw(this.#width / 2, this.#height / 2);
				this.timer = 0;
			} else {
				this.timer += deltaTime;
			}
			flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
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
			flowField = new FlowFieldEffect(ctx, canvas.height, canvas.width);
			flowField.animate(0);
		};

		window.addEventListener("mousemove", function (e) {
			mouse.x = e.x;
			mouse.y = e.y;
		});

		window.addEventListener("resize", function () {
			cancelAnimationFrame(flowFieldAnimation);
			canvas.innerHeight = window.innerHeight;
			canvas.innerWidth = window.innerWidth;
			flowField = new FlowFieldEffect(ctx, canvas.height, canvas.width);
			flowField.animate();
		});
	});
</script>

<Deepdwn />
<canvas bind:this={canvas} />
