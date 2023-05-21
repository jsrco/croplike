<template>
  <div v-if="game.paused.value !== true && smolScreen()"
       class="absolute bottom-4 left-4 flex flex-row gap-x-2">
    <div class="border border-3 rounded-lg border-yellow-400 z-20 font-share text-yellow-400 touch-manipulation" @pointerdown="goLeft()"
      @pointerup="game.resetMovement()">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-12 h-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
      </svg>
    </div>
    <div class="border border-3 rounded-lg border-yellow-400 z-20 font-share text-yellow-400 touch-manipulation" @pointerdown="goRight()"
      @pointerup="game.resetMovement()">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-12 h-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
      </svg>
    </div>
  </div>

  <div v-if="game.paused.value !== true && smolScreen()" class="border border-3 rounded-lg border-yellow-400 z-20 absolute bottom-4 right-4 font-share text-yellow-400 touch-manipulation"
    @pointerdown="goJump()" @pointerup="game.resetMovement()">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="w-12 h-12">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  </div>
</template>
  
<script setup lang="ts">
import useEngine from "../composeables/use-engine"
import { smolScreen } from "../scripts/util/Tools"

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
  height: calc(100vh - 36px);
}
</style>{}