<template>
  <Navigation />
  <Screen class="relative" />
  <div class="flex z-10 absolute bottom-0 left-0 controls w-screen">
    <!-- Left div -->
    <div class="w-1/2" @pointerdown="goLeft()" @pointerup="game.resetLeftMovement()"></div>
    <!-- Right div -->
    <div class="w-1/2" @pointerdown="goRight()" @pointerup="game.resetRightMovement()"></div>
  </div>
</template>

<script setup lang="ts">
import Navigation from "./components/Navigation.vue"
import Screen from "./components/Screen.vue"
import useEngine from "./composeables/use-engine"

const { game } = useEngine()


const goLeft = () => {
  if (game.paused.value !== true) game.playerMoveLeft()
}
const goRight = () => {
  if (game.paused.value !== true) game.playerMoveRight()
}

</script>

<style>
.controls {
  height: calc(100vh - 23px);
}
</style>{}