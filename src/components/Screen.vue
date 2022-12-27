<template>
    <div ref="gameContainer">
        <div v-if="gameContainer === null" class="font-start pt-1 px-3 sm:px-4 lg:px-5 text-sm text-white">loading...</div>
    </div>
</template>

<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { onMounted, ref } from 'vue';

const gameContainer = ref(null)

let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36,});

onMounted(()=>{
    console.log(typeof gameContainer.value,gameContainer.value)
    gameContainer.value?.appendChild(app.view)
})
</script>