<template>
    <div ref="gameContainer" v-show="game.paused.value === false">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-white">loading...
        </div>
    </div>
    <div v-if="game.paused.value === true" class="font-share text-lg text-white pl-4">Paused. Hit <span class="text-yellow-400 font-bold">p</span> or <span class="text-yellow-400 font-bold">pause game</span> in the <span class="text-blue-400 font-bold">debug</span> menu.</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import useEngine from "../composeables/use-engine"

const gameContainer = ref()
const { game } = useEngine()

// const smolScreen = () => {
//     if (navigator.userAgent.match(/Android/i)
//          || navigator.userAgent.match(/webOS/i)
//          || navigator.userAgent.match(/iPhone/i)
//          || navigator.userAgent.match(/iPad/i)
//          || navigator.userAgent.match(/iPod/i)
//          || navigator.userAgent.match(/BlackBerry/i)
//          || navigator.userAgent.match(/Windows Phone/i)) {
//             return true 
//          } else {
//             return false
//          }
// }

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