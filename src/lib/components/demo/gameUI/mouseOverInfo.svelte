<script>
    import Metrics from "$lib/stores/demo/metricStore";
</script>

<section class="mounseOverInfo flex flex-col mb-4 text-white">
    {#if $Metrics.mouseEventData.name}
        <p>
            <span class="text-purple-400">Name</span>: {$Metrics.mouseEventData.name}
        </p>
        <p>
            <span class="text-purple-400">Explored</span>: {$Metrics.mouseEventData.explored}
        </p>
        <p>
            <span class="text-purple-400">Walkable</span>: {$Metrics.mouseEventData.walkable}
        </p>
    {:else}
        <p class="text-purple-400">Mouseover game map</p>
        <p class="text-purple-400">for basic tile info</p>
        <p class="text-purple-400">FOV pending info inc.</p>
    {/if}
</section>

<style>
    .mounseOverInfo {
        font-family: ShareTech;
        width: 330px;
    }
</style>
