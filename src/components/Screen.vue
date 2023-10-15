<template>
    <div ref="gameContainer" v-show="game.paused.value === false">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-white">loading...
        </div>
    </div>
    <div v-if="game.paused.value === true" class="font-share text-lg text-white pl-4">Paused. Hit <span
            class="text-yellow-400 font-bold">p</span> or <span class="text-yellow-400 font-bold">pause game</span> in the
        <span class="text-blue-400 font-bold">debug</span> menu.
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import useEngine from "../composeables/use-engine"

const gameContainer = ref()
const { croplikeModule, fieldsModule } = useEngine()

const game = fieldsModule // croplikeModule

onMounted(() => {
    const PressStart2P = new FontFace(
        "PixiPressStart2P",
        "url('./assets/fonts/PressStart2P-Regular.ttf')"
    )

    PressStart2P.load().then(function (font) {
        // with canvas, if this is ommited won't work
        document.fonts.add(font)
        game.startRun()
        game.addCanvas(gameContainer.value)
    })
    
})
</script>
