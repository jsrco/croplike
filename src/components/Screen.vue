<template>
    <div ref="gameContainer">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-sm text-white">loading...
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const gameContainer = ref(null)

onMounted(() => {
    // this will start the game up and use gameContainer as a ref to the div above
    // once storage is implmented, start ecs and load game data 
    console.dir(gameContainer)
})
</script>