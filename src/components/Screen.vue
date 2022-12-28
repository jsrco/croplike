<template>
    <div ref="gameContainer">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-sm text-white">loading...
        </div>
    </div>
</template>

<script setup lang="ts">
import useScreen from '../composeables/useScreen'
import { onMounted, ref } from 'vue';
import { startScreen } from '../scripts/screens';

const { GameContainerTarget } = useScreen()
const gameContainer = ref(GameContainerTarget)

onMounted(() => {
    useScreen(startScreen)
})
</script>