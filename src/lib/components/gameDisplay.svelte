<script>
	import Console from "$lib/components/gameUI/console.svelte";
	import MouseOverInfo from "$lib/components/gameUI/mouseOverInfo.svelte";
	import Game from "$lib/stores/gameStore";
	import { onMount } from "svelte";

	let gameContainer;

	let move;

	onMount(() => {
		$Game.init(gameContainer);
		move = (dx, dy, d, inputType) => {
			Game.clickMove(dx, dy, d, inputType);
		};
	});
</script>

<section class="displayOptions">
		<MouseOverInfo />
		<div
			bind:this={gameContainer}
			class="border-4 border-white mb-4 relative rounded-lg "
		>
			<!-- Screen Control Element -->
			<div
				class="absolute inset-0 m-auto z-1 flex flex-wrap justify-between"
			>
				<div
					on:click={move(-1, -1, 7, 1)}
					class="screen-control bg-opacity-0 bg-red-400"
				/>
				<div
					on:click={move(0, -1, 0, 1)}
					class="screen-control bg-opacity-0 bg-blue-400"
				/>
				<div
					on:click={move(1, -1, 1, 1)}
					class="screen-control bg-opacity-0 bg-green-400"
				/>
				<div
					on:click={move(-1, 0, 6, 1)}
					class="screen-control bg-opacity-0 bg-red-400"
				/>
				<div
					on:click={move(0, 0, "player", 1)}
					class="screen-control bg-opacity-0 bg-yellow-400"
				/>
				<div
					on:click={move(1, 0, 2, 1)}
					class="screen-control bg-opacity-0 bg-green-400"
				/>
				<div
					on:click={move(-1, 1, 5, 1)}
					class="screen-control bg-opacity-0 bg-red-400"
				/>
				<div
					on:click={move(0, 1, 4, 1)}
					class="screen-control bg-opacity-0 bg-blue-400"
				/>
				<div
					on:click={move(1, 1, 3, 1)}
					class="screen-control bg-opacity-0 bg-green-400"
				/>
			</div>
		</div>
		<Console />
</section>


<style>
    .displayOptions {
		align-items: center;
		background: #1d1d1d;
		bottom: 0px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		left: 0px;
		position: absolute;
		right: 0px;
		top: 0px;
	}

	.screen-control {
		position: relative;
		margin-bottom: 0.1%;
		width: 33.3%;
	}
</style>