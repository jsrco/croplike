<script lang="ts">
	import * as THREE from "three";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
	import Deepdwn from "$lib/components/deepdwn.svelte";
	import { fragmentShader } from "$lib/scripts/shaders/fragment";
	import { vertexShader } from "$lib/scripts/shaders/vertex";

	let gameOn = false;
	const endGame = () => {
		location.reload();
	};

	const startGame = () => {
		gameOn = true;

		/**
		 * Base
		 */
		const canvas = document.querySelector("canvas.webgl");
		canvas.style.display = "block";
		const scene = new THREE.Scene();
		const pointer = new THREE.Vector2();

		const clock = new THREE.Clock();
		const raycaster = new THREE.Raycaster();

		function onPointerMove(event) {
			// calculate pointer position in normalized device coordinates
			// (-1 to +1) for both components

			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
		}

		window.addEventListener("pointermove", onPointerMove);

		/**
		 * Object
		 */
		const grid = [];

		const materialType = new THREE.RawShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				uFrequency: { value: new THREE.Vector2(10, 5) },
				uTime: { value: 0 },
				uColor: { value: new THREE.Color("orange") },
			},
		});

		const createGrid = (x, y) => {
			for (let i = -(y / 2); i < y / 2; i++) {
				for (let j = -(x / 2); j < x / 2; j++) {
					const cube = new THREE.Mesh(
						new THREE.BoxGeometry(1, 0.1, 1),
						materialType
						//new THREE.MeshBasicMaterial({
						//	color: 0xff6699,
						//})
					);
					cube.position.x = j * 1.1;
					cube.position.z = i * 1.1;
					grid.push(cube);
					scene.add(cube);
				}
			}
		};
		createGrid(15, 15);
		const material = new THREE.RawShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				uFrequency: { value: new THREE.Vector2(10, 5) },
				uTime: { value: 0 },
				uColor: { value: new THREE.Color("orange") },
			},
		});

		scene.add(material);

		/**
		 * Sizes
		 */
		const sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		window.addEventListener("resize", () => {
			// Update sizes
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();
			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});

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

		/**
		 * Camera
		 */
		const camera = new THREE.PerspectiveCamera(
			75,
			sizes.width / sizes.height,
			0.1,
			100
		);
		camera.position.x = 10.5;
		camera.position.y = 10.5;
		scene.add(camera);

		const controls = new OrbitControls(camera, canvas);
		controls.enableDamping = true;

		/**
		 * Renderer
		 */
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
		});
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		/**
		 * Animate
		 */
		const tick = () => {
			const elapsedTime = clock.getElapsedTime();

			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(pointer, camera);

			// calculate objects intersecting the picking ray

			const intersects = raycaster.intersectObjects(scene.children);

			for (const intersect of intersects) {
				intersect.object.material.wireframe = true;
			}
			for (const gridPiece of grid) {
				if (
					!intersects.find(
						(intersect) => intersect.object === gridPiece
					)
				) {
					gridPiece.material.wireframe = false;
				}
			}

			// Update controls
			controls.update();

			// Render
			renderer.render(scene, camera);

			// Call tick again on the next frame
			window.requestAnimationFrame(tick);
		};
		tick();
	};
</script>

<Deepdwn />
{#if gameOn}
	<p class="link text-red-400" on:click={endGame}>Close</p>
{:else}
	<p class="link text-red-400" on:click={startGame}>Start</p>
{/if}
<canvas class="webgl" />

<style>
	* {
		margin: 0;
		padding: 0;
	}
	.link {
		cursor: pointer;
		font-family: ShareTech;
		margin: 0;
		padding: 0;
		z-index: 2;
	}
	.link,
	.webgl {
		position: fixed;
		top: 0;
		left: 0;
		outline: none;
	}

	.webgl {
		display: none;
	}
	html,
	body {
		overflow: hidden;
	}
</style>
