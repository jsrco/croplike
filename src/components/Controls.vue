<template>
    <div class="flex z-10 absolute bottom-0 left-0 controls w-screen">
      <!-- Left div -->
      <div class="w-1/2" @pointerdown="goLeft()" @pointerup="game.resetMovement()"></div>
      <!-- Right div -->
      <div class="w-1/2" @pointerdown="goRight()" @pointerup="game.resetMovement()"></div>
    </div>
    <div v-if="game.paused.value !== true" class="z-20 absolute bottom-4 right-4 font-share text-yellow-400" @pointerdown="goJump()" @pointerup="game.resetMovement()">
      jump
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" stroke-width="1.5" stroke="currentColor"
        class="w-12 h-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </div>
  </template>
  
  <script setup lang="ts">
  import useEngine from "../composeables/use-engine"
  
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