<script>
    import Metrics from "$lib/stores/metricStore";

    let debug = false;
</script>

<section
    class="console bottom-0 flex flex-col text-white top-0"
>
    <div class="pl-3 select-none">
        <p>
            <span class="text-blue-400">Keyboard Events</span>: {$Metrics.totalKeyboardEvents}
        </p>
        <p>
            <span class="text-red-400">Mouse Events</span>: <span class="text-yellow-400">{$Metrics.totalMouseEvents}</span>
        </p>
        <p>
            <span class="text-blue-400">Total Moves</span>: {$Metrics.totalMoves}
        </p>
        <p>
            <span class="text-blue-400">TOD</span>: {$Metrics.time}
        </p>
        <p>
            {#if !debug}Console{:else}Debug{/if}
        </p>
        <p class="mb-4 text-green-400" on:click={() => (debug = !debug)}>
            C <span class="text-white">/</span> D
        </p>
    </div>

    <div class="consoleScroll border-4 border-white h-full overflow-y-auto p-2 relative rounded-lg">
        {#if !debug}
            {#each $Metrics.consoleData as consoleOutput}
                <p>{consoleOutput}</p>
            {/each}
        {:else}
            {#each $Metrics.debugData as debugOutput}
                <p>{debugOutput}</p>
            {/each}
        {/if}
    </div>
</section>

<style>
    .console {
        font-family: ShareTech;
        width: 296px;
    }

    .consoleScroll {
        height: 280px;
        scrollbar-color: #fff rgba(29, 29, 29, 0.8);
        scrollbar-width: thin;
    }
</style>
