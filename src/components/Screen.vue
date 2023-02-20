<template>
    <div ref="gameContainer">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-sm text-white">loading...
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Engine } from '../scripts/Engine'

const gameContainer = ref()
let game;
onMounted(() => {

    const PressStart2P = new FontFace(
        "PixiPressStart2P",
        "url('./assets/fonts/PressStart2P-Regular.ttf')"
    )
    PressStart2P.load().then(function (font) {
        // with canvas, if this is ommited won't work
        document.fonts.add(font)
        game = new Engine(gameContainer.value)
        game.start()
    })
})
</script>