<script lang="ts">
	import Deepdwn from "$lib/components/Deepdwn.svelte";
</script>

<Deepdwn />

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
