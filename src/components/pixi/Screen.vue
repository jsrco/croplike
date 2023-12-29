<template>
    <div ref="gameContainer" v-show="!isPaused">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-white">loading...
        </div>
    </div>
    <div v-if="isPaused" class="font-share text-lg text-white pl-4">Paused. Hit <span
            class="text-yellow-400 font-bold">p</span> or <span class="text-yellow-400 font-bold">pause game</span> in the
        <span class="text-blue-400 font-bold">debug</span> menu.
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import useEngine from "../../composeables/use-engine"

const gameContainer = ref()
const { activeModule } = useEngine()

const isPaused = ref(false)
watch(() => activeModule.value.paused, (newVal) => {
    isPaused.value = newVal
})

onMounted(() => {
    const PressStart2P = new FontFace(
        "PixiPressStart2P",
        "url('./assets/fonts/PressStart2P-Regular.ttf')"
    )

    useEngine(gameContainer.value)

    PressStart2P.load().then(function (font) {
        // with canvas, if this is ommited won't work
        document.fonts.add(font)
        activeModule.value.startRun()
        activeModule.value.addCanvas(gameContainer.value)
    })
})
</script>
