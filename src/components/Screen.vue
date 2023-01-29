<template>
    <div ref="gameContainer">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-sm text-white">loading...
        </div>
    </div>
</template>

<script setup lang="ts">
import useCartographer from '../composeables/useCartographer'
import useScreen from '../composeables/useScreen'
import { onMounted, ref } from 'vue';
import { startScreen } from '../scripts/startScreen';
import { RAD_TO_DEG } from 'pixi.js';

const { map } = useCartographer()


const { GameContainerTarget } = useScreen()
const gameContainer = ref(GameContainerTarget)

onMounted(() => {
    console.log(map.value)
    useScreen(startScreen)
})
</script>