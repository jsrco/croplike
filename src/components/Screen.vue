<template>
    <div ref="gameContainer" v-if="!smolScreen()" v-show="game.paused.value === false">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-sm text-white">loading...
        </div>
    </div>
    <div v-else class="font-start text-small text-white pl-2">Mobile not supported. Yet.</div>
    <div v-if="game.paused.value === true" class="font-start text-small text-white pl-2">Paused. Hit 'p' or 'pause game' in the debug menu.</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import useEngine from "../composeables/use-engine"

const gameContainer = ref()
const { game } = useEngine()

const smolScreen = () => {
    if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
            return true 
         } else {
            return false
         }
}

onMounted(() => {
    const PressStart2P = new FontFace(
        "PixiPressStart2P",
        "url('./assets/fonts/PressStart2P-Regular.ttf')"
    )
    PressStart2P.load().then(function (font) {
        // with canvas, if this is ommited won't work
        document.fonts.add(font)
        game.appendElement(gameContainer.value)
    })
})
</script>