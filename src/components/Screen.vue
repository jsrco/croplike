<template>
    <div ref="gameContainer">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-sm text-white">loading...
        </div>
    </div>
</template>

<script setup lang="ts">
import useScreen from '../composeables/useScreen'
import * as PIXI from 'pixi.js'
import { onMounted, ref } from 'vue';

const { setScreenSize } = useScreen()

const gameContainer = ref()

const startScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, });

const style = new PIXI.TextStyle({
    fontFamily: 'PressStart2p',
    fontSize: 36,
    fill: ['#4ade80'],
});

const richText = new PIXI.Text('a start screen', style);
richText.x = 10
richText.y = 10

startScreen.stage.addChild(richText)

onMounted(() => {
    useScreen(startScreen)
    gameContainer.value?.appendChild(startScreen.view)

})
</script>