<template>
  <Navigation />
  <Screen class="relative" />
  <div class="flex z-10 absolute bottom-0 left-0 controls w-screen">
    <!-- Left div -->
    <div class="w-1/2" @pointerdown="goLeft()" @pointerup="game.resetMovement()"></div>
    <!-- Right div -->
    <div class="w-1/2" @pointerdown="goRight()" @pointerup="game.resetMovement()"></div>
  </div>
  <div class="z-20 absolute bottom-4 right-4" @pointerdown="goJump()" @pointerup="game.resetMovement()">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import Navigation from "./components/Navigation.vue"
import Screen from "./components/Screen.vue"
import useEngine from "./composeables/use-engine"

const { game } = useEngine()

const goJump = () => {
  if (game.paused.value !== true) game.playerMoveJump()
}
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